"""Detection event schemas."""

from pydantic import BaseModel


class DetectionEvent(BaseModel):
    id: int
    timestamp: str
    event_type: str  # "face_recognized" | "unknown_face"
    person_name: str | None
    confidence: float | None
    bbox: list[int] | None
    thumbnail_url: str | None
    camera_id: str | None
    camera_name: str | None
    frame_number: int | None
    priority: str  # "high" | "medium" | "low"
    acknowledged: bool
    acknowledged_by: str | None
    acknowledged_at: str | None


class EventStats(BaseModel):
    today: dict
    total_events: int
    most_seen: dict | None


class AcknowledgeResponse(BaseModel):
    id: int
    acknowledged: bool
    acknowledged_by: str
    acknowledged_at: str
