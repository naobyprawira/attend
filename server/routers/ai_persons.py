"""Internal known-faces endpoint for the AI backend."""

import base64
import logging
import os

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from server.config import KNOWN_FACES_DIR
from server.core.deps import require_api_key
from server.db.crud.persons import get_known_faces

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/internal", tags=["internal"])


class InternalPersonOut(BaseModel):
    id: int
    name: str
    photo_path: str
    photo_base64: str


@router.get("/persons", response_model=list[InternalPersonOut])
async def list_internal_persons(_: None = Depends(require_api_key)) -> list[InternalPersonOut]:
    """Return known faces with inline base64 photo payloads for bulk AI sync."""
    items: list[InternalPersonOut] = []

    for face in await get_known_faces():
        path = os.path.join(KNOWN_FACES_DIR, face["photo_path"])
        if not os.path.isfile(path):
            logger.warning("Known face photo missing: %s", path)
            continue

        try:
            with open(path, "rb") as fh:
                photo_b64 = base64.b64encode(fh.read()).decode("ascii")
        except OSError as exc:
            logger.warning("Failed to read known face photo %s: %s", path, exc)
            continue

        items.append(
            InternalPersonOut(
                id=face["id"],
                name=face["name"],
                photo_path=face["photo_path"],
                photo_base64=photo_b64,
            )
        )

    return items
