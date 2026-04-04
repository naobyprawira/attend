"use client";

import { useState } from "react";
import { Select } from "@/components/Select";

// --- Dummy Data ---
const TEMPORAL_INSIGHTS = [
  { label: "Peak Hour", value: "2:00 PM", icon: "schedule" },
  { label: "Avg Dwell Time", value: "8.4 min", icon: "timer" },
  { label: "Flow Rate", value: "24/min", icon: "speed" },
];

const THRESHOLD_METRICS = [
  { label: "Overcrowded Zones", value: "2", color: "bg-error", textColor: "text-error" },
  { label: "Warning Zones", value: "5", color: "bg-tertiary", textColor: "text-tertiary" },
  { label: "Normal Zones", value: "11", color: "bg-green-500", textColor: "text-green-500" },
];

const DETECTED_PERSONS = [
  { id: 1, zone: "Zone A", dwell: "12m 34s", status: "stationary" },
  { id: 2, zone: "Zone B", dwell: "3m 12s", status: "moving" },
  { id: 3, zone: "Zone A", dwell: "8m 45s", status: "stationary" },
  { id: 4, zone: "Zone C", dwell: "1m 02s", status: "moving" },
  { id: 5, zone: "Zone D", dwell: "15m 20s", status: "stationary" },
  { id: 6, zone: "Zone B", dwell: "6m 11s", status: "moving" },
];

const TIMELINE_MARKS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

export default function HeatmapPage() {
  const [scrubberPos, setScrubberPos] = useState(55);
  const [selectedCamera, setSelectedCamera] = useState("Main Lobby");

  const cameras = ["Main Lobby", "East Wing", "Cafeteria", "Parking"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-on-secondary-fixed tracking-tight">
            Density Analysis
          </h2>
          <p className="text-on-surface-variant mt-2 font-medium">
            AI-powered behavioral mapping for{" "}
            <span className="text-primary font-bold">{selectedCamera}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedCamera}
            onChange={setSelectedCamera}
            options={cameras.map((c) => ({ value: c, label: c }))}
          />
          <button className="primary-gradient text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera View */}
        <div className="lg:col-span-8 space-y-4">
          {/* Camera View with Lens Overlay */}
          <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden aspect-video border border-outline-variant/10">
            {/* Dark background with lens effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
              {/* Circular lens overlay */}
              <div className="relative w-3/4 h-3/4">
                <div className="absolute inset-0 rounded-full border-[3px] border-white/10 bg-gradient-to-br from-slate-700/50 to-slate-900/80" />
                <div className="absolute inset-4 rounded-full border border-white/5 bg-gradient-to-br from-slate-600/30 to-slate-800/50" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full bg-gradient-radial from-slate-500/20 to-transparent" />
                {/* Inner lens highlight */}
                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 rounded-full bg-white/5 blur-xl" />
              </div>
              {/* Heatmap color overlay simulation */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-red-500/50 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-yellow-500/40 blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-28 h-28 rounded-full bg-orange-500/30 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-20 h-20 rounded-full bg-green-500/30 blur-3xl" />
              </div>
            </div>

            {/* Stats Overlay - Top Left */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-black/60 backdrop-blur-md rounded-lg px-4 py-2">
                <p className="text-3xl font-black text-white">142</p>
                <p className="text-[9px] text-white/60 uppercase tracking-widest">People Detected</p>
              </div>
              <div className="bg-black/60 backdrop-blur-md rounded-lg px-4 py-2">
                <p className="text-xl font-black text-primary-container">8.4m</p>
                <p className="text-[9px] text-white/60 uppercase tracking-widest">Avg Dwell</p>
                <div className="flex gap-1 mt-1">
                  {[70, 85, 60, 90, 75].map((v, i) => (
                    <div key={i} className="w-1.5 rounded-full bg-primary-container/60" style={{ height: `${v * 0.2}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live</span>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="bg-surface-variant rounded-xl border border-outline-variant/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">skip_previous</span>
              </button>
              <button className="text-primary">
                <span className="material-symbols-outlined text-lg">play_arrow</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">skip_next</span>
              </button>
              <span className="text-xs text-on-surface-variant font-mono ml-2">14:32:15</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                value={scrubberPos}
                onChange={(e) => setScrubberPos(Number(e.target.value))}
                className="w-full accent-primary h-1.5"
              />
              {/* Density intensity bars behind scrubber */}
              <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant font-medium">
                {TIMELINE_MARKS.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Persons */}
          <div className="bg-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
                Detected Persons
              </h4>
              <span className="text-xs text-on-surface-variant font-bold">
                {DETECTED_PERSONS.length} tracked
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">ID</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Zone</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Dwell Time</th>
                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {DETECTED_PERSONS.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-3 text-sm font-mono text-on-surface">#{String(p.id).padStart(3, "0")}</td>
                      <td className="px-6 py-3 text-sm text-on-surface font-medium">{p.zone}</td>
                      <td className="px-6 py-3 text-sm font-mono text-on-surface-variant">{p.dwell}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                          p.status === "stationary" ? "bg-tertiary/10 text-tertiary" : "bg-green-500/10 text-green-500"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Density Scale */}
          <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-4">
              Density Scale
            </h4>
            <div className="h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-green-500 via-yellow-400 via-orange-500 to-red-600" />
            <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant font-medium">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Temporal Insights */}
          <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-5">
              Temporal Insights
            </h4>
            <div className="space-y-4">
              {TEMPORAL_INSIGHTS.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.value}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold Metrics */}
          <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-5">
              Threshold Metrics
            </h4>
            <div className="space-y-3">
              {THRESHOLD_METRICS.map((m) => (
                <div key={m.label} className="flex items-center justify-between bg-surface-container rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${m.color}`} />
                    <span className="text-xs text-on-surface font-medium">{m.label}</span>
                  </div>
                  <span className={`text-lg font-black ${m.textColor}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Summary */}
          <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-4">
              Active Zone Heatmap
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((zone, i) => {
                const intensities = [90, 70, 30, 60, 85, 20, 45, 95, 55];
                const intensity = intensities[i];
                return (
                  <div
                    key={zone}
                    className="aspect-square rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: intensity > 75 ? `rgba(239,68,68,${intensity / 100})` :
                        intensity > 50 ? `rgba(245,158,11,${intensity / 100})` :
                        `rgba(34,197,94,${intensity / 100})`,
                    }}
                  >
                    {zone}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
