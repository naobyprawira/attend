"""System status and health endpoints."""

import time

from fastapi import APIRouter

from server.state import state

router = APIRouter(tags=["system"])

_start_time = time.time()
VERSION = "0.1.0"


@router.get("/api/health")
async def health() -> dict:
    """Readiness probe — no auth required."""
    return {
        "status": "healthy",
        "version": VERSION,
        "uptime": int(time.time() - _start_time),
    }


@router.get("/api/ready")
async def ready() -> dict:
    """Liveness probe — no auth required."""
    return {"status": "ok"}


@router.get("/api/status")
async def get_status() -> dict:
    """Return current server status: connection state, counters, uptime."""
    return {
        "cameras_online": 1 if state.camera_connected else 0,
        "cameras_total": 1 if state.camera_connected else 0,
        "viewer_count": state.viewer_count,
        "uptime": state.uptime,
        "total_frames": state.frame_count,
        "faces_detected_total": state.faces_detected_total,
        "gpu_available": False,
        "gpu_name": "",
    }
