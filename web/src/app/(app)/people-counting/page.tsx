"use client";

import { useState } from "react";

// --- Dummy Data ---
const HOURLY_COUNTS = [12, 18, 30, 45, 62, 78, 88, 95, 80, 65, 55, 42, 38, 50, 68, 74, 60, 45, 30, 22, 15, 10, 8, 5];
const HOURLY_MAX = Math.max(...HOURLY_COUNTS);

const CAMERA_TRAFFIC = [
  { name: "Main Lobby", id: "CAM-001", count: 342, max: 400 },
  { name: "East Wing Corridor", id: "CAM-004", count: 287, max: 400 },
  { name: "Cafeteria", id: "CAM-007", count: 198, max: 400 },
  { name: "Parking Entrance", id: "CAM-012", count: 156, max: 400 },
  { name: "Conference Floor", id: "CAM-009", count: 124, max: 400 },
];

const SECURITY_PULSE = [
  { time: "10:42 AM", event: "Unusual crowd density in Lobby", severity: "high" },
  { time: "10:38 AM", event: "Zone B capacity reached 90%", severity: "medium" },
  { time: "10:25 AM", event: "Camera CAM-004 back online", severity: "low" },
  { time: "10:15 AM", event: "Peak flow detected at East Wing", severity: "medium" },
  { time: "09:58 AM", event: "System calibration complete", severity: "low" },
  { time: "09:42 AM", event: "Anomalous movement pattern flagged", severity: "high" },
];

const ZONES = [
  { name: "Zone A - Lobby", occupancy: 45, capacity: 60 },
  { name: "Zone B - East Wing", occupancy: 32, capacity: 40 },
  { name: "Zone C - Cafeteria", occupancy: 28, capacity: 50 },
  { name: "Zone D - Conference", occupancy: 18, capacity: 30 },
];

export default function PeopleCountingPage() {
  const [selectedDate, setSelectedDate] = useState("2026-03-30");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface dark:bg-dark-surface min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">
            Occupancy Intelligence
          </h2>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-2 font-medium">
            Real-time people counting and zone occupancy analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-on-surface-variant text-sm">calendar_today</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-surface-variant dark:bg-dark-surface-variant border border-outline-variant/20 rounded-xl px-4 py-2 text-sm text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Top Row: Stat Circles + World of Entropy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stat Circles */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Current Occupancy */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-4">
              Current Occupancy
            </p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" fill="transparent" stroke="currentColor" strokeWidth="10"
                  className="text-surface-container-high dark:text-dark-surface-container-high" />
                <circle cx="64" cy="64" r="54" fill="transparent" stroke="url(#occGrad1)" strokeWidth="10"
                  strokeDasharray="339" strokeDashoffset="220" strokeLinecap="round" />
                <defs>
                  <linearGradient id="occGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#751859" }} />
                    <stop offset="100%" style={{ stopColor: "#923272" }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-on-surface dark:text-dark-on-surface">23</span>
                <span className="text-[9px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest">People</span>
              </div>
            </div>
          </div>

          {/* Zones Active */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-4">
              Zones Active
            </p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" fill="transparent" stroke="currentColor" strokeWidth="10"
                  className="text-surface-container-high dark:text-dark-surface-container-high" />
                <circle cx="64" cy="64" r="54" fill="transparent" stroke="#923272" strokeWidth="10"
                  strokeDasharray="339" strokeDashoffset="0" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-on-surface dark:text-dark-on-surface">4</span>
                <span className="text-[9px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>

          {/* Capacity Usage */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-4">
              Capacity Usage
            </p>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="54" fill="transparent" stroke="currentColor" strokeWidth="10"
                  className="text-surface-container-high dark:text-dark-surface-container-high" />
                <circle cx="64" cy="64" r="54" fill="transparent" stroke="url(#occGrad2)" strokeWidth="10"
                  strokeDasharray="339" strokeDashoffset="40" strokeLinecap="round" />
                <defs>
                  <linearGradient id="occGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#751859" }} />
                    <stop offset="100%" style={{ stopColor: "#d946ef" }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-on-surface dark:text-dark-on-surface">88%</span>
                <span className="text-[9px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest">Utilized</span>
              </div>
            </div>
          </div>
        </div>

        {/* World of Entropy - Dark Card */}
        <div className="lg:col-span-4 bg-dark-surface-container-lowest rounded-xl p-6 flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-white">blur_on</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-container text-lg">auto_awesome</span>
              <h4 className="text-sm font-bold text-white tracking-widest uppercase">World of Entropy</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              AI-driven occupancy prediction model analyzing movement patterns, dwell times, and flow dynamics across all monitored zones.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
            <div>
              <p className="text-2xl font-black text-white">94.2%</p>
              <p className="text-[9px] text-white/50 uppercase tracking-widest">Prediction Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-black text-primary-container">1.2k</p>
              <p className="text-[9px] text-white/50 uppercase tracking-widest">Data Points / hr</p>
            </div>
          </div>
          <div className="mt-4 flex gap-1 relative z-10">
            {[60, 80, 45, 90, 70, 55, 85, 95, 75, 65, 50, 88].map((h, i) => (
              <div key={i} className="flex-1 bg-white/10 rounded-t" style={{ height: `${h * 0.4}px` }}>
                <div className="w-full bg-primary-container/60 rounded-t" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Hourly Chart + Camera Traffic + Security Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly People Count */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
                Hourly People Count
              </h4>
              <span className="text-[10px] bg-primary/20 text-primary-fixed-dim px-2 py-1 rounded font-bold">
                Today&apos;s aggregate across all monitored zones
              </span>
            </div>
            {/* Area Chart approximation */}
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 480 192" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: "#923272", stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: "#923272", stopOpacity: 0.02 }} />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 48, 96, 144, 192].map((y) => (
                  <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="currentColor" strokeWidth="0.5"
                    className="text-outline-variant/10 dark:text-dark-outline-variant/20" />
                ))}
                {/* Area */}
                <path
                  d={`M0,${192 - (HOURLY_COUNTS[0] / HOURLY_MAX) * 180} ${HOURLY_COUNTS.map((c, i) => `L${(i / 23) * 480},${192 - (c / HOURLY_MAX) * 180}`).join(" ")} L480,192 L0,192 Z`}
                  fill="url(#areaFill)"
                />
                {/* Line */}
                <path
                  d={`M0,${192 - (HOURLY_COUNTS[0] / HOURLY_MAX) * 180} ${HOURLY_COUNTS.map((c, i) => `L${(i / 23) * 480},${192 - (c / HOURLY_MAX) * 180}`).join(" ")}`}
                  fill="none" stroke="#923272" strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant font-medium">
              {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Camera Traffic Comparison */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
                Camera Traffic Comparison
              </h4>
              <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-on-surface-variant text-sm cursor-pointer hover:text-primary transition-colors">
                more_vert
              </span>
            </div>
            <div className="space-y-4">
              {CAMERA_TRAFFIC.map((cam) => (
                <div key={cam.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface dark:text-dark-on-surface font-medium">{cam.name}</span>
                    <span className="text-on-surface-variant dark:text-dark-on-surface-variant font-bold">{cam.count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000"
                      style={{ width: `${(cam.count / cam.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Pulse */}
        <div className="lg:col-span-4 bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 rounded-xl border border-outline-variant/10">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-6">
            Security Pulse
          </h4>
          <div className="space-y-0">
            {SECURITY_PULSE.map((item, i) => (
              <div key={i} className="flex gap-4 pb-5 relative">
                {/* Timeline line */}
                {i < SECURITY_PULSE.length - 1 && (
                  <div className="absolute left-[7px] top-5 w-px h-full bg-outline-variant/20 dark:bg-dark-outline-variant/20" />
                )}
                {/* Dot */}
                <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${
                  item.severity === "high" ? "bg-error" :
                  item.severity === "medium" ? "bg-tertiary" :
                  "bg-green-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface dark:text-dark-on-surface font-medium leading-snug">
                    {item.event}
                  </p>
                  <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Occupancy Table */}
      <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
            Zone Occupancy Breakdown
          </h4>
          <span className="text-[10px] bg-primary/20 text-primary-fixed-dim px-2 py-1 rounded font-bold">
            Real-time
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">Zone</th>
                <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">Occupancy</th>
                <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">Capacity</th>
                <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">Usage</th>
                <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {ZONES.map((zone) => {
                const pct = Math.round((zone.occupancy / zone.capacity) * 100);
                return (
                  <tr key={zone.name} className="hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface dark:text-dark-on-surface">{zone.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface dark:text-dark-on-surface">{zone.occupancy}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{zone.capacity}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-on-surface dark:text-dark-on-surface">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        pct > 80 ? "bg-error/10 text-error" : pct > 60 ? "bg-tertiary/10 text-tertiary" : "bg-green-500/10 text-green-500"
                      }`}>
                        {pct > 80 ? "High" : pct > 60 ? "Moderate" : "Normal"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
