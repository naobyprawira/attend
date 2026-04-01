"""WebSocket endpoint for camera frame ingestion.

Protocol:
    Camera sends binary messages: [8-byte timestamp (big-endian float64, epoch ms)] + [JPEG bytes]
    Legacy cameras may send bare JPEG (detected by 0xFFD8 magic bytes).

Processing pipeline:
    Fast path (~10ms): decode → timestamp overlay → composite with cached mask → encode → broadcast
    Background (~150ms): face detection → face recognition → YOLO segmentation → mask update
"""

import asyncio
import base64
import json
import logging
import struct
import time
from datetime import datetime, timezone

import cv2
import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from server.config import TEMPORAL_ALPHA, THUMBNAIL_SIZE, THUMBNAIL_QUALITY, EVENT_COOLDOWN_SECONDS
from server.state import state
from server.services.frame_processor import process_frame
from server.services.face_detector import detect_faces, crop_face
from server.services.face_recognizer import recognize
from server.services.segmentor import segment_persons
from server.services.mask_refiner import refine_mask
from server.db.crud import events as db

logger = logging.getLogger(__name__)
router = APIRouter()

# Track last event time per identity to suppress duplicates
_last_event_time: dict[str, float] = {}
_CLEANUP_INTERVAL = 300  # clean up stale entries every 5 min
_last_cleanup = 0.0


def _should_emit_event(identity: str) -> bool:
    """Check if enough time has passed since the last event for this identity."""
    global _last_cleanup
    now = time.time()

    # Periodic cleanup of stale entries
    if now - _last_cleanup > _CLEANUP_INTERVAL:
        cutoff = now - EVENT_COOLDOWN_SECONDS * 2
        stale = [k for k, v in _last_event_time.items() if v < cutoff]
        for k in stale:
            del _last_event_time[k]
        _last_cleanup = now

    last = _last_event_time.get(identity, 0)
    if now - last < EVENT_COOLDOWN_SECONDS:
        return False
    _last_event_time[identity] = now
    return True


@router.websocket("/ws/camera")
async def websocket_camera(ws: WebSocket):
    """Accept a camera WebSocket connection and process incoming frames."""
    await ws.accept()
    state.camera_ws = ws
    state.camera_connected = True
    logger.info("Camera connected")
    _bg_task: asyncio.Task | None = None

    async def run_background_processing(frame: np.ndarray) -> None:
        """Background task: face detection + recognition + YOLO segmentation."""
        try:
            # Face detection (~5ms) — frame is already our own copy
            detections = await asyncio.to_thread(detect_faces, frame)

            # Face recognition for each detected face
            for detection in detections:
                face_crop = crop_face(frame, detection["bbox"])
                if face_crop.size == 0:
                    continue

                identity, confidence, source = await asyncio.to_thread(recognize, face_crop)
                if not identity:
                    identity = "Unknown"
                    source = "unknown"

                detection["name"] = identity
                detection["confidence"] = confidence
                detection["source"] = source

                # Create thumbnail
                thumbnail = cv2.resize(face_crop, THUMBNAIL_SIZE)
                _, buffer = cv2.imencode(".jpg", thumbnail, [cv2.IMWRITE_JPEG_QUALITY, THUMBNAIL_QUALITY])
                detection["thumbnail"] = base64.b64encode(buffer).decode()

                # Store event + broadcast only if cooldown has passed for this identity
                if _should_emit_event(identity):
                    event_type = "face_recognized" if source == "recognized" else "unknown_face"
                    await db.insert_event(
                        event_type=event_type,
                        person_name=identity,
                        confidence=confidence,
                        bbox=detection["bbox"],
                        thumbnail=detection["thumbnail"],
                        frame_number=state.frame_count,
                    )

                    # Broadcast face capture to viewers
                    capture_message = json.dumps({
                        "type": "face_capture",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "name": identity,
                        "confidence": confidence,
                        "thumbnail": detection["thumbnail"],
                        "bbox": detection["bbox"],
                        "source": detection["source"],
                    })
                    for viewer_ws in list(state.viewers.keys()):
                        try:
                            await viewer_ws.send_text(capture_message)
                        except Exception:
                            logger.debug("Failed to send face capture to viewer", exc_info=True)

            # Strip thumbnails from detections stored in state (sent every frame in metadata)
            state.latest_detections = [
                {k: v for k, v in d.items() if k != "thumbnail"} for d in detections
            ]
            if detections:
                state.faces_detected_total += len(detections)

            # YOLO segmentation (~10-120ms depending on GPU/CPU)
            raw_mask = await asyncio.to_thread(segment_persons, frame)
            if raw_mask is not None:
                frame_h, frame_w = frame.shape[:2]
                refined = await asyncio.to_thread(refine_mask, raw_mask, frame_w, frame_h)
                state.update_mask(refined, TEMPORAL_ALPHA)

        except Exception:
            logger.error("Background processing failed", exc_info=True)
        finally:
            state.bg_busy = False

    try:
        while True:
            data = await ws.receive_bytes()
            receive_timestamp = time.time() * 1000
            state.frame_count += 1

            # Parse optional timestamp prefix
            if data[:2] == b'\xff\xd8':
                camera_timestamp = receive_timestamp
                jpeg_bytes = data
            else:
                camera_timestamp = struct.unpack('>d', data[:8])[0]
                jpeg_bytes = data[8:]

            # Collect active background modes
            bg_modes = set(state.viewers.values()) - {"normal"}

            # Fast path: decode → stamp → composite → encode
            normal_jpeg, bg_jpegs, raw_frame = await asyncio.to_thread(
                process_frame, jpeg_bytes, bg_modes, state.mask_bgr
            )
            send_timestamp = time.time() * 1000
            state.latest_normal_frame = normal_jpeg

            # Kick off background processing (non-blocking)
            if not state.bg_busy and raw_frame is not None:
                state.bg_busy = True
                _bg_task = asyncio.create_task(run_background_processing(raw_frame))

            if state.frame_count % 60 == 1:
                processing_ms = round(send_timestamp - receive_timestamp, 1)
                logger.info(
                    "frame=%d fast=%sms bg_modes=%s mask=%s",
                    state.frame_count, processing_ms,
                    bg_modes or "none",
                    "yes" if state.mask_bgr is not None else "no",
                )

            # Build metadata
            metadata = {
                "type": "frame_metadata",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "frame": state.frame_count,
                "faces": len(state.latest_detections),
                "detections": state.latest_detections,
                "camera_ts": camera_timestamp,
                "server_ts": send_timestamp,
                "processing_ms": round(send_timestamp - receive_timestamp, 1),
            }
            state.latest_metadata = metadata
            metadata_json = json.dumps(metadata)

            # Broadcast to all viewers
            disconnected = []
            for viewer_ws, mode in list(state.viewers.items()):
                frame_data = bg_jpegs.get(mode, normal_jpeg) if mode != "normal" else normal_jpeg
                try:
                    await viewer_ws.send_bytes(frame_data)
                    await viewer_ws.send_text(metadata_json)
                except Exception:
                    disconnected.append(viewer_ws)
            for viewer_ws in disconnected:
                state.viewers.pop(viewer_ws, None)

    except WebSocketDisconnect:
        pass
    finally:
        state.camera_connected = False
        state.camera_ws = None
        if _bg_task and not _bg_task.done():
            _bg_task.cancel()
        logger.info("Camera disconnected")
