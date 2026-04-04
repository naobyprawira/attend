"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

const LOG_ENTRIES = [
  { time: "2024-10-24 14:32:01.442", level: "INFO", message: "FaceEngine: confidence_score detected at 99.7% for entity_id=EMP_0471..." },
  { time: "2024-10-24 14:31:58.118", level: "INFO", message: "Cam 01 RTSP stream re-initialized on Main Entrance. Latency: 32ms." },
  { time: "2024-10-24 14:31:55.003", level: "WARN", message: "High latency detected on stream_id=004-ENG. Current ping: 142ms > threshold 100ms." },
  { time: "2024-10-24 14:31:52.887", level: "ERROR", message: "Camera CAM-009-CNF failed heartbeat check. Attempting reconnection (1/3)..." },
  { time: "2024-10-24 14:31:50.221", level: "INFO", message: "Attendance sync completed. 1,156 records pushed to cloud. Duration: 2.4s." },
  { time: "2024-10-24 14:31:47.009", level: "INFO", message: "FaceEngine: calibration pass completed for zone LOBBY_A. Adjusted brightness +12%." },
  { time: "2024-10-24 14:31:44.556", level: "CRITICAL", message: "Storage volume /data/faces exceeded 90% capacity. Immediate action required." },
  { time: "2024-10-24 14:31:41.332", level: "INFO", message: "New person enrolled: ID=EMP_1285, Name=Rina Maharani. Embedding vector stored." },
  { time: "2024-10-24 14:31:38.119", level: "WARN", message: "Model inference latency spike: avg 85ms -> 210ms. GPU temp: 78C." },
  { time: "2024-10-24 14:31:35.004", level: "INFO", message: "Scheduled backup initiated. Target: cloud-storage/attend-backup-20241024." },
  { time: "2024-10-24 14:31:32.771", level: "INFO", message: "WebSocket client connected from 192.168.1.42. Active viewers: 3." },
  { time: "2024-10-24 14:31:29.558", level: "ERROR", message: "Face detection timeout on frame #48221. Skipping frame, resuming pipeline." },
  { time: "2024-10-24 14:31:26.003", level: "INFO", message: "Zone PARKING_B2 occupancy updated: 42/120 slots. Heatmap refreshed." },
  { time: "2024-10-24 14:31:23.887", level: "INFO", message: "Anti-spoofing check passed for entity_id=EMP_0892. Liveness score: 0.98." },
  { time: "2024-10-24 14:31:20.441", level: "WARN", message: "Duplicate face embedding detected. Merging profiles EMP_0344 and EMP_0345." },
];

const LEVEL_STYLES: Record<string, string> = {
  INFO: "bg-green-500/20 text-green-400",
  WARN: "bg-amber-500/20 text-amber-400",
  ERROR: "bg-red-500/20 text-red-400",
  CRITICAL: "bg-red-600/30 text-red-400 font-black",
};

export default function SystemLogsPage() {
  const [search, setSearch] = useState("");

  const filtered = LOG_ENTRIES.filter(
    (e) =>
      e.message.toLowerCase().includes(search.toLowerCase()) ||
      e.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-surface min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="sr-only">
            System Logs
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
            />
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-container text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span>
            Export
          </Button>
        </div>
      </div>

      {/* Log Viewer */}
      <div className="bg-surface-container-high dark:bg-on-secondary-fixed rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-tertiary">circle</span>
            <span className="text-[10px] text-on-surface-variant dark:text-white/80 font-bold uppercase tracking-widest">
              Live Stream
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant dark:text-white/70 font-mono">
            {filtered.length} entries
          </span>
        </div>
        <div className="font-mono text-[13px] leading-relaxed max-h-[520px] overflow-y-auto">
          {filtered.map((entry, i) => (
            <div
              key={i}
              className={`px-5 py-2.5 flex flex-wrap items-start gap-3 border-b border-outline-variant/10 dark:border-white/5 hover:bg-surface-container-highest/60 dark:hover:bg-white/5 transition-colors ${
                entry.level === "CRITICAL" ? "bg-error/10" : ""
              }`}
            >
              <span className="text-on-surface-variant dark:text-white/70 text-xs shrink-0 mt-0.5">
                {entry.time}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  LEVEL_STYLES[entry.level]
                }`}
              >
                [{entry.level}]
              </span>
              <span className="text-on-surface dark:text-white/80 text-xs break-all">
                {entry.message}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant dark:text-white/70 text-sm">
              No log entries match your search.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Error Rate
          </p>
          <h3 className="text-3xl font-black text-on-surface">0.02%</h3>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_down</span>
            Below threshold
          </p>
        </div>
        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Events Processed
          </p>
          <h3 className="text-3xl font-black text-on-surface">1,240</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Last 24 hours
          </p>
        </div>
        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Storage
          </p>
          <h3 className="text-3xl font-black text-on-surface">84.2 GB</h3>
          <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[84%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
