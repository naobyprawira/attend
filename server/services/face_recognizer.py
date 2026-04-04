"""Face recognition service using DeepFace (Facenet512).

Uses DeepFace's official Facenet512 model for embedding extraction.
Model is auto-downloaded by DeepFace on first use.

Also tracks unknown faces across frames so the same unrecognized person
keeps a consistent label (e.g. "Unknown #3") instead of getting a new
number every detection.
"""

import logging
import os
import time

import cv2
import numpy as np
from deepface import DeepFace

from server.config import (
    FACE_DISTANCE_THRESHOLD,
    KNOWN_FACES_DIR,
)

logger = logging.getLogger(__name__)

# Known face embeddings: [(name, embedding_vector), ...]
_known_embeddings: list[tuple[str, np.ndarray]] = []
_initialized = False

# Unknown face tracking: label → (embedding, last_seen_time)
_unknown_cache: dict[str, tuple[np.ndarray, float]] = {}
_unknown_counter = 0
_UNKNOWN_MATCH_THRESHOLD = 15.0  # L2 distance to consider same unknown person
_UNKNOWN_EXPIRE_SECONDS = 300    # forget unknowns after 5 minutes
_MAX_UNKNOWN_CACHE = 200         # cap unknown cache size

_MODEL_NAME = "Facenet512"


def extract_embedding(face_bgr: np.ndarray) -> np.ndarray | None:
    """Extract a face embedding vector from a BGR face crop using DeepFace."""
    try:
        face_rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
        result = DeepFace.represent(
            img_path=face_rgb,
            model_name=_MODEL_NAME,
            enforce_detection=False,
            detector_backend="skip",
        )
        return np.array(result[0]["embedding"], dtype=np.float32)
    except Exception:
        logger.debug("Embedding extraction failed", exc_info=True)
        return None


def crop_largest_face(img: np.ndarray) -> np.ndarray:
    """Detect and crop the largest face from an image.

    Falls back to the original image if no face is found.
    """
    from server.services.face_detector import detect_faces, crop_face

    detections = detect_faces(img)
    if not detections:
        logger.debug("No face detected in image, using full image")
        return img

    # Pick the largest detection by area
    largest = max(detections, key=lambda d: d["bbox"][2] * d["bbox"][3])
    return crop_face(img, largest["bbox"])


def load_known_faces() -> None:
    """Scan known_faces/ directory and extract embeddings for all photos."""
    global _known_embeddings, _initialized
    _known_embeddings = []

    os.makedirs(KNOWN_FACES_DIR, exist_ok=True)

    count = 0
    for person_name in os.listdir(KNOWN_FACES_DIR):
        if person_name.startswith("."):
            continue
        person_dir = os.path.join(KNOWN_FACES_DIR, person_name)
        if not os.path.isdir(person_dir):
            continue
        for filename in os.listdir(person_dir):
            if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
                continue
            filepath = os.path.join(person_dir, filename)
            try:
                img = cv2.imread(filepath)
                if img is None:
                    continue
                face_crop = crop_largest_face(img)
                embedding = extract_embedding(face_crop)
                if embedding is not None:
                    _known_embeddings.append((person_name, embedding))
                    count += 1
            except Exception:
                logger.warning("Failed to extract embedding: %s", filepath, exc_info=True)

    _initialized = True
    unique_people = len(set(name for name, _ in _known_embeddings))
    logger.info("Loaded %d embeddings for %d people", count, unique_people)


def _match_unknown(embedding: np.ndarray) -> str | None:
    """Check if this embedding matches a recently seen unknown face.
    Returns the existing label if matched, None if it's a new unknown."""
    now = time.time()

    # Clean expired entries
    expired = [k for k, (_, ts) in _unknown_cache.items()
               if now - ts >= _UNKNOWN_EXPIRE_SECONDS]
    for k in expired:
        del _unknown_cache[k]

    # Find closest recent unknown
    for label, (cached_emb, _) in _unknown_cache.items():
        distance = float(np.linalg.norm(embedding - cached_emb))
        if distance < _UNKNOWN_MATCH_THRESHOLD:
            # Update timestamp (still being seen)
            _unknown_cache[label] = (cached_emb, now)
            return label

    return None


def recognize(face_bgr: np.ndarray) -> tuple[str | None, float, str]:
    """Compare a face crop against known embeddings.

    Returns:
        (identity, confidence, source) where:
        - identity: person name, "Unknown #N", or None on failure
        - confidence: 0.0-1.0
        - source: "recognized" | "unknown"
    """
    global _unknown_counter

    if not _initialized:
        load_known_faces()

    embedding = extract_embedding(face_bgr)
    if embedding is None:
        return None, 0.0, "unknown"

    # Compare against known faces
    best_name: str | None = None
    best_distance = float("inf")
    for name, known_embedding in _known_embeddings:
        distance = float(np.linalg.norm(embedding - known_embedding))
        if distance < best_distance:
            best_distance = distance
            best_name = name

    # Log for tuning
    if _known_embeddings:
        logger.info("Face match: best=%s dist=%.2f threshold=%.1f",
                     best_name, best_distance, FACE_DISTANCE_THRESHOLD)

    if best_distance < FACE_DISTANCE_THRESHOLD:
        confidence = max(0.0, min(1.0, 1.0 - (best_distance / FACE_DISTANCE_THRESHOLD)))
        return best_name, round(confidence, 3), "recognized"

    # Not recognized — check if we've seen this unknown before
    existing_label = _match_unknown(embedding)
    if existing_label:
        return existing_label, 0.0, "unknown"

    # Brand new unknown face — cap cache size
    if len(_unknown_cache) >= _MAX_UNKNOWN_CACHE:
        oldest_key = min(_unknown_cache, key=lambda k: _unknown_cache[k][1])
        del _unknown_cache[oldest_key]

    _unknown_counter += 1
    label = f"Unknown #{_unknown_counter}"
    _unknown_cache[label] = (embedding, time.time())
    return label, 0.0, "unknown"


def reload_known_faces() -> None:
    """Re-scan known_faces directory. Call after adding or removing photos."""
    global _initialized
    _initialized = False
    load_known_faces()
