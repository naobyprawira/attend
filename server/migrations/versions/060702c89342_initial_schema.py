"""initial_schema

Revision ID: 060702c89342
Revises: 
Create Date: 2026-03-31 20:03:13.955613

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '060702c89342'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp       TEXT    NOT NULL,
            event_type      TEXT    NOT NULL,
            person_name     TEXT,
            confidence      REAL,
            bbox            TEXT,
            thumbnail       TEXT,
            frame_number    INTEGER,
            camera_id       TEXT,
            priority        TEXT    NOT NULL DEFAULT 'medium',
            acknowledged    INTEGER NOT NULL DEFAULT 0,
            acknowledged_by TEXT,
            acknowledged_at TEXT
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_events_type      ON events(event_type)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_events_person    ON events(person_name)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_events_camera    ON events(camera_id)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS known_faces (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            photo_path  TEXT    NOT NULL,
            embedding   TEXT,
            created_at  TEXT    NOT NULL
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS idx_faces_name ON known_faces(name)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            username        TEXT    NOT NULL UNIQUE,
            email           TEXT    NOT NULL UNIQUE,
            hashed_password TEXT    NOT NULL,
            role            TEXT    NOT NULL DEFAULT 'operator',
            status          TEXT    NOT NULL DEFAULT 'active',
            last_login      TEXT,
            created_at      TEXT    NOT NULL
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token       TEXT    NOT NULL UNIQUE,
            expires_at  TEXT    NOT NULL,
            created_at  TEXT    NOT NULL
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS refresh_tokens")
    op.execute("DROP TABLE IF EXISTS users")
    op.execute("DROP TABLE IF EXISTS known_faces")
    op.execute("DROP TABLE IF EXISTS events")
