"""Attend.ai API server.

Pure REST + WebSocket API. No HTML serving. The frontend (Next.js)
runs as a separate process and connects to this server.

Usage:
    python -m server.main
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.config import CORS_ORIGINS, KNOWN_FACES_DIR, SERVER_ROLE
from server.core.auth import hash_password
from server.core.errors import register_exception_handlers
from server.db.engine import init_db
from server.db.crud.persons import sync_known_faces_from_disk
from server.db.crud.users import create_user, user_exists
from server.routers import ai_events, ai_persons, auth, events, persons, settings, status, users

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Server role: %s", SERVER_ROLE)
    await init_db()
    if SERVER_ROLE in {"ai", "all"}:
        added = await sync_known_faces_from_disk(KNOWN_FACES_DIR)
        if added:
            logger.info("Synced %d person(s) from known_faces/ directory", added)
    if SERVER_ROLE in {"app", "all"} and not await user_exists():
        await create_user(
            username="admin",
            email="admin@attend.local",
            hashed_password=hash_password("admin"),
            role="super_admin",
        )
        logger.info("Default super admin user created (username: admin, password: admin)")
    logger.info("Attend.ai API server ready")
    yield
    logger.info("Attend.ai API server stopping")


app = FastAPI(title="Attend.ai API", version="0.1.0", lifespan=lifespan)

register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status.router)
app.include_router(ai_events.router)
app.include_router(ai_persons.router)
if SERVER_ROLE in {"app", "all"}:
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(events.router)
    app.include_router(persons.router)
    app.include_router(settings.router)

if SERVER_ROLE == "app":
    from server.routers.ws import proxy as ws_proxy

    app.include_router(ws_proxy.router)
elif SERVER_ROLE in {"ai", "all"}:
    from server.routers.ws import camera as ws_camera
    from server.routers.ws import feed as ws_feed

    app.include_router(ws_camera.router)
    app.include_router(ws_feed.router)


if __name__ == "__main__":
    import uvicorn
    from server.config import HOST, PORT
    uvicorn.run(app, host=HOST, port=PORT)
