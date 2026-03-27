"""Face recognition service using ONNX Runtime (GPU-accelerated).

Uses a Facenet512 ONNX model for embedding extraction, with GPU inference
via ONNX Runtime's CUDA execution provider. Falls back to CPU if CUDA is
unavailable. Maintains compatibility with DeepFace-generated embeddings.

Also tracks unknown faces across frames so the same unrecognized person
keeps a consistent label (e.g. "Unknown #3") instead of getting a new
number every detection.
"""

import logging
import os
import time

import cv2
import numpy as np
import onnxruntime as ort

from server.config import (
    FACE_DISTANCE_THRESHOLD,
    KNOWN_FACES_DIR,
)

logger = logging.getLogger(__name__)

# ── ONNX session ────────────────────────────────────────────
_onnx_session: ort.InferenceSession | None = None
_ONNX_MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "facenet512.onnx")
_INPUT_SIZE = (160, 160)

# Known face embeddings: [(name, embedding_vector), ...]
_known_embeddings: list[tuple[str, np.ndarray]] = []
_initialized = False

# Unknown face tracking: label → (embedding, last_seen_time)
_unknown_cache: dict[str, tuple[np.ndarray, float]] = {}
_unknown_counter = 0
_UNKNOWN_MATCH_THRESHOLD = 15.0  # L2 distance to consider same unknown person
_UNKNOWN_EXPIRE_SECONDS = 300    # forget unknowns after 5 minutes
_MAX_UNKNOWN_CACHE = 200         # cap unknown cache size


def _get_onnx_session() -> ort.InferenceSession:
    """Lazy-load the ONNX session with GPU support."""
    global _onnx_session
    if _onnx_session is not None:
        return _onnx_session

    # Add PyTorch's bundled CUDA DLLs to PATH so ONNX Runtime can find them
    try:
        import torch
        import pathlib
        torch_lib = str(pathlib.Path(torch.__file__).parent / 'lib')
        os.environ['PATH'] = torch_lib + os.pathsep + os.environ.get('PATH', '')
    except ImportError:
        pass

    providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
    _onnx_session = ort.InferenceSession(_ONNX_MODEL_PATH, providers=providers)
    active = _onnx_session.get_providers()
    device = "GPU (CUDA)" if "CUDAExecutionProvider" in active else "CPU"
    logger.info("Facenet512 ONNX loaded on %s", device)

    # Warm up
    dummy = np.zeros((1, 160, 160, 3), dtype=np.float32)
    _onnx_session.run(None, {"input_1": dummy})

    return _onnx_session


def _preprocess_face(face_bgr: np.ndarray) -> np.ndarray:
    """Resize and normalize a face crop for Facenet512 input.

    Matches DeepFace's preprocessing pipeline exactly:
    1. Normalize pixels to [0, 1]
    2. Letterbox-resize to 160x160 (pad with black, preserve aspect ratio)
    """
    h, w = face_bgr.shape[:2]
    face_float = face_bgr.astype(np.float32) / 255.0

    # Letterbox resize (same as DeepFace's resize_image)
    target_h, target_w = _INPUT_SIZE
    scale = min(target_h / h, target_w / w)
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(face_float, (new_w, new_h))

    # Pad to target size
    pad_top = (target_h - new_h) // 2
    pad_left = (target_w - new_w) // 2
    canvas = np.zeros((target_h, target_w, 3), dtype=np.float32)
    canvas[pad_top:pad_top + new_h, pad_left:pad_left + new_w] = resized

    return np.expand_dims(canvas, axis=0)


def extract_embedding(face_bgr: np.ndarray) -> np.ndarray | None:
    """Extract a face embedding vector from a BGR face crop using ONNX."""
    try:
        session = _get_onnx_session()
        input_tensor = _preprocess_face(face_bgr)
        result = session.run(None, {"input_1": input_tensor})
        return result[0][0].astype(np.float32)
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
