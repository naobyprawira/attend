"""REST endpoints for detection event queries."""

from fastapi import APIRouter, Query

from server.db.crud.events import get_events, get_event_stats

router = APIRouter()


@router.get("/api/events")
async def list_events(
    limit: int = Query(50, ge=1, le=200),
    cursor: str | None = Query(None),
    event_type: str | None = Query(None, alias="type"),
    person: str | None = Query(None),
    from_timestamp: str | None = Query(None, alias="from"),
    to_timestamp: str | None = Query(None, alias="to"),
    camera_id: str | None = Query(None),
    priority: str | None = Query(None),
) -> dict:
    """Query detection events with optional filters. Returns paginated result."""
    return await get_events(
        limit=limit,
        cursor=cursor,
        event_type=event_type,
        person=person,
        from_timestamp=from_timestamp,
        to_timestamp=to_timestamp,
        camera_id=camera_id,
        priority=priority,
    )


@router.get("/api/events/stats")
async def event_stats() -> dict:
    """Aggregate event statistics: counts by type, most seen person."""
    return await get_event_stats()
