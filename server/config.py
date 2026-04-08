"""Centralized configuration for the Attend.ai server."""

import os
from pathlib import Path

from dotenv import load_dotenv

# Load .env from the project root (one level above server/)
load_dotenv(Path(__file__).parent.parent / ".env")

# Limit internal thread counts BEFORE importing heavy libraries.
# Prevents YOLO/numpy from saturating all CPU cores.
os.environ["OMP_NUM_THREADS"] = "2"
os.environ["MKL_NUM_THREADS"] = "2"
os.environ["OPENBLAS_NUM_THREADS"] = "2"

import cv2

cv2.setNumThreads(2)

# ── Server ────────────────────────────────────────────────────
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5678"))
SERVER_ROLE = os.getenv("SERVER_ROLE", "app").strip().lower()
AI_WS_UPSTREAM_URL = os.getenv("AI_WS_UPSTREAM_URL", "ws://ai-backend:5679").rstrip("/")
ATTEND_API_KEY = os.getenv("ATTEND_API_KEY", "")

_DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
]
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", ",".join(_DEFAULT_CORS_ORIGINS)).split(",")
    if origin.strip()
]

# ── Camera / Frame ────────────────────────────────────────────
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FPS_TARGET = 15
JPEG_QUALITY = 80
THUMBNAIL_SIZE = (80, 80)
THUMBNAIL_QUALITY = 60
BLUR_KERNEL = (21, 21)
GREEN_SCREEN_COLOR = (0, 177, 64)  # BGR

# ── Event Cooldown ────────────────────────────────────────────
EVENT_COOLDOWN_SECONDS = 30  # suppress duplicate events for same identity within this window

# ── Face Detection (Haar Cascade) ─────────────────────────────
FACE_MIN_SIZE = (40, 40)
FACE_SCALE_FACTOR = 1.1
FACE_MIN_NEIGHBORS = 5

# ── Face Recognition (DeepFace) ──────────────────────────────
FACE_RECOGNITION_MODEL = "Facenet512"
FACE_DETECTOR_BACKEND = "skip"  # we crop faces ourselves via Haar
FACE_DISTANCE_THRESHOLD = 23.56  # L2 euclidean for Facenet512 (DeepFace standard)
KNOWN_FACES_DIR = os.getenv(
    "KNOWN_FACES_DIR",
    os.path.join(os.path.dirname(__file__), "known_faces"),
)

# ── YOLO Segmentation ────────────────────────────────────────
YOLO_MODEL = "yolo11n-seg.pt"
YOLO_PERSON_CLASS = 0

# ── Mask Refinement ──────────────────────────────────────────
TEMPORAL_ALPHA = 0.6  # current vs previous mask blend ratio

# ── Database ─────────────────────────────────────────────────
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/attend",
)
