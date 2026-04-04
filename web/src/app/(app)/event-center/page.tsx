"use client";

import { Button } from "@/components/ui/Button";

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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-on-surface/40 backdrop-blur-sm"
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
          <Button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-secondary">close</span>
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Visual Evidence */}
          <div className="flex-[1.8] bg-surface-container-lowest relative overflow-hidden min-h-[200px] lg:min-h-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/35 text-[120px]">
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
                <span className="material-symbols-outlined text-white/80 text-5xl">face</span>
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
                <Button className="flex-1 py-4 rounded-xl bg-surface-container-high text-primary font-bold text-xs uppercase tracking-widest hover:brightness-95 transition-all">
                  Flag for Review
                </Button>
                <Button className="flex-[1.5] py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                  Acknowledge &amp; Close
                </Button>
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
    <div className="min-h-screen bg-surface text-on-surface">
      <main className="mx-auto w-full max-w-[1700px] p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Event Center</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Real-time anomaly stream, prioritization, and response workflow in one view.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="rounded-lg border border-outline-variant/30 bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container">
                Generate Report
              </Button>
              <Button className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:opacity-90">
                Log Manual Event
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max gap-1 rounded-xl bg-surface-container p-1">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    activeCategory === cat.label
                      ? "bg-surface-container-lowest text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{cat.icon}</span>
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 sm:p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-secondary">Time Range</p>
              <div className="flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-semibold">
                <span className="material-symbols-outlined text-base text-primary">event</span>
                Oct 24, 2023 - Today
                <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-outline-variant/30 sm:block"></div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-secondary">Active Filters</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <span
                    key={f}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                      f === "High Priority"
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {f}
                    <Button
                      onClick={() => removeFilter(f)}
                      className="rounded-full p-0.5 text-current hover:bg-surface-container-high"
                      aria-label={`Remove ${f} filter`}
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </Button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button className="inline-flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-bold text-primary hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-base">filter_list</span>
              Advanced Filters
            </Button>
            <Button className="inline-flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-bold text-primary hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-base">ios_share</span>
              Export
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-outline-variant/15 bg-surface-container-low px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-error ai-pulse"></span>
                Real-Time Exception Feed
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Showing 42 recent events</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {["Timestamp", "Event Type", "Camera", "Person", "Priority", "Status"].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary sm:px-6 ${
                          h === "Priority" ? "text-center" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {EVENTS.map((ev) => {
                    const badge = BADGE[ev.type];
                    return (
                      <tr
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                          ev.type === "UNKNOWN_FACE" ? "bg-error/5" : ""
                        }`}
                      >
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{ev.time}</span>
                            <span className="text-[10px] font-medium text-on-surface-variant/70">{ev.date}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <span className={`${badge.cls} inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter`}>
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {badge.icon}
                            </span>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <span className="text-xs font-semibold text-secondary">{ev.camera}</span>
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          {ev.person ? (
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-[10px] font-bold text-on-primary-container">
                                {ev.personAvatar}
                              </div>
                              <span className="text-xs font-bold">{ev.person}</span>
                            </div>
                          ) : ev.type === "UNKNOWN_FACE" ? (
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high">
                                <span className="material-symbols-outlined text-sm text-secondary">person_off</span>
                              </div>
                              <span className="text-xs font-bold italic text-on-surface-variant">Unknown</span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-on-surface-variant/75">&mdash;</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center sm:px-6">
                          {ev.priority === "high" ? (
                            <span className="material-symbols-outlined text-lg text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                              priority_high
                            </span>
                          ) : ev.priority === "medium" ? (
                            <span className="material-symbols-outlined text-lg text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                              priority_high
                            </span>
                          ) : ev.priority === "low" ? (
                            <span className="material-symbols-outlined text-lg text-secondary">low_priority</span>
                          ) : (
                            <span className="material-symbols-outlined text-lg text-secondary/70">drag_handle</span>
                          )}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          {ev.status === "new" ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-error">New</span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">Acknowledged</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 border-t border-outline-variant/15 bg-surface-container-low/40 px-4 py-4 sm:flex-row sm:px-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Showing 4 of 1,240 events</span>
              <div className="flex items-center gap-2">
                <Button className="rounded p-1 hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </Button>
                <span className="px-3 text-xs font-bold text-primary">Page 1 of 310</span>
                <Button className="rounded p-1 hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </Button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-high p-6 shadow-sm">
              <div className="absolute right-4 top-4">
                <span className="animate-pulse-live text-[10px] font-black uppercase tracking-[0.2em] text-primary-fixed-dim">Live</span>
              </div>
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Last Violation Image</h4>
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-surface-container">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-highest">
                  <span className="material-symbols-outlined text-6xl text-outline/70">security</span>
                </div>
                <div className="absolute inset-0 border-[1.5px] border-primary/40 opacity-50"></div>
                <div className="absolute bottom-2 left-2 rounded bg-error px-2 py-0.5 text-[8px] font-black uppercase text-white">Unauthorized</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Match Confidence</span>
                  <span className="text-xs font-bold text-primary-fixed-dim">98.2%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container">
                  <div className="h-full w-[98%] bg-gradient-to-r from-secondary-fixed-dim to-primary"></div>
                </div>
              </div>
              <Button className="mt-6 w-full rounded-lg border border-outline-variant/20 bg-surface-container-highest/30 py-2.5 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-highest/50">
                View Full Incident
              </Button>
            </section>

            <section className="space-y-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Intelligence Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-container-low p-4">
                  <span className="mb-1 block text-[8px] font-black uppercase text-secondary">Criticals (24h)</span>
                  <span className="text-xl font-black text-error">12</span>
                </div>
                <div className="rounded-lg bg-surface-container-low p-4">
                  <span className="mb-1 block text-[8px] font-black uppercase text-secondary">Avg Resolution</span>
                  <span className="text-xl font-black text-on-surface">4m</span>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-sm text-primary">lightbulb</span>
                  <p className="text-[11px] font-medium leading-relaxed text-on-surface-variant">
                    Unknown face frequency has increased by 14% at <span className="font-bold text-primary">Entrance A</span> today.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-sm text-secondary">timer</span>
                  <p className="text-[11px] font-medium leading-relaxed text-on-surface-variant">
                    Peak event traffic detected between <span className="font-bold">08:00 AM - 09:30 AM</span>.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* FAB */}
      <Button className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-2xl">add</span>
        <span className="absolute right-16 bg-surface-container-high text-on-surface dark:bg-on-secondary-fixed dark:text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-outline-variant/20">
          Log Manual Event
        </span>
      </Button>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
