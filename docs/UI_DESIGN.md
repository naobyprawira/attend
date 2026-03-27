# Kamera — UI Design Specification

## Design Language

**Theme**: Dark surveillance aesthetic. Professional, not gamified.
**Color palette**:
- Background: `#09090b` (zinc-950)
- Surface: `#18181b` (zinc-900)
- Surface raised: `#27272a` (zinc-800)
- Border: `#3f3f46` (zinc-700)
- Text primary: `#fafafa` (zinc-50)
- Text secondary: `#a1a1aa` (zinc-400)
- Text muted: `#71717a` (zinc-500)
- Accent blue: `#3b82f6`
- Success green: `#22c55e`
- Danger red: `#ef4444`
- Warning amber: `#f59e0b`
- Cyan: `#06b6d4`

**Typography**: `Inter` for UI text, `JetBrains Mono` for data/stats/timestamps.
**Border radius**: Minimal. `rounded-md` (6px) for cards, `rounded-sm` (2px) for badges/tags.
**Spacing**: 16px grid system. Consistent `p-4` / `gap-4` rhythm.

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│ [Sidebar]  │           [Main Content Area]           │
│            │                                          │
│  Logo      │  Varies by page:                        │
│  ────────  │  - Dashboard: card grid + event feed    │
│  Dashboard │  - Live View: video + sidebar panel     │
│  Live View │  - Event Center: table + filters        │
│  Events    │  - Persons: card grid + dialogs         │
│  Persons   │  - Settings: form sections              │
│  Settings  │                                          │
│            │                                          │
│  ────────  │                                          │
│  Status    │                                          │
│  dot       │                                          │
└──────────────────────────────────────────────────────┘
```

**Sidebar**: Fixed left, 240px wide (64px collapsed). Dark surface background.
**Main area**: Fills remaining space. Each page has its own layout.

---

## Page Designs

### Dashboard (`/`)

```
┌─────────────────────────────────────────────────┐
│                   DASHBOARD                      │
├────────┬────────┬────────┬────────┬─────────────┤
│ Camera │ Events │ Recog- │Unknown │  Activity    │
│ Status │ Today  │ nized  │ Faces  │  Chart       │
│  🟢 1  │  124   │   89   │   35   │  ▁▃▅▇▅▃▁   │
│ online │        │        │        │  (24h bars)  │
├────────┴────────┴────────┴────────┴─────────────┤
│                                                   │
│  RECENT EVENTS                     [View All →]  │
│  ┌──────────────────────────────────────────┐    │
│  │ 10:30  🟢 John recognized (92%)    [img] │    │
│  │ 10:28  🔴 Unknown face detected    [img] │    │
│  │ 10:25  🟢 Jane recognized (87%)    [img] │    │
│  │ 10:20  🔴 Unknown face detected    [img] │    │
│  │ ...                                       │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
│  RECENT CAPTURES                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│  │John│ │ ?? │ │Jane│ │ ?? │ │John│ │ ?? │     │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │
└─────────────────────────────────────────────────┘
```

**Components**:
- 4 stat cards (top row): icon + number + label. Colored accent borders.
- Activity chart: simple bar chart, 24 bars for hours. Uses `<canvas>` or CSS bars.
- Recent events list: 10 items, each with time, colored dot, description, thumbnail.
- Recent captures strip: horizontal scroll of face thumbnails with name labels.

### Live View (`/live`)

```
┌─────────────────────────────────────┬──────────┐
│                                     │ CONTROLS │
│                                     │          │
│          VIDEO FEED                 │ FPS: 14  │
│          (canvas)                   │ Lat: 12ms│
│                                     │ Frm: 5k  │
│    [Detection boxes drawn           │          │
│     on canvas: green=known          │ ──────── │
│     red=unknown]                    │ BG MODE  │
│                                     │ [N][G]   │
│                                     │ [B][K]   │
│                                     │          │
│                                     │ ──────── │
│                                     │ IN FRAME │
│                                     │ 👤 2     │
│                                     │          │
├─────────────────────────────────────┤ ──────── │
│ FACE STRIP (horizontal scroll)      │ EVENT    │
│ [img][img][img][img][img][img]      │ LOG      │
│  John  ??  Jane  ??  John  ??      │ (scroll) │
└─────────────────────────────────────┴──────────┘
```

**Layout**: 75/25 split. Video feed is dominant.
**Control panel** (right): Compact stats, BG mode selector, face count, scrollable event log.
**Face strip** (bottom): Horizontal scrollable row of recent face captures under the video.
**Detection boxes**: Drawn on canvas by frontend using bbox data from metadata. Green border + name label for recognized, red border + "Unknown" for unrecognized.

### Event Center (`/events`)

```
┌─────────────────────────────────────────────────┐
│ EVENT CENTER                                     │
├─────────────────────────────────────────────────┤
│ Filters: [Date Range ▼] [Type ▼] [Search name] │
│                                                   │
│ Summary: 124 events | 89 recognized | 35 unknown │
├─────────────────────────────────────────────────┤
│ Time       │ Thumb │ Type        │ Person │ Conf │
│────────────┼───────┼─────────────┼────────┼──────│
│ 10:30:15   │ [img] │ 🟢 Recog.  │ John   │ 92%  │
│ 10:28:42   │ [img] │ 🔴 Unknown │ —      │ —    │
│ 10:25:01   │ [img] │ 🟢 Recog.  │ Jane   │ 87%  │
│ ...        │       │             │        │      │
├─────────────────────────────────────────────────┤
│ Showing 1-50 of 124          [← Prev] [Next →] │
└─────────────────────────────────────────────────┘
```

**Components**:
- Filter bar: date range, event type dropdown, text search for person name.
- Summary row: colored count badges.
- Data table: sortable columns, thumbnail preview, colored type badges.
- Pagination.
- Click row → event detail modal with larger image.

### Person Management (`/persons`)

```
┌─────────────────────────────────────────────────┐
│ PERSONS                          [+ Add Person] │
├─────────────────────────────────────────────────┤
│ Search: [________________]                       │
│                                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │  [photo]  │ │  [photo]  │ │  [photo]  │         │
│ │  John Doe │ │ Jane Smith│ │ Bob Lee   │         │
│ │  47 recog │ │  23 recog │ │  12 recog │         │
│ │  Added    │ │  Added    │ │  Added    │         │
│ │  Mar 20   │ │  Mar 22   │ │  Mar 25   │         │
│ │  [Delete] │ │  [Delete] │ │  [Delete] │         │
│ └──────────┘ └──────────┘ └──────────┘         │
└─────────────────────────────────────────────────┘
```

**Components**:
- Top bar: search input + "Add Person" button.
- Person cards: photo, name, recognition count, date added, delete button.
- Add Person dialog (modal): name text input + photo upload with drag-drop zone + preview.

### Settings (`/settings`)

```
┌─────────────────────────────────────────────────┐
│ SETTINGS                                         │
├─────────────────────────────────────────────────┤
│                                                   │
│ DETECTION                                        │
│ ┌───────────────────────────────────────────┐   │
│ │ Face Detection          [toggle: ON/OFF]  │   │
│ │ Face Recognition        [toggle: ON/OFF]  │   │
│ │ Confidence Threshold    [slider: 0.5]     │   │
│ │ Recognition Model       [dropdown]        │   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│ BACKGROUND REMOVAL                               │
│ ┌───────────────────────────────────────────┐   │
│ │ YOLO Segmentation       [toggle: ON/OFF]  │   │
│ │ Temporal Smoothing       [slider: 0.6]    │   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│ CAMERA                                           │
│ ┌───────────────────────────────────────────┐   │
│ │ Target FPS              [input: 15]       │   │
│ │ JPEG Quality            [slider: 80]      │   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│ SYSTEM INFO                                      │
│ ┌───────────────────────────────────────────┐   │
│ │ Server Uptime:   15h 26m                  │   │
│ │ GPU:             NVIDIA MX230 (CUDA)      │   │
│ │ YOLO Model:      yolo11n-seg.pt           │   │
│ │ Face Model:      Facenet512               │   │
│ │ Database:        1,234 events             │   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│                              [Save Changes]      │
└─────────────────────────────────────────────────┘
```

---

## Component Library

Using **shadcn/ui** components (installed individually):
- `Button` — all buttons
- `Card` — stat cards, person cards, settings sections
- `Dialog` — add person modal, event detail modal
- `Input` — text inputs
- `Select` — dropdowns
- `Slider` — threshold controls
- `Switch` — toggles
- `Table` — event table
- `Badge` — event type tags, status indicators
- `Tabs` — settings sections (if needed)
- `Separator` — section dividers

---

## Responsive Behavior

- **Desktop (>1200px)**: Full sidebar + full layout as designed.
- **Tablet (768-1200px)**: Sidebar collapses to icons (64px). Live View control panel stacks below.
- **Mobile (<768px)**: Sidebar hidden (hamburger menu). Single column layout. Not primary target.

---

## State Management

No Redux/Zustand. Use React Context + hooks:
- `KameraSocketContext`: WebSocket connection, frame rendering, metadata stream.
- `useStatus()`: polls `/api/status` every 3s.
- `useEvents()`: fetches events with filters.
- `usePersons()`: CRUD for known faces.
- `useSettings()`: get/update settings.

---

## File Structure (Frontend)

```
web/src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── live/page.tsx       # Live View
│   ├── events/page.tsx     # Event Center
│   ├── persons/page.tsx    # Person Management
│   └── settings/page.tsx   # Settings
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── PageHeader.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── ActivityChart.tsx
│   │   ├── RecentEvents.tsx
│   │   └── RecentCaptures.tsx
│   ├── live/
│   │   ├── VideoCanvas.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── FaceStrip.tsx
│   │   └── DetectionOverlay.tsx
│   ├── events/
│   │   ├── EventTable.tsx
│   │   ├── EventFilters.tsx
│   │   └── EventDetail.tsx
│   ├── persons/
│   │   ├── PersonGrid.tsx
│   │   ├── PersonCard.tsx
│   │   └── AddPersonDialog.tsx
│   └── settings/
│       ├── DetectionSettings.tsx
│       ├── BackgroundSettings.tsx
│       ├── CameraSettings.tsx
│       └── SystemInfo.tsx
├── hooks/
│   ├── useKameraSocket.ts
│   ├── useStatus.ts
│   ├── useEvents.ts
│   ├── usePersons.ts
│   └── useSettings.ts
├── lib/
│   ├── api.ts
│   └── types.ts
└── styles/
    └── globals.css
```
