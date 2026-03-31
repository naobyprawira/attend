# Attend.ai — Product Requirements Document
**Open-Source Face-Recognition Attendance & Surveillance Platform**
**Inspired by HikCentral Professional**

**Version 3.0 — March 2026**

---

## 1. Current State Analysis

### 1.1 What Has Been Implemented

The Attend.ai repository is a functional MVP for real-time face-recognition video surveillance. The system is split into three deployable components: a Python camera client, a Python FastAPI server, and a Next.js web dashboard.

| Component | Implementation Status | Tech Stack |
|---|---|---|
| Camera Client | WebSocket streaming with 8-byte timestamp prefix, JPEG encoding, auto-reconnect, local preview, configurable FPS/resolution | Python, OpenCV, websockets |
| API Server | FastAPI with REST + WebSocket endpoints, CORS, lifespan hooks, async SQLite, modular router architecture | Python, FastAPI, uvicorn, aiosqlite |
| Face Detection | Haar Cascade frontal face detector with configurable scale factor, min neighbors, min size, padded crop extraction | OpenCV Haar Cascade |
| Face Recognition | InsightFace ArcFace (buffalo_l) embeddings, cosine similarity matching, unknown face tracking with consistent labels | InsightFace, ONNX Runtime |
| Background Removal | YOLO11n-seg person segmentation with mask refinement pipeline (cubic upscale, erosion, morph close, bilateral, Gaussian feather), temporal smoothing | Ultralytics YOLO, OpenCV |
| Frame Processing | Fast-path decode/stamp/composite/encode pipeline (~8-12ms), per-viewer background mode compositing (green/blur/black/normal) | OpenCV, NumPy |
| Event System | SQLite event storage with type/person/timestamp filters, cooldown deduplication (30s per identity), real-time WebSocket broadcast | SQLAlchemy async, JSON |
| Person Management | CRUD for known faces via filesystem + DB, photo upload with auto face crop, embedding reload, disk-to-DB sync on startup | FastAPI, InsightFace |
| Web Dashboard | Next.js with 5 pages (Dashboard, Live View, Events, Persons, Settings), real-time WebSocket hook, canvas rendering with bbox overlays | Next.js, React, Tailwind, TypeScript |

### 1.2 Known Issues & Technical Debt

**Backend Issues:**

| Issue | Severity | Details |
|---|---|---|
| Blocking CPU in async loop | High | Face detection, recognition, and YOLO inference use asyncio.to_thread() but per-face recognition in a loop can accumulate. |
| Global mutable state | Medium | AppState is a module-level singleton with no thread safety guarantees on shared numpy arrays (mask_bgr, latest_detections). |
| Settings not persisted | Medium | PUT /api/settings overwrites config module variables at runtime — changes are lost on restart. |
| No input validation on person registration | Medium | No file size limits or filename sanitization on photo upload. |
| Haar Cascade fallback only | Medium | Primary detector is InsightFace RetinaFace; Haar is fallback. Single-model deployment has no redundancy. |
| No graceful shutdown | Low | No cleanup of WebSocket connections on shutdown signal. |

**Frontend Issues:**

| Issue | Severity | Details |
|---|---|---|
| No state management library | Medium | Each page independently fetches data with useState + setInterval polling. |
| Polling instead of real-time for REST data | Medium | Dashboard and Events use setInterval to refetch. Should leverage WebSocket or server-sent events. |
| Empty catch blocks | Medium | Errors are silently swallowed with no user feedback. |
| No responsive design | High | Dashboard grid is hardcoded. Sidebar is fixed width. No mobile breakpoints. |
| No error boundary components | Medium | A WebSocket disconnection or API error crashes the whole page silently. |

---

## 2. Product Overview

### 2.1 Vision
Attend.ai will become an open-source, self-hosted, enterprise-grade attendance and surveillance platform powered by AI face recognition. Inspired by HikCentral Professional, it will deliver multi-camera video management, face-based time & attendance, real-time event alerting, person management with organizational hierarchies, and comprehensive reporting — all deployable on commodity hardware over local WiFi.

### 2.2 Problem Statement
Small-to-medium organizations (offices, schools, factories, co-working spaces) need automated attendance tracking but face two bad options: expensive proprietary systems like HikCentral ($5,000–50,000+ with vendor lock-in) or fragile DIY scripts with no dashboard, no multi-camera support, and no reporting.

### 2.3 Value Proposition
Attend.ai will be the first open-source platform that combines professional-grade multi-camera surveillance with face-recognition-based attendance in a single, self-hosted package. Organizations get HikCentral-level functionality without licensing fees, vendor lock-in, or cloud dependencies.

### 2.4 User Personas

**Primary: HR / Admin Operator** (25–45 years old, HR staff or office administrator, low-to-moderate technical expertise)
- Goals: Track employee attendance automatically, generate monthly attendance reports for payroll, manage employee face database, configure shift schedules.
- Pain Points: Manual attendance is error-prone, buddy-punching is rampant, generating reports from raw data is tedious, existing systems are too expensive.

**Secondary: Security Operator** (20–50 years old, security guard or facility manager, low technical expertise)
- Goals: Monitor live camera feeds, receive alerts for unknown faces, review detection events, manage visitor access.
- Pain Points: Cannot monitor all cameras simultaneously, misses intrusion events, no searchable event history.

**Tertiary: System Administrator** (25–40 years old, IT staff, high technical expertise)
- Goals: Deploy and maintain the system, manage users and roles, monitor system health, configure cameras and AI models.
- Pain Points: Proprietary systems are black boxes, no API access, difficult to integrate with existing HR/payroll systems.

---

## 3. Four-Phase Development Plan

The roadmap is organized into **4 phases** (each 3–4 sprints of 2 weeks), with parallel workstreams for Backend, Frontend, and Data Pipeline/Model.

---

### Phase 1: Foundation Hardening (Sprints 1–4, Weeks 1–8)

**Theme:** Fix critical infrastructure debt, establish production-grade foundations, make the system deployable for a single-site pilot.

#### Sprint 1: Database & Auth Foundation (Week 1–2)
- **Backend:** Replace aiosqlite per-call with connection pool; integrate Alembic for migrations; implement JWT auth (`/api/auth/login`, `/api/auth/refresh`); add Pydantic response models; add `/health` and `/ready` endpoints; centralized error handling.
- **Frontend:** Login page with JWT token flow; AuthContext provider; React Query (TanStack Query) for all API calls; global error boundary + toast notifications (sonner/react-hot-toast).
- **Data/Model:** Benchmark current Haar Cascade accuracy (precision, recall, F1 on LFW/WIDER FACE); benchmark Facenet512 ONNX vs ArcFace/AdaFace on LFW pairs; set up evaluation pipeline.

#### Sprint 2: State Management & Multi-Camera Prep (Week 3–4)
- **Backend:** Refactor AppState with `asyncio.Lock`; redesign `/ws/camera` to accept `camera_id`; move thumbnails from base64 to filesystem; persist settings to DB; add input validation; add rate limiting (slowapi).
- **Frontend:** Responsive design with mobile breakpoints; design system with Tailwind config; skeleton loading components; optimistic updates; WebSocket connection status indicator; TypeScript strict mode.
- **Data/Model:** Evaluate RetinaFace and SCRFD; test InsightFace pipeline; face alignment preprocessing; data augmentation pipeline.

#### Sprint 3: Multi-Camera Core & Live View Upgrade (Week 5–6)
- **Backend:** Camera registry API (`POST/GET/DELETE /api/cameras`); per-camera processing pipeline; `/ws/feed` with `camera_id`; `/ws/feed/grid` for multiplexed grid view; camera health monitoring; reconnection logic with exponential backoff.
- **Frontend:** Redesigned Live View with camera selector, grid layouts (1×1, 2×2, 3+1), fullscreen; CameraGrid component; Camera Management page; bounding boxes on overlay canvas; keyboard shortcuts (1–4, F, Esc).
- **Data/Model:** Replace Haar Cascade with RetinaFace/SCRFD ONNX; implement face alignment; benchmark new detector on MX230.

#### Sprint 4: Event System v2 & Notifications (Week 7–8)
- **Backend:** Dedicated `/ws/events` channel; event priority levels (High/Medium/Low); event acknowledgment workflow; event type expansion (`camera_offline`, `camera_online`, `system_health`); `/api/events/export` (CSV/JSON); cursor-based pagination.
- **Frontend:** NotificationCenter with bell icon + badge; browser Push Notifications for high-priority events; redesigned Event Center with date range picker, pagination, bulk acknowledge; real-time event toast with thumbnail; sound alert toggle.
- **Data/Model:** Optimize embedding extraction with batch ONNX inference; embedding caching in DB; evaluate INT8 quantization for ArcFace; embedding versioning system.

---

### Phase 2: Attendance Engine (Sprints 5–8, Weeks 9–16)

**Theme:** Build the core attendance system — organizational hierarchy, shift scheduling, check-in/check-out logic, and attendance reporting.

#### Sprint 5: Organization & Department Hierarchy (Week 9–10)
- **Backend:** `departments` table (tree structure up to 5 levels); `person_groups` table; extend persons schema (`department_id`, `employee_id`, `email`, `phone`, `role`, `status`, `effective_period`); `/api/departments` CRUD; `/api/persons/groups` CRUD; batch person import via Excel (openpyxl).
- **Frontend:** Three-panel Persons page (department tree / person list / person detail); DepartmentTree component with drag-to-move; PersonDetail panel; batch import UI with Excel template; person status toggle; person search with filters.
- **Data/Model:** Collect real-world face data from pilot site; train face quality assessment model; anti-spoofing v1 (texture analysis); test recognition at 1m, 2m, 3m, 5m distances.

#### Sprint 6: Shift Scheduling & Check-In Engine (Week 11–12)
- **Backend:** `shifts` table (normal/flexible, check_in/out times, grace_minutes, overtime_threshold); `shift_assignments` table; `attendance_checkpoints` table (camera_id, checkpoint_type); `attendance_records` table (person_id, date, check_in/out time, status); AttendanceEngine service; `/api/shifts` CRUD; `/api/attendance/today`.
- **Frontend:** New Attendance module in sidebar; Shift Management page with visual time picker; Checkpoint Configuration page; Today's Attendance dashboard (real-time grid with status pills); individual attendance detail with calendar view; check-in notification on Live View.
- **Data/Model:** Optimize recognition for attendance scenario; weighted multi-embedding matching (top-3 per person); test 5+ simultaneous face recognition; face re-enrollment recommendations.

#### Sprint 7: Attendance Reports & Export (Week 13–14)
- **Backend:** Report generation service (daily, weekly, monthly); `/api/attendance/reports` with format (json/csv/xlsx); report types (Daily Summary, Monthly Summary, Exception, Overtime, Department Summary); `/api/attendance/stats`; scheduled report generation (cron); `/api/attendance/corrections` with audit trail.
- **Frontend:** Reports page with report type selector, date range, department/person filters; Monthly Attendance table (rows × date columns, color-coded); Exception Report view; export controls (Excel, CSV, PDF); attendance analytics dashboard (line chart, bar chart, pie chart); attendance correction modal.
- **Data/Model:** Embedding drift detection; A/B model testing framework; evaluate ArcFace R100 ONNX; model hot-swap mechanism.

#### Sprint 8: Visitor Management & Polish (Week 15–16)
- **Backend:** `visitors` table (pre-registration and check-in/out flow); `/api/visitors` CRUD; visitor face comparison with auto-expire; `/api/attendance/summary/department/{id}`; `audit_log` table; DB indexes and query caching.
- **Frontend:** Visitor Management page with pre-registration form and active visitors list; visitor badge view (printable with QR code); Audit Log page; polish all attendance pages for mobile; attendance dashboard widgets; onboarding wizard.
- **Data/Model:** Anti-spoofing v2 (depth-based if IR camera available); optimize ONNX inference for multi-camera with shared GPU memory; model performance dashboard.

---

### Phase 3: Enterprise Features (Sprints 9–12, Weeks 17–24)

**Theme:** Role-based access control, multi-site management, advanced analytics, and system administration.

#### Sprint 9: RBAC & User Management (Week 17–18)
- **Backend:** `users` table (username, password_hash/bcrypt, email, role_id); `roles` table with permission matrix; permission middleware (403 on missing permissions); per-camera and per-department access control; `/api/users` CRUD (admin-only); `/api/roles` CRUD.
- **Frontend:** User Management page; Role Management page with visual permission matrix editor (checkboxes); scoped navigation (hide items user lacks permission for); user profile page; session management; admin impersonation mode.
- **Data/Model:** HNSW index (hnswlib) for embedding similarity search instead of brute-force L2; benchmark at 1K/5K/10K/50K faces; embedding index auto-rebuild; GPU memory monitoring with graceful degradation.

#### Sprint 10: Advanced Analytics & Heatmaps (Week 19–20)
- **Backend:** Analytics pipeline (hourly/daily people counts per camera/zone); `/api/analytics/people-count`; `/api/analytics/attendance-trends`; `/api/analytics/peak-hours`; `/api/analytics/heatmap`; scheduled analytics jobs.
- **Frontend:** Analytics section in sidebar; People Counting dashboard (line chart, bar chart, occupancy gauge); Attendance Trends page; Heatmap Viewer with floor plan overlay; Peak Hours radial chart; executive summary page.
- **Data/Model:** Face attribute detection (age range, gender for anonymous analytics); person re-identification across cameras; optimize multi-camera inference scheduling; test on larger datasets (MS1M-V3, CASIA-WebFace).

#### Sprint 11: Access Control & Zone Management (Week 21–22)
- **Backend:** `zones` table (open/restricted/high_security, camera_ids, allowed_person_groups); `access_rules` table (schedule); ZoneAccessEngine; access_violation events (high priority); `/api/zones` CRUD; `/api/access-log`.
- **Frontend:** Zone Management page; zone map view with floor plan upload and draggable camera icons; Access Rules editor (day × hour grid); Access Violations dashboard; door/zone status widget; zone-based live view filtering.
- **Data/Model:** Stranger detection; face quality auto-capture at checkpoints (best-quality frame over 2-second window); TensorRT conversion for NVIDIA GPUs; mobile face enrollment testing.

#### Sprint 12: System Administration & Health Monitoring (Week 23–24)
- **Backend:** System health monitoring (per-camera FPS, GPU utilization, disk usage, DB size at 1-minute intervals); `/api/system/health`; DB backup/restore (manual + scheduled); `/api/system/logs`; system config export/import as JSON; Docker deployment; Prometheus `/metrics` endpoint.
- **Frontend:** System Health dashboard (real-time CPU/RAM/GPU/disk gauges, per-camera health cards); Device Manager page; Backup Management page; System Logs viewer (real-time stream with filtering); Setup Wizard v2; system-wide notification banner.
- **Data/Model:** Full system performance benchmark (N cameras × M faces); optimize for 4-camera deployment with <200ms recognition latency; automated model regression tests CI pipeline; hardware matrix documentation; graceful zero-downtime restart for model upgrades.

---

### Phase 4: Scale & Intelligence (Sprints 13–16, Weeks 25–32)

**Theme:** Multi-site deployments, intelligent features, API/SDK for third-party integration, production release.

#### Sprint 13: Multi-Site & Remote Management (Week 25–26)
- **Backend:** `sites` table; site agent (lightweight backend for remote sites); person database sync (central pushes updates, sites push events back); `/api/sites` CRUD; cross-site event aggregation; site-scoped permissions.
- **Frontend:** Site Management page; cross-site dashboard; site comparison view; site-specific navigation with header selector; network topology viewer; offline mode indicator.
- **Data/Model:** Federated face recognition (local recognition, only unrecognized sent to central); diff-based sync protocol; recognition consistency across different camera models; cross-site latency benchmarks.

#### Sprint 14: Smart Search & AI Features (Week 27–28)
- **Backend:** Face search (`POST /api/search/face`); attribute-based search; anomaly detection service; `/api/search/person-trail`; `/api/analytics/anomalies`; smart event correlation (group related events within 5 minutes).
- **Frontend:** Smart Search page with photo upload and text query; Person Trail visualization (timeline + floor plan); Anomaly Dashboard with severity badges; search-by-face modal; incident view for correlated events; AI insight cards on Dashboard.
- **Data/Model:** Face search engine with nearest-neighbor search on event embeddings; mask-aware recognition; face clustering for bulk enrollment suggestions; partial face recognition accuracy; test anti-spoofing bypass scenarios.

#### Sprint 15: API/SDK & Integration Layer (Week 29–30)
- **Backend:** API key management (`/api/keys` CRUD with per-key permissions and rate limits); webhook system (`/api/webhooks` CRUD with retry); OpenAPI/Swagger auto-generated; integration endpoints (`/api/integration/attendance-export`); email notification service (SMTP); RTSP camera support via ffmpeg.
- **Frontend:** API Documentation page with embedded Swagger UI; Webhook Management page with delivery history; Integration Settings page; API Key Management page with usage stats; RTSP Camera Setup wizard; email notification preferences per user.
- **Data/Model:** Python SDK package (attend-sdk); optimize for high-throughput API usage; model A/B testing via API; CSV/Excel import/export for all major entities.

#### Sprint 16: Production Polish & Release (Week 31–32)
- **Backend:** Comprehensive load testing (4 cameras, 1000 persons, 5 concurrent users); security audit (SQL injection, XSS, WebSocket validation); DB optimization (query plans, indexes, caching); installation script (one-command setup for Ubuntu 22.04/24.04); Prometheus metrics; DB migration path SQLite to PostgreSQL.
- **Frontend:** Full UI/UX audit; dark mode (CSS variable swap, system preference detection, manual toggle); i18n framework (English + Bahasa Indonesia); user documentation; print-optimized views; final performance optimization (bundle analysis, lazy loading, WebSocket reconnection hardening).
- **Data/Model:** Final model accuracy report; model selection guide; package all ONNX models with checksums and version metadata; model fine-tuning guide; automated model regression tests.

---

## 4. Feature Requirements (MoSCoW)

### Must Have

| Feature | Phase | Acceptance Criteria |
|---|---|---|
| JWT Authentication & RBAC | 1 | Users must log in; admin can create roles with specific permissions; unauthorized access returns 403. |
| Multi-Camera Support (2–4) | 1 | System accepts 2–4 simultaneous feeds with independent pipelines and <200ms end-to-end latency. |
| Department Hierarchy | 2 | Admin can create up to 5-level department tree; persons assigned to departments; filters work throughout app. |
| Shift Scheduling | 2 | Admin can create normal and flexible shifts; assign to departments or individuals; grace period configurable. |
| Face-Based Check-In/Out | 2 | When a recognized face appears at a checkpoint camera, an attendance record is automatically created. |
| Attendance Reports | 2 | Monthly summary, daily detail, exception reports available; export to Excel works. |
| Real-Time Event Notifications | 1 | Unknown face events trigger browser notification within 2 seconds; event appears in notification center. |
| Person Batch Import | 2 | Admin can upload Excel file with person data and photos; validates, shows preview, imports with error reporting. |
| Database Migrations | 1 | Schema changes managed through Alembic; existing data preserved on upgrade; rollback possible. |
| Responsive Dashboard | 1 | Dashboard usable on tablet (768px) and desktop (1024px+); tables scroll horizontally on small screens. |

### Should Have

| Feature | Phase | Acceptance Criteria |
|---|---|---|
| Visitor Management | 2 | Pre-register visitors with photo; auto-expire credentials after departure; visitor events distinct from employee events. |
| Access Control Zones | 3 | Admin can define zones with allowed person groups; unauthorized access triggers high-priority alert. |
| Attendance Analytics | 3 | Line charts for attendance rate over time; department comparison; peak hour analysis; data exportable. |
| People Counting | 3 | Per-camera entry/exit counts; hourly aggregation; occupancy tracking; dashboard widget. |
| System Health Monitoring | 3 | Real-time CPU/RAM/GPU/disk gauges; per-camera health cards; alert when component is unhealthy. |
| Backup & Restore | 3 | Scheduled DB backups; downloadable backup files; one-click restore; backup history with retention policy. |
| Docker Deployment | 3 | `docker-compose up` starts full system; `.env` configuration; persistent volumes; works on x86 Linux. |
| Dark Mode | 4 | System preference detection; manual toggle; all pages render correctly in both modes. |

### Could Have

| Feature | Phase | Acceptance Criteria |
|---|---|---|
| Multi-Site Management | 4 | Central server manages remote sites; person database syncs; unified dashboard shows all sites. |
| Smart Face Search | 4 | Upload photo to find matching events across all cameras and time ranges; ranked by similarity. |
| Person Trail Tracking | 4 | Given a person and time range, show all cameras where person appeared on a floor plan timeline. |
| RTSP Camera Support | 4 | Connect to standard IP cameras via RTSP URL in addition to WebSocket camera client. |
| Webhook Integrations | 4 | Configure webhook URLs for event types; reliable delivery with retry; delivery history viewable. |
| Public REST API + SDK | 4 | API key auth; OpenAPI documentation; Python SDK package; rate limiting. |
| Email Notifications | 4 | SMTP configuration; event-triggered emails; daily digest option; template customization. |
| i18n (English + Bahasa) | 4 | All UI strings extracted; language toggle; English and Bahasa Indonesia supported. |

### Won't Have (This Version)
License plate recognition (ANPR), parking management, elevator control, video intercom, guard patrol, emergency mustering, commercial digital signage, recording/playback (NVR-style), video wall, BACnet/Modbus integrations, mobile native app (iOS/Android), and cloud deployment.

---

## 5. Backend API Contract (Current — Phase 1)

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Authenticate user, return access + refresh tokens |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Revoke refresh token |
| GET | /api/auth/me | Current authenticated user |
| GET | /api/status | System status (cameras, viewers, uptime, GPU) |
| GET | /api/cameras | List cameras |
| POST | /api/cameras | Register new camera |
| GET | /api/cameras/:id | Camera detail |
| PUT | /api/cameras/:id | Update camera |
| DELETE | /api/cameras/:id | Remove camera |
| GET | /api/events | Query events (filter: type, person, camera, date range) |
| GET | /api/events/stats | Aggregate stats (today counts, top person) |
| GET | /api/events/:id | Single event detail |
| GET | /api/events/:id/thumbnail | Serve event thumbnail (no auth) |
| PUT | /api/events/:id/acknowledge | Acknowledge event |
| GET | /api/persons | List all registered persons |
| POST | /api/persons | Register new person (name + photo) |
| GET | /api/persons/:id | Person detail + their events |
| DELETE | /api/persons/:id | Remove person |
| GET | /api/persons/:id/photo | Serve person's photo (no auth) |
| GET | /api/settings | Current detection/system settings |
| PUT | /api/settings | Update settings |

### WebSocket Endpoints

| Path | Direction | Payload |
|------|-----------|---------|
| /ws/camera/{camera_id} | camera → server | Binary: 8-byte timestamp + JPEG |
| /ws/feed | server → client | Binary: JPEG frame |
| /ws/feed | server → client | Text: JSON metadata (detections, timing) |
| /ws/feed | client → server | Text: JSON commands (bg mode change) |
| /ws/events | server → client | Text: JSON real-time event notifications |

### Key Data Models

**Event:**
```json
{
  "id": 1,
  "timestamp": "2026-03-27T10:30:00Z",
  "event_type": "face_recognized | unknown_face",
  "person_name": "John",
  "confidence": 0.92,
  "bbox": [100, 200, 80, 100],
  "thumbnail_url": "/api/events/1/thumbnail",
  "camera_id": "uuid",
  "camera_name": "Front Door",
  "frame_number": 12345,
  "priority": "medium | high",
  "acknowledged": false
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
  "camera_id": "uuid",
  "frame": 12345,
  "timestamp": "2026-03-27T10:30:00.123Z",
  "faces": 2,
  "detections": [
    {"bbox": [100,200,80,100], "name": "John", "confidence": 0.92, "source": "recognized"},
    {"bbox": [300,180,70,90], "name": "Unknown-1", "confidence": 0, "source": "unknown"}
  ],
  "processing_ms": 12.5
}
```

**Error Response:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Could not validate credentials",
    "details": null
  }
}
```

---

## 6. Success Metrics

| Metric | Target (Phase 2) | Target (Phase 4) | How to Measure |
|---|---|---|---|
| Face Recognition Accuracy (known) | >95% true positive | >99% true positive | Automated benchmark on labeled test set per model update |
| False Accept Rate | <2% | <0.1% | Track face_recognized events manually verified as wrong person |
| End-to-End Latency (camera to display) | <150ms | <100ms | processing_ms field in frame_metadata WebSocket messages |
| Attendance Record Accuracy | >98% correct check-in/out | >99.5% | Compare auto-generated records vs manual spot-check audit |
| Multi-Camera Throughput | 4 cameras @ 15 FPS each | 8 cameras @ 15 FPS | FPS counters per camera in system health monitoring |
| Report Generation Time | <5s for monthly report | <3s | Server-side timing on /api/attendance/reports |
| System Uptime | >99% | >99.9% | Health monitoring service with minute-level availability tracking |
| Time to Onboard (first person enrolled) | <10 minutes | <5 minutes | Timed onboarding test with new admin user |

---

## 7. Non-Functional Requirements

- **Latency**: < 100ms from camera capture to viewer display (fast path)
- **FPS**: 12–15 FPS sustained regardless of detection load
- **Face recognition**: < 500ms per face (background task, non-blocking)
- **Concurrent viewers**: Support 5+ simultaneous dashboard connections
- **Database**: SQLite, async, supports 100K+ events without degradation
- **Deployment**: Docker Compose (`docker-compose up`) or bare-metal (`python -m server` + `npm run dev`)

---

## 8. Tech Constraints

- Backend and frontend are **separate processes** on potentially different ports
- Backend: Python FastAPI on port 5678, serves **zero HTML** — pure API
- Frontend: Next.js on port 3000 (dev) or any static host (prod)
- Frontend connects to backend URL configured via `NEXT_PUBLIC_API_URL` environment variable
- CORS enabled on backend for frontend origin
- GPU (NVIDIA MX230 2GB VRAM) available for YOLO/ArcFace inference
- ML models (InsightFace buffalo_l, YOLO11n-seg) downloaded automatically during Docker build

---

## 9. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Face recognition accuracy too low for production | High | Medium | Continuous benchmarking from Sprint 1; model A/B testing framework; fallback to manual attendance correction |
| GPU memory insufficient for multi-camera | High | Medium | INT8 quantization; inference queue with priority; support CPU fallback with reduced FPS |
| SQLite bottleneck at scale | Medium | High | Phase 1 adds PostgreSQL migration path; Phase 3 Docker includes PostgreSQL by default |
| Privacy/GDPR compliance for face data | High | Medium | All data self-hosted; face embeddings are non-reversible; add data retention policies and right-to-delete API |
| Scope creep from HikCentral feature parity | Medium | High | Strict MoSCoW prioritization; Phase 4 explicitly defers 15+ HikCentral modules to future versions |
| Anti-spoofing bypass (photo attacks) | High | Medium | Phase 2 adds texture-based liveness; Phase 3 adds depth-based if IR camera available; log all attempts |

---

## 10. Open Questions

1. Should the primary database be SQLite or PostgreSQL from Phase 1? Current recommendation: start SQLite, add PostgreSQL migration in Phase 3.
2. What is the target hardware specification for pilot deployments? Current assumption: Intel i5/i7 + NVIDIA MX230/GTX1050 or better, 16GB RAM.
3. Should the system support offline/intermittent network operation? If sites lose internet, should attendance still be recorded locally and synced later?
4. What third-party payroll systems should the export format target? (CSV is universal, but specific formats like SAP HR or Talenta may be needed.)
5. Should face enrollment support mobile phone cameras (via web camera API in browser) in addition to USB cameras and file upload?
6. What is the legal/compliance environment for face data storage in Indonesia? Are there specific retention period requirements?
7. How many persons/faces should the MVP support? Current architecture targets 10,000; HikCentral supports 1,000,000.
8. Should the system support time zones for multi-site deployments where sites are in different zones?
