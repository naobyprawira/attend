"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy data                                                         */
/* ------------------------------------------------------------------ */

type EventType = "FACE_RECOGNIZED" | "UNKNOWN_FACE" | "CAMERA_OFFLINE" | "ACCESS_VIOLATION";
type Priority = "low" | "high" | "medium" | "none";
type Status = "acknowledged" | "new";

interface EventRow {
  id: string;
  time: string;
  date: string;
  type: EventType;
  camera: string;
  person: string | null;
  personAvatar: string | null;
  priority: Priority;
  status: Status;
}

const EVENTS: EventRow[] = [
  {
    id: "SCAN_92834-X",
    time: "10:42:15 AM",
    date: "Oct 24, 2023",
    type: "FACE_RECOGNIZED",
    camera: "Main Lobby - Cam 04",
    person: "Sarah Connor",
    personAvatar: "SC",
    priority: "low",
    status: "acknowledged",
  },
  {
    id: "SCAN_92835-X",
    time: "10:38:04 AM",
    date: "Oct 24, 2023",
    type: "UNKNOWN_FACE",
    camera: "Server Room - Entry",
    person: null,
    personAvatar: null,
    priority: "high",
    status: "new",
  },
  {
    id: "SCAN_92836-X",
    time: "10:35:50 AM",
    date: "Oct 24, 2023",
    type: "CAMERA_OFFLINE",
    camera: "Parking Deck - P2",
    person: null,
    personAvatar: null,
    priority: "none",
    status: "new",
  },
  {
    id: "SCAN_92837-X",
    time: "10:30:12 AM",
    date: "Oct 24, 2023",
    type: "ACCESS_VIOLATION",
    camera: "Executive Floor - West",
    person: "James Warden",
    personAvatar: "JW",
    priority: "medium",
    status: "acknowledged",
  },
];

const BADGE: Record<EventType, { label: string; icon: string; cls: string }> = {
  FACE_RECOGNIZED: {
    label: "Face Recognized",
    icon: "check_circle",
    cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  },
  UNKNOWN_FACE: {
    label: "Unknown Face",
    icon: "warning",
    cls: "bg-error-container text-on-error-container",
  },
  CAMERA_OFFLINE: {
    label: "Camera Offline",
    icon: "videocam_off",
    cls: "bg-secondary-container text-on-secondary-container",
  },
  ACCESS_VIOLATION: {
    label: "Access Violation",
    icon: "security",
    cls: "bg-orange-100 text-orange-700",
  },
};

const CATEGORIES = [
  { label: "Attendance", icon: "calendar_today", active: false },
  { label: "Exceptions", icon: "report_problem", active: true },
  { label: "Logs", icon: "list_alt", active: false },
  { label: "Insights", icon: "analytics", active: false },
  { label: "Archived", icon: "inventory_2", active: false },
];

/* ------------------------------------------------------------------ */
/*  Event Detail Modal                                                 */
/* ------------------------------------------------------------------ */

function EventDetailModal({
  event,
  onClose,
}: {
  event: EventRow;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-on-secondary-fixed/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[90vh] bg-surface-bright rounded-2xl shadow-[0_20px_50px_-12px_rgba(27,28,29,0.15)] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 h-16 sm:h-20 flex items-center justify-between shrink-0 border-b border-outline-variant/10">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <div className="flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-full shrink-0">
              <span
                className="material-symbols-outlined text-sm leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                Unrecognized Entry
              </span>
            </div>
            <span className="text-outline-variant text-xl hidden sm:inline">/</span>
            <h2 className="text-sm sm:text-lg font-bold tracking-tight text-on-surface truncate">
              Event ID: {event.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-secondary">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Visual Evidence */}
          <div className="flex-[1.8] bg-surface-container-lowest relative overflow-hidden min-h-[200px] lg:min-h-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/20 text-[120px]">
                videocam
              </span>
            </div>
            {/* Bounding Box Overlay */}
            <div className="absolute top-[28%] left-[42%] w-[12%] h-[18%] border-[1.5px] border-primary-fixed animate-pulse-live rounded-sm shadow-[0_0_20px_rgba(117,24,89,0.4)]">
              <div className="absolute -top-6 left-0 bg-primary-fixed text-on-primary-fixed text-[8px] font-black uppercase px-1 py-0.5 whitespace-nowrap">
                Target Lock: 98.4% Match
              </div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
            </div>
            {/* HUD Overlays */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2">
              <div className="glass-panel px-3 py-1 rounded-md text-[10px] font-bold text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> CAMERA_04: LOBBY_NORTH
              </div>
              <div className="glass-panel px-3 py-1 rounded-md text-[10px] font-bold text-on-surface-variant">
                TIMESTAMP: 14:02:11.233 UTC
              </div>
            </div>
            {/* Face Crop */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-28 h-28 sm:w-44 sm:h-44 rounded-xl border-4 border-surface-container-lowest shadow-2xl overflow-hidden glass-panel">
              <div className="absolute inset-0 bg-primary/10"></div>
              <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-white/40 text-5xl">face</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 to-transparent flex items-center px-3">
                <span className="text-[9px] font-bold text-white tracking-widest uppercase">
                  Enhance Filter: ON
                </span>
              </div>
            </div>
          </div>

          {/* Right: Metadata */}
          <div className="flex-1 flex flex-col bg-surface-container-low border-l border-outline-variant/10 overflow-y-auto">
            <div className="p-6 sm:p-8 space-y-8 sm:space-y-10">
              {/* Identity */}
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-[0.2em] text-outline uppercase">
                  Recognition Analysis
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-2xl">
                      person_search
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-on-surface">
                      {event.person ?? "Unidentified Guest"}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-medium">
                      Potential Lead:{" "}
                      <span className="text-primary">E. Thompson?</span> (14%
                      Confidence)
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[9px] font-bold text-outline uppercase tracking-widest">
                      Confidence
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-container to-primary"
                          style={{ width: "98%" }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-primary">98%</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[9px] font-bold text-outline uppercase tracking-widest">
                      Risk Level
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      <span className="text-xs font-black text-on-surface">
                        HIGH
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      Processing Latency
                    </span>
                    <span className="text-xs font-bold font-mono text-on-surface">
                      42ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      Sensor Model
                    </span>
                    <span className="text-xs font-bold font-mono text-on-surface">
                      Optic-V4_S
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      Authorization
                    </span>
                    <span className="text-xs font-bold text-error">None Detected</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <span className="text-[10px] font-black tracking-[0.2em] text-outline uppercase">
                  Activity Chain
                </span>
                <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/30">
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-[15px] h-[15px] rounded-full bg-primary ring-4 ring-surface-container-low"></div>
                    <p className="text-[11px] font-bold text-primary mb-1">CURRENT EVENT</p>
                    <p className="text-xs font-bold text-on-surface">
                      Entry detected at main turnstiles
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Today, 14:02:11
                    </p>
                  </div>
                  <div className="relative opacity-60">
                    <div className="absolute -left-[23px] top-1 w-[15px] h-[15px] rounded-full bg-outline-variant ring-4 ring-surface-container-low"></div>
                    <p className="text-xs font-bold text-on-surface">
                      Peripheral scan: Exterior Plaza
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Today, 14:01:45
                    </p>
                  </div>
                  <div className="relative opacity-40">
                    <div className="absolute -left-[23px] top-1 w-[15px] h-[15px] rounded-full bg-outline-variant ring-4 ring-surface-container-low"></div>
                    <p className="text-xs font-bold text-on-surface">
                      Anomaly trigger: Vehicle Drop-off
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Today, 14:00:20
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-4 rounded-xl bg-surface-container-high text-primary font-bold text-xs uppercase tracking-widest hover:brightness-95 transition-all">
                  Flag for Review
                </button>
                <button className="flex-[1.5] py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                  Acknowledge &amp; Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function EventCenterPage() {
  const [activeCategory, setActiveCategory] = useState("Exceptions");
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [filters, setFilters] = useState(["High Priority", "Camera: Ent A"]);

  const removeFilter = (f: string) => setFilters((prev) => prev.filter((x) => x !== f));

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col py-6 w-64 bg-surface-container-lowest shrink-0 border-r border-outline-variant/5">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-primary-container text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                monitoring
              </span>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface">
                Event Center
              </h2>
              <p className="text-[10px] text-primary font-bold tracking-tight">
                High Priority Active
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-3 mx-2 px-4 py-3 w-[calc(100%-1rem)] text-left transition-colors rounded-lg ${
                activeCategory === cat.label
                  ? "bg-fuchsia-50 text-fuchsia-800"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined">{cat.icon}</span>
              <span className="text-sm font-semibold uppercase tracking-widest">
                {cat.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto space-y-4">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
            Generate Report
          </button>
          <div className="border-t border-outline-variant/10 pt-4 space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 text-on-surface-variant px-4 py-2 text-sm uppercase tracking-widest font-semibold"
            >
              <span className="material-symbols-outlined text-sm">help</span> Support
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-on-surface-variant px-4 py-2 text-sm uppercase tracking-widest font-semibold"
            >
              <span className="material-symbols-outlined text-sm">logout</span> Sign Out
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant/5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                  Time Range
                </label>
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg cursor-pointer">
                  <span className="material-symbols-outlined text-primary text-sm">event</span>
                  <span className="text-sm font-semibold">Oct 24, 2023 - Today</span>
                  <span className="material-symbols-outlined text-secondary text-xs">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-outline-variant/20 hidden md:block"></div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                  Active Filters
                </label>
                <div className="flex gap-2 flex-wrap">
                  {filters.map((f) => (
                    <span
                      key={f}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                        f === "High Priority"
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {f}
                      <button onClick={() => removeFilter(f)}>
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-surface-container-low text-primary px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Advanced Filters
              </button>
              <button className="flex items-center gap-2 bg-surface-container-low text-primary px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">ios_share</span>
                Export
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Event Table */}
            <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/5">
              {/* Table Header */}
              <div className="px-4 sm:px-6 py-4 border-b border-outline-variant/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-surface-container-lowest">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error ai-pulse"></span>
                  Real-Time Exception Feed
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    Showing 42 recent events
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-surface-container-low rounded">
                      <span className="material-symbols-outlined text-lg">grid_view</span>
                    </button>
                    <button className="p-1 bg-primary/10 text-primary rounded">
                      <span className="material-symbols-outlined text-lg">view_list</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      {["Timestamp", "Event Type", "Camera", "Person", "Priority", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className={`px-4 sm:px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest ${
                              h === "Priority" ? "text-center" : ""
                            }`}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {EVENTS.map((ev) => {
                      const badge = BADGE[ev.type];
                      return (
                        <tr
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`hover:bg-surface-container-low transition-colors group cursor-pointer ${
                            ev.type === "UNKNOWN_FACE" ? "bg-error/5" : ""
                          }`}
                        >
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{ev.time}</span>
                              <span className="text-[10px] text-on-surface-variant/60 font-medium">
                                {ev.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`${badge.cls} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center w-fit gap-1`}
                            >
                              <span
                                className="material-symbols-outlined text-[14px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                {badge.icon}
                              </span>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span className="text-xs font-semibold text-secondary">
                              {ev.camera}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            {ev.person ? (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[10px] font-bold">
                                  {ev.personAvatar}
                                </div>
                                <span className="text-xs font-bold">{ev.person}</span>
                              </div>
                            ) : ev.type === "UNKNOWN_FACE" ? (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20">
                                  <span className="material-symbols-outlined text-secondary text-sm">
                                    person_off
                                  </span>
                                </div>
                                <span className="text-xs font-bold italic text-on-surface-variant">
                                  Unknown
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-on-surface-variant/40">&mdash;</span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center">
                            {ev.priority === "high" ? (
                              <span
                                className="material-symbols-outlined text-error text-lg"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                priority_high
                              </span>
                            ) : ev.priority === "medium" ? (
                              <span
                                className="material-symbols-outlined text-orange-500 text-lg"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                priority_high
                              </span>
                            ) : ev.priority === "low" ? (
                              <span className="material-symbols-outlined text-secondary text-lg">
                                low_priority
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-secondary/40 text-lg">
                                drag_handle
                              </span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            {ev.status === "new" ? (
                              <span className="text-[10px] font-black text-error uppercase tracking-widest">
                                New
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">
                                Acknowledged
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/5 bg-surface-container-low/30 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  Showing 4 of 1,240 Events
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <span className="text-xs font-bold text-primary px-3">Page 1 of 310</span>
                  <button className="p-1 rounded hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* Last Violation */}
              <div className="bg-on-secondary-fixed text-white p-6 rounded-xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-[10px] font-black text-primary-fixed-dim uppercase tracking-[0.2em] animate-pulse-live">
                    Live
                  </span>
                </div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                  Last Violation Image
                </h4>
                <div className="aspect-video bg-surface-container rounded-lg mb-4 overflow-hidden group cursor-pointer relative">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/20 text-6xl">
                      security
                    </span>
                  </div>
                  <div className="absolute inset-0 border-[1.5px] border-primary/40 opacity-50"></div>
                  <div className="absolute bottom-2 left-2 bg-error px-2 py-0.5 rounded text-[8px] font-black uppercase">
                    Unauthorized
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">Match Confidence</span>
                    <span className="text-xs font-bold text-primary-fixed-dim">98.2%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary-fixed-dim to-primary w-[98%]"></div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-surface-container-highest/10 hover:bg-surface-container-highest/20 text-white py-2.5 rounded-lg text-xs font-bold border border-white/10 transition-colors uppercase tracking-widest">
                  View Full Incident
                </button>
              </div>

              {/* Intelligence Summary */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/5 shadow-sm space-y-4">
                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  Intelligence Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-4 rounded-lg">
                    <span className="text-[8px] font-black text-secondary uppercase block mb-1">
                      Criticals (24h)
                    </span>
                    <span className="text-xl font-black text-error">12</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg">
                    <span className="text-[8px] font-black text-secondary uppercase block mb-1">
                      Avg Resolution
                    </span>
                    <span className="text-xl font-black text-on-surface">
                      4m
                    </span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      lightbulb
                    </span>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
                      Unknown face frequency has increased by 14% at{" "}
                      <span className="font-bold text-primary">Entrance A</span> today.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-sm mt-0.5">
                      timer
                    </span>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
                      Peak event traffic detected between{" "}
                      <span className="font-bold">08:00 AM - 09:30 AM</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-2xl">add</span>
        <span className="absolute right-16 bg-on-secondary-fixed text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Log Manual Event
        </span>
      </button>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
