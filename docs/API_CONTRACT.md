# Attend.AI — API Data Contract

> Definitive contract between Frontend (Next.js) and Backend (Python FastAPI).
> Backend is being rebuilt from ground up. Frontend exists and will be evolved to match.

---

## 1. Conventions

### Base URL
```
HTTP:  http://{host}:5678/api
WS:    ws://{host}:5678/ws
```
Configured via `NEXT_PUBLIC_API_URL` env var (frontend), defaults to `http://localhost:5678`.

### Authentication (Phase 1+)
All endpoints (except `/api/auth/login`, `/api/health`, `/api/ready`) require a JWT Bearer token:
```
Authorization: Bearer <access_token>
```
WebSocket auth: pass token as query param `?token=<access_token>` on connection.

### Date/Time Format
All timestamps are **ISO 8601 UTC**: `"2026-03-27T10:30:00Z"`

### Pagination (cursor-based)
Paginated endpoints return:
```json
{
  "items": [...],
  "next_cursor": "eyJpZCI6MTAwfQ==" | null,
  "has_more": true | false
}
```
Request params: `?cursor=<string>&limit=<int>` (default limit: 50, max: 200)

### Consistent Error Response
All errors return:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": { ... } | null
  }
}
```
HTTP status codes: `400` validation, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict, `422` unprocessable, `500` server error.

### Enum String Convention
All enum values are `snake_case` strings: `"face_recognized"`, `"check_in"`, `"high"`, etc.

---

## 2. Phase 1 — Foundation

### 2.1 Auth

#### `POST /api/auth/login`
```
Request:
{
  "username": string,
  "password": string
}

Response 200:
{
  "access_token": string,
  "refresh_token": string,
  "token_type": "bearer",
  "expires_in": number,          // seconds
  "user": {
    "id": number,
    "username": string,
    "email": string,
    "role": string               // "admin" | "operator" | "viewer"
  }
}

Response 401:
{ "error": { "code": "INVALID_CREDENTIALS", "message": "..." } }
```

#### `POST /api/auth/refresh`
```
Request:
{
  "refresh_token": string
}

Response 200:
{
  "access_token": string,
  "expires_in": number
}
```

#### `POST /api/auth/logout`
```
Request:
{
  "refresh_token": string
}

Response 200:
{ "status": "ok" }
```

#### `GET /api/auth/me`
```
Response 200:
{
  "id": number,
  "username": string,
  "email": string,
  "role": string
}
```

---

### 2.2 System Status

#### `GET /api/health`
No auth required. Used for readiness probes.
```
Response 200:
{
  "status": "healthy" | "degraded",
  "version": string,
  "uptime": number               // seconds
}
```

#### `GET /api/status`
```
Response 200:
{
  "cameras_online": number,
  "cameras_total": number,
  "viewer_count": number,
  "uptime": number,              // seconds
  "total_frames": number,
  "faces_detected_total": number,
  "gpu_available": boolean,
  "gpu_name": string
}
```
> **Migration note**: replaces old `camera_connected: boolean` with multi-camera counts.
> Frontend `ServerStatus` type needs updating.

---

### 2.3 Cameras

#### `GET /api/cameras`
```
Response 200:
{
  "items": Camera[]
}

Camera:
{
  "id": string,                  // uuid
  "name": string,
  "location": string,
  "status": "online" | "offline",
  "fps": number | null,
  "last_frame_at": string | null,  // ISO timestamp
  "created_at": string
}
```

#### `POST /api/cameras`
```
Request:
{
  "name": string,
  "location": string
}

Response 201: Camera
```

#### `GET /api/cameras/:id`
```
Response 200: Camera (with extra fields)
{
  ...Camera,
  "total_frames": number,
  "total_events": number
}
```

#### `PUT /api/cameras/:id`
```
Request:
{
  "name"?: string,
  "location"?: string
}

Response 200: Camera
```

#### `DELETE /api/cameras/:id`
```
Response 200:
{ "status": "ok" }
```

---

### 2.4 Persons

#### `GET /api/persons`
```
Query params:
  ?search=<string>               // filter by name (partial match)
  &status=<active|inactive>      // filter by status (Phase 2+)
  &department_id=<number>        // filter by department (Phase 2+)

Response 200:
{
  "items": Person[]
}

Person:
{
  "id": number,
  "name": string,
  "photo_url": string,           // "/api/persons/{id}/photo"
  "created_at": string,
  "recognition_count": number,
  // Phase 2 additions:
  "employee_id": string | null,
  "department_id": number | null,
  "department_name": string | null,
  "status": "active" | "inactive"
}
```
> **Compatibility**: `photo_path` is removed. Frontend uses `photo_url` only.

#### `POST /api/persons`
```
Request: multipart/form-data
  name: string (required)
  photo: File (required, max 5MB, JPEG/PNG)
  employee_id?: string           // Phase 2+
  department_id?: number         // Phase 2+

Response 201:
{
  "id": number,
  "name": string,
  "photo_url": string,
  "created_at": string,
  "recognition_count": 0
}
```

#### `GET /api/persons/:id`
```
Response 200:
{
  ...Person,
  "recent_events": DetectionEvent[]  // last 20
}
```

#### `PUT /api/persons/:id`
```
Request: multipart/form-data (all fields optional)
  name?: string
  photo?: File
  employee_id?: string
  department_id?: number
  status?: "active" | "inactive"

Response 200: Person
```

#### `DELETE /api/persons/:id`
```
Response 200:
{ "status": "ok" }
```

#### `GET /api/persons/:id/photo`
```
Response 200: image/jpeg binary (FileResponse)
Response 404: person or photo not found
```

---

### 2.5 Events

#### `GET /api/events`
```
Query params:
  ?limit=<int>                   // default 50, max 200
  &cursor=<string>               // for pagination
  &type=<string>                 // "face_recognized" | "unknown_face"
  &person=<string>               // filter by person name
  &camera_id=<string>            // filter by camera
  &from=<ISO datetime>           // start of date range
  &to=<ISO datetime>             // end of date range
  &priority=<string>             // "high" | "medium" | "low" (Phase 1+)

Response 200:
{
  "items": DetectionEvent[],
  "next_cursor": string | null,
  "has_more": boolean
}

DetectionEvent:
{
  "id": number,
  "timestamp": string,
  "event_type": "face_recognized" | "unknown_face",
  "person_name": string | null,
  "confidence": number | null,
  "bbox": [number, number, number, number] | null,
  "thumbnail_url": string | null,  // "/api/events/{id}/thumbnail"
  "camera_id": string | null,
  "camera_name": string | null,
  "frame_number": number | null,
  "priority": "high" | "medium" | "low",
  "acknowledged": boolean,
  "acknowledged_by": string | null,
  "acknowledged_at": string | null
}
```
> **Migration notes**:
> - `bbox` changes from JSON string to native `[x, y, w, h]` array.
> - `thumbnail` (inline base64) replaced by `thumbnail_url` (file-based).
> - Added `camera_id`, `camera_name`, `priority`, `acknowledged` fields.

#### `GET /api/events/stats`
```
Query params:
  ?from=<ISO datetime>
  &to=<ISO datetime>
  &camera_id=<string>

Response 200:
{
  "today": {
    "face_recognized": number,
    "unknown_face": number
  },
  "total_events": number,
  "most_seen": {
    "person_name": string,
    "count": number
  } | null
}
```

#### `GET /api/events/:id`
```
Response 200: DetectionEvent
```

#### `GET /api/events/:id/thumbnail`
```
Response 200: image/jpeg binary
Response 404: thumbnail not found
```

#### `PUT /api/events/:id/acknowledge`
```
Response 200:
{
  "id": number,
  "acknowledged": true,
  "acknowledged_by": string,
  "acknowledged_at": string
}
```

#### `GET /api/events/export`
```
Query params:
  ?format=<csv|json|xlsx>
  &from=<ISO datetime>
  &to=<ISO datetime>
  &type=<string>
  &camera_id=<string>

Response 200: file download (Content-Disposition: attachment)
```

---

### 2.6 Settings

#### `GET /api/settings`
```
Response 200:
{
  "detection": {
    "face_detection_enabled": boolean,
    "face_recognition_enabled": boolean,
    "confidence_threshold": number,    // 0.0 - 1.0
    "recognition_model": string,
    "face_model": string
  },
  "background_removal": {
    "yolo_enabled": boolean,
    "temporal_alpha": number,          // 0.0 - 1.0
    "yolo_model": string
  },
  "camera": {
    "target_fps": number,
    "jpeg_quality": number             // 1 - 100
  },
  "system": {
    "gpu_available": boolean,
    "gpu_name": string,
    "server_uptime": number,           // seconds
    "db_size_mb": number,
    "version": string
  }
}
```
> **Migration note**: flat object restructured into grouped sections.
> Frontend `Settings` type needs updating to match groups.

#### `PUT /api/settings`
Only mutable fields. Server ignores read-only fields.
```
Request:
{
  "detection"?: {
    "face_detection_enabled"?: boolean,
    "face_recognition_enabled"?: boolean,
    "confidence_threshold"?: number
  },
  "background_removal"?: {
    "yolo_enabled"?: boolean,
    "temporal_alpha"?: number
  },
  "camera"?: {
    "target_fps"?: number,
    "jpeg_quality"?: number
  }
}

Response 200:
{ "status": "ok" }
```

---

### 2.7 WebSocket Protocols

#### `WS /ws/camera/:camera_id?token=<jwt>`
Camera client connects to stream frames to the server.

**Client → Server (binary):**
```
[8 bytes: float64 big-endian timestamp (epoch ms)] + [JPEG bytes]
```

**Server → Client:** none (acknowledgment not needed)

---

#### `WS /ws/feed?camera_id=<id>&token=<jwt>`
Dashboard viewer connects to receive processed frames.

**Server → Client (binary):** JPEG frame bytes

**Server → Client (text/JSON):**
```json
// Frame metadata — sent per processed frame
{
  "type": "frame_metadata",
  "camera_id": "uuid",
  "frame": 12345,
  "timestamp": "2026-03-27T10:30:00.123Z",
  "faces": 2,
  "detections": [
    {
      "bbox": [100, 200, 80, 100],
      "name": "John",
      "confidence": 0.92,
      "source": "recognized"
    },
    {
      "bbox": [300, 180, 70, 90],
      "name": null,
      "confidence": 0,
      "source": "unknown"
    }
  ],
  "processing_ms": 12.5,
  "camera_ts": 1711533000123,
  "server_ts": 1711533000135
}
```

```json
// Face capture — sent when a face event fires (after cooldown)
{
  "type": "face_capture",
  "camera_id": "uuid",
  "timestamp": "2026-03-27T10:30:00Z",
  "name": "John" | null,
  "confidence": 0.92,
  "thumbnail": "base64...",
  "bbox": [100, 200, 80, 100],
  "source": "recognized" | "unknown",
  "event_id": number
}
```

**Client → Server (text/JSON):**
```json
{ "bg": "normal" | "green" | "blur" | "black" }
```

---

#### `WS /ws/events?token=<jwt>` (NEW)
Dedicated real-time event channel, separate from the feed.

**Server → Client (text/JSON):**
```json
{
  "type": "event",
  "event": {
    "id": number,
    "timestamp": string,
    "event_type": "face_recognized" | "unknown_face" | "camera_online" | "camera_offline",
    "person_name": string | null,
    "confidence": number | null,
    "camera_id": string,
    "camera_name": string,
    "thumbnail_url": string | null,
    "priority": "high" | "medium" | "low"
  }
}
```

---

## 3. Phase 2 — Attendance Engine

### 3.1 Departments

#### `GET /api/departments`
```
Response 200:
{
  "items": Department[]
}

Department:
{
  "id": number,
  "name": string,
  "parent_id": number | null,
  "children": Department[],      // nested tree (max 5 levels)
  "person_count": number,
  "created_at": string
}
```

#### `POST /api/departments`
```
Request:
{
  "name": string,
  "parent_id": number | null
}

Response 201: Department
```

#### `PUT /api/departments/:id`
```
Request:
{
  "name"?: string,
  "parent_id"?: number | null    // move subtree
}

Response 200: Department
```

#### `DELETE /api/departments/:id`
```
Response 200: { "status": "ok" }
Response 409: { "error": { "code": "HAS_CHILDREN", ... } }
```

---

### 3.2 Shifts

```
Shift:
{
  "id": number,
  "name": string,                  // "Morning Shift"
  "type": "normal" | "flexible",
  "check_in_time": string,        // "08:00"
  "check_out_time": string,       // "17:00"
  "grace_minutes": number,        // late tolerance
  "overtime_threshold_minutes": number,
  "created_at": string
}
```

#### `GET /api/shifts`
```
Response 200: { "items": Shift[] }
```

#### `POST /api/shifts`
```
Request:
{
  "name": string,
  "type": "normal" | "flexible",
  "check_in_time": string,        // "HH:mm"
  "check_out_time": string,
  "grace_minutes": number,
  "overtime_threshold_minutes": number
}

Response 201: Shift
```

#### `PUT /api/shifts/:id`
#### `DELETE /api/shifts/:id`

#### `POST /api/shifts/assign`
Bulk assign a shift to a department or list of persons.
```
Request:
{
  "shift_id": number,
  "department_id"?: number,        // assign to all persons in dept
  "person_ids"?: number[],         // or specific persons
  "effective_from": string,        // ISO date "2026-04-01"
  "effective_to": string | null    // null = indefinite
}

Response 200: { "assigned_count": number }
```

---

### 3.3 Attendance Checkpoints

```
Checkpoint:
{
  "id": number,
  "camera_id": string,
  "camera_name": string,
  "checkpoint_type": "check_in" | "check_out" | "both",
  "location_name": string
}
```

#### `GET /api/attendance/checkpoints`
#### `POST /api/attendance/checkpoints`
#### `PUT /api/attendance/checkpoints/:id`
#### `DELETE /api/attendance/checkpoints/:id`

---

### 3.4 Attendance Records

```
AttendanceRecord:
{
  "id": number,
  "person_id": number,
  "person_name": string,
  "department_name": string | null,
  "date": string,                  // "2026-03-27"
  "check_in_time": string | null,  // "08:02:15"
  "check_out_time": string | null,
  "status": "present" | "absent" | "late" | "early_leave" | "overtime" | "day_off",
  "shift_name": string,
  "source_event_id": number | null,
  "note": string | null
}
```

#### `GET /api/attendance/today`
Real-time attendance for all active persons.
```
Query params:
  ?department_id=<number>

Response 200:
{
  "items": AttendanceToday[]
}

AttendanceToday:
{
  "person_id": number,
  "person_name": string,
  "department_name": string | null,
  "photo_url": string,
  "shift_name": string,
  "expected_check_in": string,    // "08:00"
  "check_in_time": string | null,
  "check_out_time": string | null,
  "status": "present" | "absent" | "late" | "not_yet" | "day_off",
  "late_minutes": number | null
}
```

#### `GET /api/attendance/records`
Historical attendance query.
```
Query params:
  ?person_id=<number>
  &department_id=<number>
  &from=<ISO date>
  &to=<ISO date>
  &status=<string>
  &cursor=<string>
  &limit=<int>

Response 200:
{
  "items": AttendanceRecord[],
  "next_cursor": string | null,
  "has_more": boolean
}
```

#### `POST /api/attendance/corrections`
Manual correction by admin.
```
Request:
{
  "person_id": number,
  "date": string,
  "check_in_time"?: string,
  "check_out_time"?: string,
  "status"?: string,
  "reason": string
}

Response 201: AttendanceRecord
```

---

### 3.5 Attendance Reports

#### `GET /api/attendance/reports`
```
Query params:
  ?report_type=<daily|monthly|exception|overtime|department>
  &from=<ISO date>
  &to=<ISO date>
  &department_id=<number>
  &person_id=<number>
  &format=<json|csv|xlsx|pdf>

Response 200 (json):
{
  "report_type": string,
  "period": { "from": string, "to": string },
  "generated_at": string,
  "data": MonthlyReport | DailyReport | ExceptionReport
}

MonthlyReport:
{
  "rows": [
    {
      "person_id": number,
      "person_name": string,
      "department_name": string,
      "days": {
        "2026-03-01": "present" | "absent" | "late" | ...,
        "2026-03-02": "day_off",
        ...
      },
      "summary": {
        "total_present": number,
        "total_absent": number,
        "total_late": number,
        "total_overtime_hours": number
      }
    }
  ]
}

ExceptionReport:
{
  "rows": [
    {
      "person_name": string,
      "date": string,
      "exception_type": "late" | "early_leave" | "absent",
      "expected": string,
      "actual": string | null,
      "delta_minutes": number
    }
  ]
}
```

Response 200 (csv/xlsx/pdf): file download.

#### `GET /api/attendance/stats`
```
Query params:
  ?from=<ISO date>
  &to=<ISO date>
  &department_id=<number>

Response 200:
{
  "attendance_rate": number,       // percentage
  "avg_late_minutes": number,
  "total_present": number,
  "total_absent": number,
  "total_late": number,
  "top_absentees": [
    { "person_name": string, "absent_count": number }
  ]
}
```

---

### 3.6 Visitors (Phase 2)

```
Visitor:
{
  "id": number,
  "name": string,
  "photo_url": string | null,
  "host_person_id": number,
  "host_person_name": string,
  "purpose": string,
  "expected_arrival": string,
  "expected_departure": string,
  "actual_check_in": string | null,
  "actual_check_out": string | null,
  "status": "pre_registered" | "checked_in" | "checked_out" | "expired",
  "created_at": string
}
```

#### `GET /api/visitors`
#### `POST /api/visitors`
#### `GET /api/visitors/:id`
#### `PUT /api/visitors/:id`
#### `POST /api/visitors/:id/check-in`
#### `POST /api/visitors/:id/check-out`

---

### 3.7 Batch Person Import (Phase 2)

#### `POST /api/persons/import`
```
Request: multipart/form-data
  file: File (.xlsx)

Response 200:
{
  "total_rows": number,
  "imported": number,
  "skipped": number,
  "errors": [
    { "row": number, "field": string, "message": string }
  ]
}
```

#### `GET /api/persons/import/template`
```
Response 200: .xlsx file download (empty template with headers)
```

---

## 4. Phase 3 — Enterprise (contract summary)

### 4.1 Users & RBAC

```
User:
{
  "id": number,
  "username": string,
  "email": string,
  "role": Role,
  "department_id": number | null,
  "status": "active" | "inactive",
  "last_login": string | null,
  "created_at": string
}

Role:
{
  "id": number,
  "name": string,
  "permissions": string[]        // ["camera.view", "person.manage", "attendance.view", ...]
}
```

#### `GET /api/users`
#### `POST /api/users`
#### `PUT /api/users/:id`
#### `DELETE /api/users/:id`
#### `GET /api/roles`
#### `POST /api/roles`
#### `PUT /api/roles/:id`

**Permission scopes:**
`camera.view`, `camera.manage`, `person.view`, `person.manage`, `attendance.view`, `attendance.manage`, `settings.manage`, `user.manage`, `report.export`

---

### 4.2 Analytics

#### `GET /api/analytics/people-count`
```
Query: ?camera_id, &from, &to, &interval=<hourly|daily>
Response: { "series": [{ "timestamp": string, "count": number }] }
```

#### `GET /api/analytics/attendance-trends`
```
Query: ?department_id, &from, &to
Response: { "series": [{ "date": string, "rate": number, "department_name": string }] }
```

#### `GET /api/analytics/peak-hours`
```
Query: ?camera_id, &from, &to
Response: { "hours": [{ "hour": number, "avg_count": number }] }
```

#### `GET /api/analytics/heatmap`
```
Query: ?camera_id, &from, &to
Response: { "width": number, "height": number, "density": number[][] }
```

---

### 4.3 Zones & Access Control

```
Zone:
{
  "id": number,
  "name": string,
  "type": "open" | "restricted" | "high_security",
  "camera_ids": string[],
  "allowed_group_ids": number[],
  "created_at": string
}
```

#### `GET /api/zones`
#### `POST /api/zones`
#### `PUT /api/zones/:id`
#### `DELETE /api/zones/:id`
#### `GET /api/zones/:id/access-log`

---

### 4.4 System Admin

#### `GET /api/system/health`
```
Response 200:
{
  "cpu_percent": number,
  "ram_percent": number,
  "gpu_percent": number | null,
  "gpu_memory_mb": number | null,
  "disk_used_percent": number,
  "db_size_mb": number,
  "cameras": [
    { "id": string, "name": string, "fps": number, "status": string, "latency_ms": number }
  ]
}
```

#### `POST /api/system/backup`
#### `GET /api/system/backups`
#### `POST /api/system/restore`
#### `GET /api/system/logs`

---

## 5. Phase 4 — Scale & Intelligence (contract summary)

### 5.1 Multi-Site
```
GET    /api/sites
POST   /api/sites
PUT    /api/sites/:id
DELETE /api/sites/:id
POST   /api/sites/:id/sync
```

### 5.2 Smart Search
```
POST   /api/search/face              // upload photo, find matching events
GET    /api/search/person-trail      // person movement across cameras
GET    /api/analytics/anomalies      // flagged unusual patterns
```

### 5.3 Public API
```
GET    /api/keys                     // API key management
POST   /api/keys
DELETE /api/keys/:id
GET    /api/webhooks
POST   /api/webhooks
DELETE /api/webhooks/:id
```

---

## 6. Frontend Type Migration Guide

Summary of breaking changes from the current frontend types:

| Current (types.ts) | New | Change |
|---|---|---|
| `ServerStatus.camera_connected` | `ServerStatus.cameras_online` / `cameras_total` | boolean → counts |
| `Person.photo_path` | removed | use `photo_url` only |
| `DetectionEvent.bbox` (string) | `bbox` (number[]) | JSON string → native array |
| `DetectionEvent.thumbnail` (base64) | `thumbnail_url` (string) | inline → URL reference |
| `Settings` (flat object) | `Settings` (grouped: detection, background_removal, camera, system) | restructured |
| `fetchEvents` returns array | returns `{ items, next_cursor, has_more }` | paginated response |
| `/ws/feed` (single camera) | `/ws/feed?camera_id=<id>` | multi-camera param |
| no auth | `Authorization: Bearer <token>` on all requests | JWT required |

### New Types to Add (Phase 1)
```typescript
// Auth
interface AuthTokens { access_token: string; refresh_token: string; token_type: string; expires_in: number; user: AuthUser }
interface AuthUser { id: number; username: string; email: string; role: string }

// Camera
interface Camera { id: string; name: string; location: string; status: "online" | "offline"; fps: number | null; last_frame_at: string | null; created_at: string }

// Pagination wrapper
interface PaginatedResponse<T> { items: T[]; next_cursor: string | null; has_more: boolean }
```

### New Types to Add (Phase 2)
```typescript
interface Department { id: number; name: string; parent_id: number | null; children: Department[]; person_count: number; created_at: string }
interface Shift { id: number; name: string; type: "normal" | "flexible"; check_in_time: string; check_out_time: string; grace_minutes: number; overtime_threshold_minutes: number; created_at: string }
interface AttendanceRecord { id: number; person_id: number; person_name: string; department_name: string | null; date: string; check_in_time: string | null; check_out_time: string | null; status: "present" | "absent" | "late" | "early_leave" | "overtime" | "day_off"; shift_name: string; source_event_id: number | null; note: string | null }
interface AttendanceToday { person_id: number; person_name: string; department_name: string | null; photo_url: string; shift_name: string; expected_check_in: string; check_in_time: string | null; check_out_time: string | null; status: "present" | "absent" | "late" | "not_yet" | "day_off"; late_minutes: number | null }
interface Visitor { id: number; name: string; photo_url: string | null; host_person_name: string; purpose: string; status: "pre_registered" | "checked_in" | "checked_out" | "expired"; expected_arrival: string; expected_departure: string; actual_check_in: string | null; actual_check_out: string | null }
```
