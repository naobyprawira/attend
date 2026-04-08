"""Internal event ingest endpoints for the AI backend."""

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field

from server.core.deps import require_api_key
from server.db.crud.events import insert_event

router = APIRouter(prefix="/api/internal", tags=["internal"])


class InternalEventIn(BaseModel):
    event_type: str = Field(..., min_length=1)
    person_name: str | None = None
    confidence: float | None = None
    bbox: list[int | float] | None = None
    thumbnail: str | None = None
    frame_number: int | None = None
    camera_id: str | None = None


@router.post("/events", status_code=status.HTTP_201_CREATED)
async def create_internal_event(
    payload: InternalEventIn,
    _: None = Depends(require_api_key),
) -> dict:
    """Accept events from the external AI service and persist them."""
    event_id = await insert_event(
        event_type=payload.event_type,
        person_name=payload.person_name,
        confidence=payload.confidence,
        bbox=payload.bbox,
        thumbnail=payload.thumbnail,
        frame_number=payload.frame_number,
        camera_id=payload.camera_id,
    )
    return {"status": "ok", "id": event_id}
