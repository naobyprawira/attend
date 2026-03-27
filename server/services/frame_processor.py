"""Fast-path frame processing: decode, timestamp, composite, encode.

This module handles the latency-critical path (~8-12ms per frame).
Background removal compositing uses pre-computed mask arrays for speed.
"""

from datetime import datetime

import cv2
import numpy as np

from server.config import JPEG_QUALITY, BLUR_KERNEL, GREEN_SCREEN_COLOR


def process_frame(
    jpeg_bytes: bytes,
    bg_modes: set[str],
    mask_bgr: np.ndarray | None,
) -> tuple[bytes, dict[str, bytes], np.ndarray | None]:
    """Decode a JPEG frame, add timestamp, composite per background mode.

    Args:
        jpeg_bytes: Raw JPEG bytes from camera.
        bg_modes: Set of active background modes (e.g. {"green", "blur"}).
        mask_bgr: Pre-computed 3-channel uint8 mask, or None.

    Returns:
        Tuple of (normal_jpeg, {mode: jpeg}, decoded_frame_or_None).
    """
    arr = np.frombuffer(jpeg_bytes, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if frame is None:
        return jpeg_bytes, {}, None

    timestamp_text = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Encode normal frame
    normal = frame.copy()
    _stamp(normal, timestamp_text)
    _, encoded = cv2.imencode(".jpg", normal, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
    normal_jpeg = encoded.tobytes()

    # Composite per background mode
    bg_frames: dict[str, bytes] = {}
    alpha = mask_bgr.astype(np.float32) / 255.0 if mask_bgr is not None else None
    frame_float: np.ndarray | None = None

    for mode in bg_modes:
        composited = _composite(frame, mode, alpha, frame_float)
        if composited is None:
            continue
        # Cache frame_float after first use
        if frame_float is None and alpha is not None:
            frame_float = frame.astype(np.float32)
        _stamp(composited, timestamp_text)
        _, enc = cv2.imencode(".jpg", composited, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
        bg_frames[mode] = enc.tobytes()

    return normal_jpeg, bg_frames, frame


def _composite(
    frame: np.ndarray,
    mode: str,
    alpha: np.ndarray | None,
    frame_float: np.ndarray | None,
) -> np.ndarray | None:
    """Composite foreground onto a background for one mode."""
    if alpha is None:
        # No mask available — show full background effect
        if mode == "green":
            return np.full_like(frame, GREEN_SCREEN_COLOR)
        elif mode == "black":
            return np.zeros_like(frame)
        elif mode == "blur":
            return cv2.GaussianBlur(frame, BLUR_KERNEL, 0)
        return None

    if frame_float is None:
        frame_float = frame.astype(np.float32)

    if mode == "green":
        bg = np.full_like(frame_float, GREEN_SCREEN_COLOR, dtype=np.float32)
    elif mode == "black":
        bg = np.zeros_like(frame_float)
    elif mode == "blur":
        bg = cv2.GaussianBlur(frame_float, BLUR_KERNEL, 0)
    else:
        return None

    return (frame_float * alpha + bg * (1.0 - alpha)).astype(np.uint8)


def _stamp(frame: np.ndarray, text: str) -> None:
    """Draw timestamp text onto a frame (mutates in place)."""
    cv2.putText(frame, text, (10, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
