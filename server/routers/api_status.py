"""REST endpoint for server status."""

from fastapi import APIRouter

from server.state import state

router = APIRouter()


@router.get("/api/status")
async def get_status() -> dict:
    """Return current server status: connection state, counters, uptime."""
    return {
        "camera_connected": state.camera_connected,
        "viewer_count": state.viewer_count,
        "uptime": state.uptime,
        "total_frames": state.frame_count,
        "faces_detected_total": state.faces_detected_total,
    }
