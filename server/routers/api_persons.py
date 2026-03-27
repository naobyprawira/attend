"""REST endpoints for person management (known faces database).

Endpoints:
    GET    /api/persons          — List all registered persons
    POST   /api/persons          — Register a new person (name + photo)
    GET    /api/persons/:id      — Person detail with recognition stats
    DELETE /api/persons/:id      — Remove a person
    GET    /api/persons/:id/photo — Serve person's photo
"""

import logging
import os

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

import cv2
import numpy as np

from server.config import KNOWN_FACES_DIR
from server.db import delete_known_face, get_known_faces, insert_known_face, get_events, count_events_for_person
from server.services.face_recognizer import reload_known_faces, crop_largest_face

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/persons", tags=["persons"])


@router.get("")
async def list_persons() -> list[dict]:
    """List all registered persons with their recognition counts."""
    faces = await get_known_faces()
    for face in faces:
        face["recognition_count"] = await count_events_for_person(face["name"])
        face["photo_url"] = f"/api/persons/{face['id']}/photo"
    return faces


@router.post("")
async def register_person(
    name: str = Form(..., description="Person's name"),
    photo: UploadFile = File(..., description="Face photo (JPEG/PNG)"),
) -> dict:
    """Register a new person by uploading their photo."""
    filename = photo.filename or "photo.jpg"
    if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
        raise HTTPException(400, "Only JPG and PNG files are accepted")

    person_dir = os.path.join(KNOWN_FACES_DIR, name)
    os.makedirs(person_dir, exist_ok=True)
    filepath = os.path.join(person_dir, filename)

    try:
        content = await photo.read()
        # Decode, crop face, and save the cropped version
        arr = np.frombuffer(content, dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(400, "Could not decode image")
        face_crop = crop_largest_face(img)
        cv2.imwrite(filepath, face_crop)
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to save photo: %s", e)
        raise HTTPException(500, "Failed to save photo")

    relative_path = os.path.relpath(filepath, KNOWN_FACES_DIR)
    await insert_known_face(name=name, photo_path=relative_path)
    reload_known_faces()
    logger.info("Registered person: %s", name)

    return {"status": "ok", "name": name, "photo_path": relative_path}


@router.get("/{person_id}")
async def get_person(person_id: int) -> dict:
    """Get person detail with recent recognition events."""
    faces = await get_known_faces()
    person = next((f for f in faces if f["id"] == person_id), None)
    if not person:
        raise HTTPException(404, "Person not found")

    events = await get_events(limit=50, event_type="face_recognized", person=person["name"])
    person["recent_events"] = events
    person["recognition_count"] = len(events)
    person["photo_url"] = f"/api/persons/{person_id}/photo"
    return person


@router.delete("/{person_id}")
async def remove_person(person_id: int) -> dict:
    """Remove a person from the database."""
    await delete_known_face(person_id)
    reload_known_faces()
    return {"status": "ok"}


@router.get("/{person_id}/photo")
async def get_person_photo(person_id: int) -> FileResponse:
    """Serve a person's photo file."""
    faces = await get_known_faces()
    person = next((f for f in faces if f["id"] == person_id), None)
    if not person:
        raise HTTPException(404, "Person not found")

    filepath = os.path.join(KNOWN_FACES_DIR, person["photo_path"])
    if not os.path.isfile(filepath):
        raise HTTPException(404, "Photo file not found")

    return FileResponse(filepath)
