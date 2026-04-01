"""Database initialization via Alembic migrations."""

import asyncio
import logging
from pathlib import Path

from alembic import command
from alembic.config import Config

logger = logging.getLogger(__name__)

# Path to alembic.ini, relative to this file's package root (server/)
_ALEMBIC_INI = str(Path(__file__).parent.parent / "alembic.ini")


def _run_migrations() -> None:
    """Synchronous Alembic upgrade — safe to call from a thread."""
    cfg = Config(_ALEMBIC_INI)
    command.upgrade(cfg, "head")
    # alembic's fileConfig resets the root logger to WARNING — restore it
    logging.getLogger().setLevel(logging.INFO)


async def init_db() -> None:
    """Run any pending Alembic migrations to bring the schema up to date.

    Alembic's own async support uses asyncio.run() internally, which cannot
    be called from within a running event loop. We delegate to a thread
    executor so the main event loop is not blocked or nested.
    """
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _run_migrations)
    logger.info("Database schema up to date")


def get_db_path() -> str:
    from server.config import DB_PATH
    return DB_PATH
