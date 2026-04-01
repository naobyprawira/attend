"""Settings schemas — grouped as per API contract."""

from pydantic import BaseModel


class DetectionSettings(BaseModel):
    face_detection_enabled: bool
    face_recognition_enabled: bool
    confidence_threshold: float
    recognition_model: str
    face_model: str


class BackgroundRemovalSettings(BaseModel):
    yolo_enabled: bool
    temporal_alpha: float
    yolo_model: str


class CameraSettings(BaseModel):
    target_fps: int
    jpeg_quality: int


class SystemInfo(BaseModel):
    gpu_available: bool
    gpu_name: str
    server_uptime: int
    db_size_mb: float
    version: str


class SettingsResponse(BaseModel):
    detection: DetectionSettings
    background_removal: BackgroundRemovalSettings
    camera: CameraSettings
    system: SystemInfo


class DetectionSettingsUpdate(BaseModel):
    face_detection_enabled: bool | None = None
    face_recognition_enabled: bool | None = None
    confidence_threshold: float | None = None


class BackgroundRemovalSettingsUpdate(BaseModel):
    yolo_enabled: bool | None = None
    temporal_alpha: float | None = None


class CameraSettingsUpdate(BaseModel):
    target_fps: int | None = None
    jpeg_quality: int | None = None


class SettingsUpdate(BaseModel):
    detection: DetectionSettingsUpdate | None = None
    background_removal: BackgroundRemovalSettingsUpdate | None = None
    camera: CameraSettingsUpdate | None = None
