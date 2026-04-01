"""WebSocket endpoint for dashboard feed viewers.

Endpoint: /ws/feed

Protocol:
    Server → Client (binary): JPEG frame bytes.
    Server → Client (text):   JSON frame_metadata or face_capture events.
    Client → Server (text):   JSON commands, e.g. {"bg": "green"}.
"""

import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from server.state import state

logger = logging.getLogger(__name__)
router = APIRouter()

VALID_BG_MODES = {"normal", "green", "blur", "black"}


@router.websocket("/ws/feed")
async def websocket_feed(ws: WebSocket):
    """Accept a viewer WebSocket connection and stream frames + metadata."""
    await ws.accept()
    state.viewers[ws] = "normal"
    logger.info("Viewer connected (%d total)", state.viewer_count)

    if state.latest_normal_frame:
        try:
            await ws.send_bytes(state.latest_normal_frame)
        except Exception:
            logger.debug("Failed to send initial frame", exc_info=True)

    if state.latest_metadata:
        try:
            await ws.send_text(json.dumps(state.latest_metadata))
        except Exception:
            logger.debug("Failed to send initial metadata", exc_info=True)

    try:
        while True:
            message = await ws.receive_text()
            try:
                data = json.loads(message)
                if "bg" in data and data["bg"] in VALID_BG_MODES:
                    previous = state.viewers[ws]
                    state.viewers[ws] = data["bg"]
                    logger.info("Viewer bg: %s -> %s", previous, data["bg"])
            except (json.JSONDecodeError, KeyError):
                logger.debug("Invalid viewer message: %s", message)
    except WebSocketDisconnect:
        pass
    finally:
        state.viewers.pop(ws, None)
        logger.info("Viewer disconnected (%d total)", state.viewer_count)
