"""REST endpoints for server settings."""

import logging

from fastapi import APIRouter
from pydantic import BaseModel

from server import config
from server.state import state

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/settings", tags=["settings"])


class SettingsResponse(BaseModel):
    face_detection_enabled: bool = True
    face_recognition_enabled: bool = True
    confidence_threshold: float
    recognition_model: str
    yolo_enabled: bool = True
    temporal_alpha: float
    target_fps: int
    jpeg_quality: int
    gpu_available: bool = False
    gpu_name: str = ""
    yolo_model: str
    face_model: str
    server_uptime: int = 0


class SettingsUpdate(BaseModel):
    confidence_threshold: float | None = None
    temporal_alpha: float | None = None
    target_fps: int | None = None
    jpeg_quality: int | None = None


@router.get("")
async def get_settings() -> dict:
    """Return current detection and system settings."""
    gpu_available = False
    gpu_name = ""
    try:
        import torch
        gpu_available = torch.cuda.is_available()
        if gpu_available:
            gpu_name = torch.cuda.get_device_name(0)
    except ImportError:
        pass

    return {
        "face_detection_enabled": True,
        "face_recognition_enabled": True,
        "confidence_threshold": config.FACE_DISTANCE_THRESHOLD,
        "recognition_model": config.FACE_RECOGNITION_MODEL,
        "yolo_enabled": True,
        "temporal_alpha": config.TEMPORAL_ALPHA,
        "target_fps": config.FPS_TARGET,
        "jpeg_quality": config.JPEG_QUALITY,
        "gpu_available": gpu_available,
        "gpu_name": gpu_name,
        "yolo_model": config.YOLO_MODEL,
        "face_model": config.FACE_RECOGNITION_MODEL,
        "server_uptime": state.uptime,
    }


@router.put("")
async def update_settings(update: SettingsUpdate) -> dict:
    """Update mutable settings. Changes take effect on next frame."""
    if update.confidence_threshold is not None:
        config.FACE_DISTANCE_THRESHOLD = update.confidence_threshold
    if update.temporal_alpha is not None:
        config.TEMPORAL_ALPHA = update.temporal_alpha
    if update.target_fps is not None:
        config.FPS_TARGET = update.target_fps
    if update.jpeg_quality is not None:
        config.JPEG_QUALITY = update.jpeg_quality

    logger.info("Settings updated: %s", update.model_dump(exclude_none=True))
    return {"status": "ok"}
