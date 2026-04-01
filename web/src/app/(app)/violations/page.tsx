"use client";

import { useState } from "react";

interface Violation {
  id: string;
  name: string;
  severity: "critical" | "high";
  camera: string;
  location: string;
  timestamp: string;
  confidence: number;
  imageUrl: string;
}

const DUMMY_VIOLATIONS: Violation[] = [
  {
    id: "1",
    name: "Unknown Person",
    severity: "critical",
    camera: "CAM-042",
    location: "Server Room 4",
    timestamp: "14:22:15 PST",
    confidence: 98,
    imageUrl: "",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    severity: "high",
    camera: "CAM-108",
    location: "Executive Zone B",
    timestamp: "13:58:02 PST",
    confidence: 82,
    imageUrl: "",
  },
  {
    id: "3",
    name: "Michael Chen",
    severity: "high",
    camera: "CAM-009",
    location: "R&D Lab Floor 2",
    timestamp: "12:45:30 PST",
    confidence: 75,
    imageUrl: "",
  },
  {
    id: "4",
    name: "Unknown Person",
    severity: "high",
    camera: "CAM-214",
    location: "Maintenance Duct 2",
    timestamp: "11:20:11 PST",
    confidence: 88,
    imageUrl: "",
  },
];

export default function ViolationsPage() {
  const [violations] = useState<Violation[]>(DUMMY_VIOLATIONS);

  const highSeverityCount = violations.filter(
    (v) => v.severity === "critical" || v.severity === "high"
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Alert Banner */}
      <div className="p-4 bg-error-container/30 dark:bg-error/10 border-l-4 border-error rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center flex-shrink-0 animate-pulse">
            <span className="material-symbols-outlined text-white">
              warning
            </span>
          </div>
          <div>
            <p className="text-on-error-container dark:text-error font-bold text-lg leading-tight">
              {highSeverityCount} High Severity Access Violations
            </p>
            <p className="text-on-error-container/70 dark:text-error/70 text-sm">
              Require immediate attention in Zone C and Server Room.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-error text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap active:scale-95">
          Deploy Alert Protocol
        </button>
      </div>

      {/* Violations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {violations.map((violation) => (
          <div
            key={violation.id}
            className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-error/20 flex flex-col"
          >
            {/* Image Area */}
            <div className="relative h-48 sm:h-56 group overflow-hidden bg-surface-container-high dark:bg-dark-surface-container-high">
              {/* Placeholder gradient when no real image */}
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest dark:from-dark-surface-container-highest to-on-secondary-fixed/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-white/20 text-6xl">
                  person
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Severity & Camera Tags */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`text-white text-[10px] font-black px-2 py-0.5 rounded tracking-tighter uppercase ${
                    violation.severity === "critical"
                      ? "bg-error"
                      : "bg-orange-500"
                  }`}
                >
                  {violation.severity}
                </span>
                <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    videocam
                  </span>
                  {violation.camera}
                </span>
              </div>

              {/* Name & Timestamp */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg leading-none">
                  {violation.name}
                </h3>
                <p className="text-white/70 text-xs font-medium mt-1">
                  Captured at {violation.timestamp}
                </p>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-xl">
                    location_on
                  </span>
                  <span className="font-bold text-on-surface-variant dark:text-dark-on-surface-variant">
                    {violation.location}
                  </span>
                </div>
                <span className="bg-error-container/30 dark:bg-error/10 text-error text-[10px] font-black border border-error/20 px-2 py-0.5 rounded uppercase tracking-widest">
                  Restricted
                </span>
              </div>

              {/* Threat Confidence */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-secondary dark:text-dark-secondary">
                  <span>Threat Confidence</span>
                  <span
                    className={
                      violation.severity === "critical"
                        ? "text-error"
                        : "text-orange-500"
                    }
                  >
                    {violation.confidence}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      violation.severity === "critical"
                        ? "bg-gradient-to-r from-error to-primary"
                        : "bg-gradient-to-r from-orange-400 to-orange-600"
                    }`}
                    style={{ width: `${violation.confidence}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-surface-container-high dark:bg-dark-surface-container-high text-primary dark:text-dark-primary font-bold py-2 rounded-lg text-sm hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest transition-colors active:scale-95">
                  Acknowledge
                </button>
                <button className="flex-1 bg-primary dark:bg-dark-primary text-white font-bold py-2 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                  Investigate
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Live Stream Feed */}
        <div className="sm:col-span-2 bg-on-secondary-fixed dark:bg-dark-surface-container rounded-xl overflow-hidden relative shadow-2xl flex flex-col">
          {/* Stream Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">
                Live Stream: Secure Zone Entry Spotlight
              </h4>
            </div>
            <div className="flex gap-2">
              <button className="text-white/60 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">
                  settings
                </span>
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">
                  fullscreen
                </span>
              </button>
            </div>
          </div>

          {/* Camera Feed Area */}
          <div className="flex-1 relative bg-black min-h-[280px] sm:min-h-[350px]">
            {/* Dark feed background */}
            <div className="absolute inset-0 bg-gradient-to-br from-on-secondary-fixed to-black opacity-60" />

            {/* AI Scan Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 border-2 border-primary/50 dark:border-primary-fixed-dim/50 rounded-xl flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-primary dark:border-primary-fixed-dim rounded-xl scale-110 opacity-20" />
                <div className="text-[10px] text-primary-fixed-dim font-bold uppercase tracking-widest absolute -top-8 bg-primary/40 px-3 py-1 rounded-full backdrop-blur-md">
                  Scanning Faces...
                </div>
                <div className="w-full h-[1px] bg-primary-fixed-dim absolute top-0 animate-bounce shadow-[0_0_10px_rgba(255,174,219,0.5)]" />
              </div>
            </div>

            {/* Data Overlays */}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col items-end gap-2">
              <div className="bg-black/60 backdrop-blur-lg rounded-lg p-3 border border-white/10 w-40 sm:w-48">
                <div className="flex justify-between text-[10px] text-white/50 font-bold mb-1">
                  <span>CPU LOAD</span>
                  <span className="text-tertiary-fixed">42%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full">
                  <div className="w-[42%] h-full bg-tertiary-fixed rounded-full" />
                </div>
              </div>
              <div className="bg-black/60 backdrop-blur-lg rounded-lg p-3 border border-white/10 w-40 sm:w-48">
                <div className="flex justify-between text-[10px] text-white/50 font-bold mb-1">
                  <span>AI CONFIDENCE</span>
                  <span className="text-primary-fixed-dim">99.8%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full">
                  <div className="w-[99%] h-full bg-primary-fixed-dim rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-error text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
        <span className="material-symbols-outlined text-2xl sm:text-3xl">
          emergency_share
        </span>
      </button>
    </div>
  );
}
