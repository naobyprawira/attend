"""Face detection using OpenCV Haar Cascade.

Provides fast (~5ms) face detection for real-time video processing.
Returns bounding boxes that are then passed to the face recognizer.
"""

import cv2
import numpy as np

from server.config import FACE_SCALE_FACTOR, FACE_MIN_NEIGHBORS, FACE_MIN_SIZE

_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def detect_faces(frame: np.ndarray) -> list[dict]:
    """Detect faces in a BGR frame.

    Returns:
        List of detections: [{"bbox": [x, y, w, h]}, ...]
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = _cascade.detectMultiScale(gray, FACE_SCALE_FACTOR, FACE_MIN_NEIGHBORS, minSize=FACE_MIN_SIZE)
    return [{"bbox": [int(x), int(y), int(w), int(h)]} for x, y, w, h in faces]


def crop_face(frame: np.ndarray, bbox: list[int], padding: float = 0.2) -> np.ndarray:
    """Crop a face region from the frame with padding for better recognition.

    Args:
        frame: BGR image.
        bbox: [x, y, w, h] bounding box.
        padding: Fraction of w/h to add around the crop.

    Returns:
        Cropped BGR image.
    """
    x, y, w, h = bbox
    frame_h, frame_w = frame.shape[:2]
    pad_x, pad_y = int(w * padding), int(h * padding)
    x1 = max(0, x - pad_x)
    y1 = max(0, y - pad_y)
    x2 = min(frame_w, x + w + pad_x)
    y2 = min(frame_h, y + h + pad_y)
    return frame[y1:y2, x1:x2]
