"""Mask refinement pipeline for smooth background removal.

Transforms a raw binary YOLO mask into a smooth, feathered alpha mask
suitable for natural-looking compositing (similar to Google Meet quality).

Pipeline: cubic upscale → erode halo → morph close → bilateral → gaussian feather.
"""

import cv2
import numpy as np


def refine_mask(raw_mask: np.ndarray, target_width: int, target_height: int) -> np.ndarray:
    """Refine a raw YOLO mask into a smooth uint8 alpha mask.

    Args:
        raw_mask: Float32 mask [0, 1] at YOLO model resolution.
        target_width: Output width (frame width).
        target_height: Output height (frame height).

    Returns:
        Refined uint8 mask (0-255) at target resolution.
    """
    # 1. Cubic upscale (smoother edges than bilinear)
    mask = cv2.resize(raw_mask, (target_width, target_height), interpolation=cv2.INTER_CUBIC)
    mask_u8 = (np.clip(mask, 0, 1) * 255).astype(np.uint8)

    # 2. Slight erosion to remove halo around person edges
    kernel_small = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask_u8 = cv2.erode(mask_u8, kernel_small, iterations=1)

    # 3. Morphological close to fill small holes (hair, fingers)
    kernel_medium = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask_u8 = cv2.morphologyEx(mask_u8, cv2.MORPH_CLOSE, kernel_medium, iterations=2)

    # 4. Edge-aware bilateral filter (smooths noise, preserves person edges)
    mask_u8 = cv2.bilateralFilter(mask_u8, d=9, sigmaColor=75, sigmaSpace=75)

    # 5. Soft gaussian feathering for natural edge transitions
    mask_u8 = cv2.GaussianBlur(mask_u8, (15, 15), 6)

    return mask_u8
