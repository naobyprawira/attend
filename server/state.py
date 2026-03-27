"""Shared mutable application state for the Attend.ai server.

Replaces module-level globals with a single AppState instance.
All fields are accessed via `state.*` throughout the codebase.
"""

import asyncio
import logging
import time

import cv2
import numpy as np
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class AppState:
    """Holds all runtime state: connections, counters, cached frames/masks."""

    def __init__(self) -> None:
        # Connections
        self.viewers: dict[WebSocket, str] = {}  # ws → bg mode
        self.camera_ws: WebSocket | None = None
        self.camera_connected: bool = False

        # Counters
        self.start_time: float = time.time()
        self.frame_count: int = 0
        self.faces_detected_total: int = 0

        # Latest frame data
        self.latest_normal_frame: bytes = b""
        self.latest_metadata: dict | None = None
        self.latest_detections: list[dict] = []

        # Segmentation mask (pre-computed 3-channel uint8 arrays)
        self.mask_bgr: np.ndarray | None = None
        self.mask_bgr_inv: np.ndarray | None = None
        self._previous_mask: np.ndarray | None = None

        # Background processing lock
        self.bg_lock: asyncio.Lock = asyncio.Lock()
        self.bg_busy: bool = False

    @property
    def uptime(self) -> int:
        return int(time.time() - self.start_time)

    @property
    def viewer_count(self) -> int:
        return len(self.viewers)

    def update_mask(self, mask: np.ndarray, temporal_alpha: float = 0.6) -> None:
        """Apply temporal smoothing and cache 3-channel blending arrays.

        Args:
            mask: Grayscale uint8 mask (H, W), 0-255.
            temporal_alpha: Blend ratio. 1.0 = only current, 0.0 = only previous.
        """
        if self._previous_mask is not None and self._previous_mask.shape == mask.shape:
            mask = cv2.addWeighted(mask, temporal_alpha, self._previous_mask, 1 - temporal_alpha, 0)
        self._previous_mask = mask.copy()
        self.mask_bgr = cv2.merge([mask, mask, mask])
        self.mask_bgr_inv = 255 - self.mask_bgr


# Module-level singleton
state = AppState()
