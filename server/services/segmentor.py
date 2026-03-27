"""YOLO-based person segmentation for background removal.

Uses yolo11n-seg (nano model) for fast inference. Supports CUDA GPU
when available, falls back to CPU. Model is lazy-loaded on first call.

If torch/YOLO fails to load (e.g. missing CUDA toolkit), segmentation
is permanently disabled and segment_persons() returns None.
"""

import logging

import numpy as np

from server.config import YOLO_MODEL, YOLO_PERSON_CLASS

logger = logging.getLogger(__name__)
_yolo = None
_load_failed = False


def _load_yolo():
    """Load and warm up YOLO model. Called once on first inference."""
    global _yolo, _load_failed
    try:
        import torch
        torch.set_num_threads(2)
        from ultralytics import YOLO

        device = "cuda" if torch.cuda.is_available() else "cpu"
        _yolo = YOLO(YOLO_MODEL)
        _yolo.to(device)
        _yolo(np.zeros((480, 640, 3), dtype=np.uint8), classes=[YOLO_PERSON_CLASS], verbose=False)
        logger.info("YOLO-seg loaded on %s", device)
    except Exception:
        _load_failed = True
        logger.warning("YOLO-seg unavailable (torch/CUDA failed to load). "
                       "Background removal disabled. Face detection still works.",
                       exc_info=True)


def segment_persons(frame: np.ndarray) -> np.ndarray | None:
    """Run YOLO-seg on a BGR frame.

    Returns:
        Combined person mask as float32 [0, 1] at model resolution, or None.
        Returns None permanently if YOLO failed to load.
    """
    if _load_failed:
        return None
    if _yolo is None:
        _load_yolo()
    if _yolo is None:
        return None
    results = _yolo(frame, classes=[YOLO_PERSON_CLASS], verbose=False)
    if not results or results[0].masks is None:
        return None
    masks = results[0].masks.data.cpu().numpy()
    combined = np.any(masks > 0.5, axis=0).astype(np.float32)
    # Release YOLO result tensors to free GPU memory
    del results
    return combined
