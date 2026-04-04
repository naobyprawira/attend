"use client";

import { useState } from "react";

// --- Dummy Data ---
const VARIANCE_DATA = [
  { label: "Mon", values: [65, 42, 78] },
  { label: "Tue", values: [80, 55, 60] },
  { label: "Wed", values: [45, 88, 70] },
  { label: "Thu", values: [90, 62, 85] },
  { label: "Fri", values: [72, 75, 50] },
  { label: "Sat", values: [30, 40, 35] },
  { label: "Sun", values: [25, 30, 28] },
];
const VAR_MAX = 100;

const PERSON_ALERTS = [
  {
    name: "Marcus Webb",
    alertType: "Restricted Zone Entry",
    confidence: 96.8,
    camera: "CAM-004 East Wing",
    time: "10:42:15 AM",
    severity: "critical",
    description: "Subject detected in restricted zone B4. Movement pattern flagged as unauthorized by perimeter AI module.",
  },
  {
    name: "Unknown Subject",
    alertType: "Behavioral Anomaly",
    confidence: 89.3,
    camera: "CAM-001 Main Lobby",
    time: "10:38:02 AM",
    severity: "warning",
    description: "Unidentified individual exhibiting loitering behavior exceeding 15-minute threshold in lobby sector.",
  },
];

const CAMERA_FEEDS = [
  { id: "CAM-001", name: "Main Lobby", status: "active", alertCount: 3 },
  { id: "CAM-004", name: "East Wing", status: "alert", alertCount: 7 },
  { id: "CAM-007", name: "Cafeteria", status: "active", alertCount: 1 },
  { id: "CAM-009", name: "Conference", status: "active", alertCount: 0 },
  { id: "CAM-012", name: "Parking Entrance", status: "alert", alertCount: 5 },
  { id: "CAM-015", name: "Server Room", status: "active", alertCount: 2 },
];

const RECENT_ALERTS = [
  { time: "10:42 AM", message: "Restricted zone breach - East Wing", severity: "critical", icon: "shield" },
  { time: "10:38 AM", message: "Loitering detected - Main Lobby", severity: "warning", icon: "warning" },
  { time: "10:25 AM", message: "Tailgating attempt - Parking", severity: "critical", icon: "person_alert" },
  { time: "10:15 AM", message: "Camera obstruction - CAM-009", severity: "info", icon: "videocam_off" },
  { time: "10:02 AM", message: "Crowd density threshold - Cafeteria", severity: "warning", icon: "groups" },
  { time: "09:48 AM", message: "Unidentified subject flagged", severity: "warning", icon: "person_search" },
  { time: "09:35 AM", message: "Perimeter sensor triggered - Zone C", severity: "critical", icon: "sensors" },
  { time: "09:20 AM", message: "System calibration anomaly", severity: "info", icon: "tune" },
];

export default function AnomalyPage() {
  const [activeProtocol, setActiveProtocol] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-on-secondary-fixed tracking-tight">
            Active Surveillance
          </h2>
          <p className="text-on-surface-variant mt-2 font-medium">
            Real-time anomaly detection and threat assessment dashboard.
          </p>
        </div>
        <button
          onClick={() => setActiveProtocol(!activeProtocol)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeProtocol
              ? "bg-error text-white shadow-lg shadow-error/20"
              : "bg-surface-variant border border-outline-variant/20 text-on-surface hover:border-primary/40"
          }`}
        >
          <span className="material-symbols-outlined text-sm">{activeProtocol ? "shield" : "shield"}</span>
          {activeProtocol ? "Protocols Active" : "Existing Protocols"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Charts + Person Alerts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Variance Timeline Chart */}
          <div className="bg-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
                Status Microservice Variance Timeline
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span className="text-[10px] text-on-surface-variant">Anomalies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-error" />
                  <span className="text-[10px] text-on-surface-variant">Critical</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-tertiary" />
                  <span className="text-[10px] text-on-surface-variant">Warnings</span>
                </div>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="flex items-end gap-3 sm:gap-4 h-48">
              {VARIANCE_DATA.map((day) => (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-0.5 w-full h-40">
                    {day.values.map((v, vi) => (
                      <div
                        key={vi}
                        className={`flex-1 rounded-t transition-all hover:opacity-80 ${
                          vi === 0 ? "bg-primary" : vi === 1 ? "bg-error" : "bg-tertiary"
                        }`}
                        style={{ height: `${(v / VAR_MAX) * 100}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium mt-1">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Person Alert Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PERSON_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={`bg-surface-variant rounded-xl border overflow-hidden ${
                  alert.severity === "critical"
                    ? "border-error/30"
                    : "border-outline-variant/10"
                }`}
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  {/* Face placeholder */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-surface-container-lowest flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                    <span className="material-symbols-outlined text-white/20 text-4xl relative z-10">
                      {alert.name === "Unknown Subject" ? "person_search" : "person"}
                    </span>
                    {/* Severity indicator */}
                    <div className={`absolute top-1.5 right-1.5 w-3 h-3 rounded-full ${
                      alert.severity === "critical" ? "bg-error animate-pulse" : "bg-tertiary"
                    }`} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-sm font-bold text-on-surface truncate">
                          {alert.name}
                        </h5>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          alert.severity === "critical" ? "text-error" : "text-tertiary"
                        }`}>
                          {alert.alertType}
                        </span>
                      </div>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                        alert.severity === "critical"
                          ? "bg-error/10 text-error"
                          : "bg-tertiary/10 text-tertiary"
                      }`}>
                        {alert.confidence}%
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-[10px] text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">videocam</span>
                        {alert.camera}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Action bar */}
                <div className="flex border-t border-outline-variant/10 divide-x divide-outline-variant/10">
                  <button className="flex-1 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">visibility</span>
                    Review
                  </button>
                  <button className="flex-1 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-error hover:bg-error/5 transition-colors flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">flag</span>
                    Escalate
                  </button>
                  <button className="flex-1 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">check</span>
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Video Surveillance Feeds */}
          <div className="bg-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
                Active Video Surveillance Feeds
              </h4>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">grid_view</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAMERA_FEEDS.map((feed) => (
                <div key={feed.id} className="relative rounded-xl overflow-hidden aspect-video border border-outline-variant/10 group bg-surface-container-lowest cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/15 text-5xl">videocam</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Status indicator */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      feed.status === "alert" ? "bg-error animate-pulse" : "bg-green-500"
                    }`} />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md">
                      {feed.name}
                    </span>
                  </div>
                  {/* Alert count */}
                  {feed.alertCount > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        feed.status === "alert" ? "bg-error text-white" : "bg-white/20 text-white"
                      }`}>
                        {feed.alertCount}
                      </span>
                    </div>
                  )}
                  {/* Camera ID */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[9px] text-white/50 font-mono">{feed.id}</span>
                  </div>
                  {/* Hover border */}
                  <div className="absolute inset-0 border-2 border-primary/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Alerts Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-variant p-4 rounded-xl border border-outline-variant/10 text-center">
              <p className="text-2xl font-black text-error">12</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Critical</p>
            </div>
            <div className="bg-surface-variant p-4 rounded-xl border border-outline-variant/10 text-center">
              <p className="text-2xl font-black text-tertiary">28</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Warnings</p>
            </div>
            <div className="bg-surface-variant p-4 rounded-xl border border-outline-variant/10 text-center">
              <p className="text-2xl font-black text-on-surface">156</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Total Today</p>
            </div>
            <div className="bg-surface-variant p-4 rounded-xl border border-outline-variant/10 text-center">
              <p className="text-2xl font-black text-green-500">94%</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">Resolved</p>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
                Recent Alerts
              </h4>
              <a href="/events" className="text-primary font-bold text-xs hover:underline">View All</a>
            </div>
            <div className="p-4 sm:p-5 space-y-0">
              {RECENT_ALERTS.map((alert, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {/* Timeline connector */}
                  {i < RECENT_ALERTS.length - 1 && (
                    <div className="absolute left-[15px] top-8 w-px h-[calc(100%-16px)] bg-outline-variant/20" />
                  )}
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity === "critical" ? "bg-error/10" :
                    alert.severity === "warning" ? "bg-tertiary/10" :
                    "bg-primary/10"
                  }`}>
                    <span className={`material-symbols-outlined text-sm ${
                      alert.severity === "critical" ? "text-error" :
                      alert.severity === "warning" ? "text-tertiary" :
                      "text-primary"
                    }`}>
                      {alert.icon}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface font-medium leading-snug">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-on-surface-variant">
                        {alert.time}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        alert.severity === "critical" ? "bg-error/10 text-error" :
                        alert.severity === "warning" ? "bg-tertiary/10 text-tertiary" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Level Indicator */}
          <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-4">
              Threat Level
            </h4>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="transparent" stroke="currentColor" strokeWidth="6"
                    className="text-surface-container-high" />
                  <circle cx="40" cy="40" r="34" fill="transparent" stroke="#ef4444" strokeWidth="6"
                    strokeDasharray="214" strokeDashoffset="64" strokeLinecap="round" />
                </svg>
                <span className="absolute text-lg font-black text-error">70</span>
              </div>
              <div>
                <p className="text-sm font-bold text-error">Elevated</p>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                  Multiple concurrent anomalies detected across zones. Enhanced monitoring active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
