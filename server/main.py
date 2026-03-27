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

from server.config import CORS_ORIGINS, KNOWN_FACES_DIR
from server.db import init_db, sync_known_faces_from_disk
from server.routers import api_events, api_persons, api_status, api_settings, ws_camera, ws_feed

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    added = await sync_known_faces_from_disk(KNOWN_FACES_DIR)
    if added:
        logger.info("Synced %d person(s) from known_faces/ directory", added)
    logger.info("Attend.ai API server ready")
    yield
    logger.info("Attend.ai API server stopping")


app = FastAPI(title="Attend.ai API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_camera.router)
app.include_router(ws_feed.router)
app.include_router(api_status.router)
app.include_router(api_events.router)
app.include_router(api_persons.router)
app.include_router(api_settings.router)


if __name__ == "__main__":
    import uvicorn
    from server.config import HOST, PORT
    uvicorn.run(app, host=HOST, port=PORT)
