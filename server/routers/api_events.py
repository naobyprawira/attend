"""REST endpoints for detection event queries."""

from fastapi import APIRouter, Query

from server.db import get_events, get_event_stats

router = APIRouter()


@router.get("/api/events")
async def list_events(
    limit: int = Query(50, ge=1, le=500),
    event_type: str | None = Query(None, alias="type", description="Filter by event type"),
    person: str | None = Query(None, description="Filter by person name"),
    from_timestamp: str | None = Query(None, alias="from", description="ISO 8601 start date"),
) -> list[dict]:
    """Query detection events with optional filters."""
    return await get_events(
        limit=limit, event_type=event_type, person=person, from_timestamp=from_timestamp
    )


@router.get("/api/events/stats")
async def event_stats() -> dict:
    """Aggregate event statistics: counts by type, most seen person."""
    return await get_event_stats()
