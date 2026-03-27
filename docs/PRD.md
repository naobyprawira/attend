# Kamera — Product Requirements Document

## 1. Vision

A self-hosted, professional CCTV platform for real-time video surveillance with AI-powered face detection and recognition. Inspired by HikCentral Professional — but open-source, lightweight, and built for 1-4 camera deployments over local WiFi.

Two separate systems:
- **Backend** (Python): Pure API server. No UI. Handles camera ingestion, CV processing, face recognition, event storage, WebSocket broadcasting.
- **Frontend** (Next.js): Standalone dashboard application. Connects to backend via REST + WebSocket. Can run on a different machine.

---

## 2. User Personas

### Operator (Primary)
Monitors live feeds, receives alerts, reviews events. Needs a clean dashboard that surfaces important information without clutter.

### Administrator
Manages known faces database, configures detection settings, adds/removes cameras. Needs a settings interface and person management.

---

## 3. Application Modules

### 3.1 Dashboard (Home)
The landing page. Provides an at-a-glance overview of the entire system.

**Components:**
- System health cards: camera status (online/offline), total events today, faces recognized today, unknown faces count
- Mini activity chart: detection events over the last 24 hours (bar chart, one bar per hour)
- Recent events feed: last 10 events with thumbnails, timestamps, person names
- Quick actions: jump to Live View, Person Management

### 3.2 Live View
Full-screen video monitoring with real-time overlays.

**Components:**
- Video feed canvas (dominant, 70%+ of screen)
- Detection overlay: bounding boxes drawn on canvas for detected faces (green = recognized, red = unknown)
- Live stats bar: FPS, latency, frame count
- Background mode selector (normal/green/blur/black)
- Face indicator: shows count of faces currently in frame
- Mini face strip: row of recently captured face thumbnails below the feed

### 3.3 Event Center
Searchable, filterable history of all detection events.

**Components:**
- Filter bar: date range picker, event type dropdown (all/recognized/unknown), person search
- Event table: columns — Time, Thumbnail, Type, Person, Confidence, Actions
- Event detail modal: larger thumbnail, full metadata, bbox on frame
- Export/pagination controls
- Stats summary row: total events, recognized count, unknown count for current filter

### 3.4 Person Management
CRUD interface for the known faces database.

**Components:**
- Person grid: cards with photo, name, registration date, recognition count
- Add Person dialog: name input + photo upload (drag & drop or file picker)
- Person detail view: all photos for a person, recent recognition events, delete action
- Search bar: filter by name

### 3.5 Settings
System configuration.

**Components:**
- Detection settings: face detection toggle, confidence threshold slider, face recognition toggle
- Background removal settings: YOLO toggle, temporal smoothing alpha slider
- Camera settings: display resolution, target FPS, JPEG quality
- System info: server uptime, GPU status, model versions, database size

---

## 4. Navigation Structure

Sidebar navigation (left, collapsible):
```
[Kamera logo]
─────────────
📊 Dashboard
📹 Live View
📋 Event Center
👤 Persons
⚙️ Settings
```

Active page highlighted. Sidebar collapses to icons on small screens.

---

## 5. Backend API Contract

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/status | System status (camera, viewers, uptime, GPU) |
| GET | /api/events | Query events (filter: type, person, date range, limit) |
| GET | /api/events/stats | Aggregate stats (today counts, top person) |
| GET | /api/events/:id | Single event detail |
| GET | /api/persons | List all registered persons |
| POST | /api/persons | Register new person (name + photo) |
| GET | /api/persons/:id | Person detail + their events |
| DELETE | /api/persons/:id | Remove person |
| GET | /api/persons/:id/photo | Serve person's photo |
| GET | /api/settings | Current detection/system settings |
| PUT | /api/settings | Update settings |

### WebSocket Endpoints

| Path | Direction | Payload |
|------|-----------|---------|
| /ws/camera | camera → server | Binary: 8-byte timestamp + JPEG |
| /ws/feed | server → client | Binary: JPEG frame |
| /ws/feed | server → client | Text: JSON metadata (detections, timing) |
| /ws/feed | client → server | Text: JSON commands (bg mode, etc.) |
| /ws/events | server → client | Text: JSON real-time event notifications |

Note: `/ws/feed` replaces the old `/ws/viewer`. `/ws/events` is new — dedicated channel for event notifications so the feed channel stays lean.

### Key Data Models

**Event:**
```json
{
  "id": 1,
  "timestamp": "2026-03-27T10:30:00Z",
  "event_type": "face_recognized | unknown_face | face_detected",
  "person_name": "John" | null,
  "confidence": 0.92,
  "bbox": [100, 200, 80, 100],
  "thumbnail": "base64...",
  "frame_number": 12345
}
```

**Person:**
```json
{
  "id": 1,
  "name": "John Doe",
  "photo_url": "/api/persons/1/photo",
  "created_at": "2026-03-20T08:00:00Z",
  "recognition_count": 47
}
```

**Frame Metadata (WebSocket):**
```json
{
  "type": "frame_metadata",
  "frame": 12345,
  "timestamp": "2026-03-27T10:30:00.123Z",
  "faces": 2,
  "detections": [
    {"bbox": [100,200,80,100], "name": "John", "confidence": 0.92, "source": "recognized"},
    {"bbox": [300,180,70,90], "name": null, "confidence": 0, "source": "unknown"}
  ],
  "processing_ms": 12.5
}
```

---

## 6. Non-Functional Requirements

- **Latency**: < 100ms from camera capture to viewer display (fast path)
- **FPS**: 12-15 FPS sustained regardless of detection load
- **Face recognition**: < 500ms per face (background task, non-blocking)
- **Concurrent viewers**: Support 5+ simultaneous dashboard connections
- **Database**: SQLite, async, supports 100K+ events without degradation
- **Deployment**: Single machine, no Docker/K8s required. `python -m server.main` + `npm run dev`

---

## 7. Tech Constraints

- Backend and frontend are **separate processes** on potentially different ports
- Backend: Python FastAPI on port 5678, serves **zero HTML** — pure API
- Frontend: Next.js on port 3000 (dev) or any static host (prod)
- Frontend connects to backend URL configured via environment variable
- CORS enabled on backend for frontend origin
- GPU (NVIDIA MX230 2GB VRAM) available for YOLO inference
