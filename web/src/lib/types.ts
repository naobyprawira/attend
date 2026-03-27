// ── WebSocket messages ───────────────────────────────────────

export interface Detection {
  bbox: [number, number, number, number];
  name?: string | null;
  confidence?: number;
  source?: "recognized" | "unknown";
  thumbnail?: string;
}

export interface FrameMetadata {
  type: "frame_metadata";
  frame: number;
  timestamp: string;
  faces: number;
  detections: Detection[];
  processing_ms: number;
  camera_ts: number;
  server_ts: number;
}

export interface FaceCapture {
  type: "face_capture";
  timestamp: string;
  name: string | null;
  confidence: number;
  thumbnail: string;
  bbox: [number, number, number, number];
}

// ── REST API models ─────────────────────────────────────────

export interface ServerStatus {
  camera_connected: boolean;
  viewer_count: number;
  uptime: number;
  total_frames: number;
  faces_detected_total: number;
}

export interface Person {
  id: number;
  name: string;
  photo_path: string;
  photo_url: string;
  created_at: string;
  recognition_count: number;
}

export interface DetectionEvent {
  id: number;
  timestamp: string;
  event_type: string;
  person_name: string | null;
  confidence: number | null;
  bbox: string | null;
  thumbnail: string | null;
  frame_number: number | null;
}

export interface EventStats {
  today: Record<string, number>;
  total_events: number;
  most_seen: { person_name: string; count: number } | null;
}

export interface Settings {
  face_detection_enabled: boolean;
  face_recognition_enabled: boolean;
  confidence_threshold: number;
  recognition_model: string;
  yolo_enabled: boolean;
  temporal_alpha: number;
  target_fps: number;
  jpeg_quality: number;
  gpu_available: boolean;
  gpu_name: string;
  yolo_model: string;
  face_model: string;
  server_uptime: number;
}

export type BgMode = "normal" | "green" | "blur" | "black";
