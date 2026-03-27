"""SQLite database layer for events and known faces.

Tables:
    events      — timestamped detection events (face seen, recognized, unknown).
    known_faces — registered people with photo paths and cached embeddings.
"""

import json
import logging
import os
from datetime import datetime, timezone

import aiosqlite

from server.config import DB_PATH

logger = logging.getLogger(__name__)

SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    event_type TEXT NOT NULL,
    person_name TEXT,
    confidence REAL,
    bbox TEXT,
    thumbnail TEXT,
    frame_number INTEGER
);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_person ON events(person_name);

CREATE TABLE IF NOT EXISTS known_faces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    photo_path TEXT NOT NULL,
    embedding TEXT,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_faces_name ON known_faces(name);
"""


async def init_db() -> None:
    """Create tables and indexes if they don't exist."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript(SCHEMA)
        await db.commit()
    logger.info("Database ready: %s", DB_PATH)


# ── Events ────────────────────────────────────────────────────


async def insert_event(
    event_type: str,
    person_name: str | None = None,
    confidence: float | None = None,
    bbox: list | None = None,
    thumbnail: str | None = None,
    frame_number: int | None = None,
) -> None:
    """Insert a detection event."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO events (timestamp, event_type, person_name, confidence, bbox, thumbnail, frame_number) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                datetime.now(timezone.utc).isoformat(),
                event_type,
                person_name,
                confidence,
                json.dumps(bbox) if bbox else None,
                thumbnail,
                frame_number,
            ),
        )
        await db.commit()


async def get_events(
    limit: int = 50,
    event_type: str | None = None,
    person: str | None = None,
    from_timestamp: str | None = None,
) -> list[dict]:
    """Query events with optional filters."""
    query = "SELECT * FROM events WHERE 1=1"
    params: list = []
    if event_type:
        query += " AND event_type = ?"
        params.append(event_type)
    if person:
        query += " AND person_name = ?"
        params.append(person)
    if from_timestamp:
        query += " AND timestamp >= ?"
        params.append(from_timestamp)
    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(query, params)
        return [dict(row) for row in await cursor.fetchall()]


async def get_event_stats() -> dict:
    """Aggregate stats: counts by type today, most seen person."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        cursor = await db.execute(
            "SELECT event_type, COUNT(*) as count FROM events "
            "WHERE timestamp >= ? GROUP BY event_type",
            (today,),
        )
        type_counts = {row["event_type"]: row["count"] for row in await cursor.fetchall()}

        cursor = await db.execute(
            "SELECT person_name, COUNT(*) as count FROM events "
            "WHERE person_name IS NOT NULL GROUP BY person_name "
            "ORDER BY count DESC LIMIT 1"
        )
        top_person = await cursor.fetchone()

        return {
            "today": type_counts,
            "total_events": sum(type_counts.values()),
            "most_seen": dict(top_person) if top_person else None,
        }


# ── Known Faces ───────────────────────────────────────────────


async def get_known_faces() -> list[dict]:
    """List all registered known faces."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT id, name, photo_path, created_at FROM known_faces ORDER BY name")
        return [dict(row) for row in await cursor.fetchall()]


async def insert_known_face(name: str, photo_path: str, embedding: list | None = None) -> None:
    """Register a new known face."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO known_faces (name, photo_path, embedding, created_at) VALUES (?, ?, ?, ?)",
            (
                name,
                photo_path,
                json.dumps(embedding) if embedding else None,
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        await db.commit()


async def delete_known_face(face_id: int) -> None:
    """Remove a known face by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM known_faces WHERE id = ?", (face_id,))
        await db.commit()


async def count_events_for_person(person_name: str) -> int:
    """Count recognition events for a specific person (efficient)."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT COUNT(*) FROM events WHERE event_type = 'face_recognized' AND person_name = ?",
            (person_name,),
        )
        row = await cursor.fetchone()
        return row[0] if row else 0


async def get_known_face_embeddings() -> list[tuple[str, list]]:
    """Load all cached embeddings for in-memory comparison."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT name, embedding FROM known_faces WHERE embedding IS NOT NULL")
        return [(row["name"], json.loads(row["embedding"])) for row in await cursor.fetchall()]


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
