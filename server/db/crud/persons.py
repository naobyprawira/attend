"""CRUD operations for known faces / persons."""

import json
import logging
import os
from datetime import datetime, timezone

from sqlalchemy import func, select, update, delete

from server.models import Event, KnownFace
from server.db.session import get_session

logger = logging.getLogger(__name__)


def _face_to_dict(face: KnownFace) -> dict:
    return {
        "id": face.id,
        "name": face.name,
        "photo_path": face.photo_path,
        "created_at": face.created_at,
    }


async def get_known_faces() -> list[dict]:
    """List all registered known faces."""
    async with get_session() as session:
        result = await session.execute(
            select(KnownFace).order_by(KnownFace.name)
        )
        return [_face_to_dict(f) for f in result.scalars()]


async def get_known_face_by_id(face_id: int) -> dict | None:
    """Fetch a single known face by ID."""
    async with get_session() as session:
        face = await session.get(KnownFace, face_id)
    return _face_to_dict(face) if face else None


async def insert_known_face(
    name: str, photo_path: str, embedding: list | None = None
) -> int:
    """Register a new known face. Returns new row id."""
    async with get_session() as session:
        face = KnownFace(
            name=name,
            photo_path=photo_path,
            embedding=json.dumps(embedding) if embedding is not None else None,
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        session.add(face)
        await session.commit()
        await session.refresh(face)
        return face.id


async def update_known_face(
    face_id: int,
    name: str | None = None,
    photo_path: str | None = None,
    embedding: list | None = None,
) -> None:
    """Update mutable fields on a known face."""
    values: dict = {}
    if name is not None:
        values["name"] = name
    if photo_path is not None:
        values["photo_path"] = photo_path
    if embedding is not None:
        values["embedding"] = json.dumps(embedding)
    if not values:
        return
    async with get_session() as session:
        await session.execute(
            update(KnownFace).where(KnownFace.id == face_id).values(**values)
        )
        await session.commit()


async def delete_known_face(face_id: int) -> None:
    """Remove a known face by ID."""
    async with get_session() as session:
        await session.execute(delete(KnownFace).where(KnownFace.id == face_id))
        await session.commit()


async def count_events_for_person(person_name: str) -> int:
    """Count recognition events for a specific person."""
    async with get_session() as session:
        result = await session.execute(
            select(func.count()).where(
                Event.event_type == "face_recognized",
                Event.person_name == person_name,
            )
        )
        return result.scalar_one()


async def get_known_face_embeddings() -> list[tuple[str, list]]:
    """Load all cached embeddings for in-memory comparison."""
    async with get_session() as session:
        result = await session.execute(
            select(KnownFace.name, KnownFace.embedding).where(
                KnownFace.embedding.is_not(None)
            )
        )
        return [(name, json.loads(embedding)) for name, embedding in result]


async def sync_known_faces_from_disk(known_faces_dir: str) -> int:
    """Scan known_faces/ directory and insert any persons not yet in the DB.

    Returns the number of newly inserted entries.
    """
    existing = await get_known_faces()
    existing_paths = {f["photo_path"] for f in existing}

    added = 0
    os.makedirs(known_faces_dir, exist_ok=True)
    for person_name in os.listdir(known_faces_dir):
        if person_name.startswith("."):
            continue
        person_dir = os.path.join(known_faces_dir, person_name)
        if not os.path.isdir(person_dir):
            continue
        for filename in os.listdir(person_dir):
            if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
                continue
            relative_path = os.path.join(person_name, filename)
            if relative_path not in existing_paths:
                await insert_known_face(name=person_name, photo_path=relative_path)
                added += 1
                logger.info("Synced person from disk: %s (%s)", person_name, filename)

    return added
