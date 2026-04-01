"""CRUD operations for detection events."""

import base64
import json
import logging
from datetime import datetime, timezone

from sqlalchemy import func, select, update

from server.models import Event
from server.db.session import get_session

logger = logging.getLogger(__name__)


def _event_to_dict(event: Event) -> dict:
    return {
        "id": event.id,
        "timestamp": event.timestamp,
        "event_type": event.event_type,
        "person_name": event.person_name,
        "confidence": event.confidence,
        "bbox": json.loads(event.bbox) if event.bbox else None,
        "thumbnail": event.thumbnail,
        "frame_number": event.frame_number,
        "camera_id": event.camera_id,
        "priority": event.priority,
        "acknowledged": bool(event.acknowledged),
        "acknowledged_by": event.acknowledged_by,
        "acknowledged_at": event.acknowledged_at,
    }


async def insert_event(
    event_type: str,
    person_name: str | None = None,
    confidence: float | None = None,
    bbox: list | None = None,
    thumbnail: str | None = None,
    frame_number: int | None = None,
    camera_id: str | None = None,
    priority: str = "medium",
) -> int:
    """Insert a detection event. Returns the new row id."""
    async with get_session() as session:
        event = Event(
            timestamp=datetime.now(timezone.utc).isoformat(),
            event_type=event_type,
            person_name=person_name,
            confidence=confidence,
            bbox=json.dumps(bbox) if bbox is not None else None,
            thumbnail=thumbnail,
            frame_number=frame_number,
            camera_id=camera_id,
            priority=priority,
        )
        session.add(event)
        await session.commit()
        await session.refresh(event)
        return event.id


async def get_events(
    limit: int = 50,
    cursor: str | None = None,
    event_type: str | None = None,
    person: str | None = None,
    camera_id: str | None = None,
    from_timestamp: str | None = None,
    to_timestamp: str | None = None,
    priority: str | None = None,
) -> dict:
    """Query events with optional filters. Returns paginated result."""
    stmt = select(Event)

    if event_type:
        stmt = stmt.where(Event.event_type == event_type)
    if person:
        stmt = stmt.where(Event.person_name.like(f"%{person}%"))
    if camera_id:
        stmt = stmt.where(Event.camera_id == camera_id)
    if from_timestamp:
        stmt = stmt.where(Event.timestamp >= from_timestamp)
    if to_timestamp:
        stmt = stmt.where(Event.timestamp <= to_timestamp)
    if priority:
        stmt = stmt.where(Event.priority == priority)
    if cursor:
        decoded = json.loads(base64.b64decode(cursor).decode())
        stmt = stmt.where(Event.id < decoded["id"])

    stmt = stmt.order_by(Event.id.desc()).limit(limit + 1)

    async with get_session() as session:
        result = await session.execute(stmt)
        rows = [_event_to_dict(e) for e in result.scalars()]

    has_more = len(rows) > limit
    items = rows[:limit]

    next_cursor = None
    if has_more and items:
        next_cursor = base64.b64encode(
            json.dumps({"id": items[-1]["id"]}).encode()
        ).decode()

    return {"items": items, "next_cursor": next_cursor, "has_more": has_more}


async def get_event_by_id(event_id: int) -> dict | None:
    """Fetch a single event by ID."""
    async with get_session() as session:
        event = await session.get(Event, event_id)
    return _event_to_dict(event) if event else None


async def acknowledge_event(event_id: int, acknowledged_by: str) -> dict | None:
    """Mark an event as acknowledged."""
    now = datetime.now(timezone.utc).isoformat()
    async with get_session() as session:
        await session.execute(
            update(Event)
            .where(Event.id == event_id)
            .values(acknowledged=1, acknowledged_by=acknowledged_by, acknowledged_at=now)
        )
        await session.commit()
    return await get_event_by_id(event_id)


async def get_event_stats(
    from_timestamp: str | None = None,
    to_timestamp: str | None = None,
    camera_id: str | None = None,
) -> dict:
    """Aggregate stats: counts by type today, most seen person."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    async with get_session() as session:
        # Today's counts by event_type
        type_stmt = (
            select(Event.event_type, func.count().label("count"))
            .where(Event.timestamp >= today)
        )
        if camera_id:
            type_stmt = type_stmt.where(Event.camera_id == camera_id)
        type_stmt = type_stmt.group_by(Event.event_type)

        type_result = await session.execute(type_stmt)
        type_counts = {row.event_type: row.count for row in type_result}

        # Most seen person (all time)
        top_person_result = await session.execute(
            select(Event.person_name, func.count().label("count"))
            .where(Event.person_name.is_not(None))
            .group_by(Event.person_name)
            .order_by(func.count().desc())
            .limit(1)
        )
        top_person = top_person_result.first()

        # Total events
        total = await session.execute(select(func.count()).select_from(Event))
        total_count = total.scalar_one()

    return {
        "today": {
            "face_recognized": type_counts.get("face_recognized", 0),
            "unknown_face": type_counts.get("unknown_face", 0),
        },
        "total_events": total_count,
        "most_seen": {"person_name": top_person.person_name, "count": top_person.count}
        if top_person
        else None,
    }
