"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy data                                                        */
/* ------------------------------------------------------------------ */

const FLOORS = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];

const ZONE_OVERLAYS = [
  { id: "A", label: "ZONE A: WORKSPACE", top: "15%", left: "10%", w: "35%", h: "30%", color: "emerald" },
  { id: "B", label: "ZONE B: DATA HUB", top: "15%", right: "12%", w: "18%", h: "20%", color: "amber" },
  { id: "C", label: "ZONE C: VAULT", bottom: "20%", left: "45%", w: "15%", h: "25%", color: "red" },
];

const CAMERAS = [
  { id: "CAM-04", label: "CAM-04: NORTH WORKSPACE", top: "20%", left: "25%", highlight: false },
  { id: "CAM-09", label: "CAM-09: LOBBY RECEPTION", bottom: "35%", right: "25%", highlight: false },
  { id: "CAM-12", label: "CAM-12: VAULT INTERNAL", bottom: "22%", left: "48%", highlight: true },
];

const IDENTIFICATIONS = [
  { name: "Marcus Thorne", role: "Authorized - Manager", match: "98%" },
  { name: "Elena Vance", role: "Authorized - Visitor", match: "94%" },
];

const LEGEND = [
  { color: "bg-emerald-500 shadow-emerald-500/50", label: "Public / Open Area" },
  { color: "bg-amber-500 shadow-amber-500/50", label: "Restricted Access" },
  { color: "bg-error shadow-error/50", label: "High Security Vault" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ZoneMapPage() {
  const [selectedFloor, setSelectedFloor] = useState(3);
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [selectedZone, setSelectedZone] = useState<string | null>("C");

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-surface min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="sr-only">Main Building Floor Plan</h1>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* View mode toggle */}
          <div className="flex p-1 bg-surface-container-high rounded-lg">
            <Button
              onClick={() => setViewMode("2D")}
              className={`px-4 py-1.5 text-xs font-bold rounded ${viewMode === "2D" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-secondary"}`}
            >
              2D VIEW
            </Button>
            <Button
              onClick={() => setViewMode("3D")}
              className={`px-4 py-1.5 text-xs font-bold rounded ${viewMode === "3D" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-secondary"}`}
            >
              3D PERSPECTIVE
            </Button>
          </div>
          <Button className="px-4 py-2 bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Floor selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FLOORS.map((f, i) => (
          <Button
            key={f}
            onClick={() => setSelectedFloor(i)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              i === selectedFloor
                ? "bg-primary text-white"
                : "bg-surface-container-high text-secondary hover:bg-surface-container-highest"
            }`}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Main content: map + detail panel */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 relative">
        {/* Floor plan area */}
        <div className="flex-1 bg-surface-container-low rounded-xl relative overflow-hidden min-h-[400px] lg:min-h-[600px]">
          {/* Blueprint placeholder with grid lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-outline-variant/20" strokeWidth="0.5" />
                </pattern>
                <pattern id="gridLg" width="200" height="200" patternUnits="userSpaceOnUse">
                  <path d="M 200 0 L 0 0 0 200" fill="none" stroke="currentColor" className="text-outline-variant/30" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#gridLg)" />
            </svg>
          </div>

          {/* Zone overlays */}
          {ZONE_OVERLAYS.map((z) => {
            const zoneColorMap: Record<string, string> = {
              emerald: "bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/30",
              amber: "bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30",
              red: "bg-error/20 border-error/40 hover:bg-error/30",
            };
            const textColorMap: Record<string, string> = {
              emerald: "text-emerald-800",
              amber: "text-amber-800",
              red: "text-error",
            };
            const pulseMap: Record<string, string> = {
              emerald: "bg-emerald-400/10",
              amber: "bg-amber-400/10",
              red: "bg-error/10",
            };
            const style: React.CSSProperties = {
              width: z.w,
              height: z.h,
              ...(z.top ? { top: z.top } : {}),
              ...(z.bottom ? { bottom: z.bottom } : {}),
              ...(z.left ? { left: z.left } : {}),
              ...(z.right ? { right: z.right } : {}),
            };
            return (
              <div
                key={z.id}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all ${zoneColorMap[z.color]} ${selectedZone === z.id ? "ring-2 ring-primary" : ""}`}
                style={style}
                onClick={() => setSelectedZone(z.id)}
              >
                <div className={`absolute inset-0 animate-pulse ${pulseMap[z.color]}`} />
                <span className={`absolute top-2 left-3 text-[10px] font-bold tracking-wider ${textColorMap[z.color]}`}>{z.label}</span>
              </div>
            );
          })}

          {/* Camera icons */}
          {CAMERAS.map((cam) => {
            const style: React.CSSProperties = {
              ...(cam.top ? { top: cam.top } : {}),
              ...(cam.bottom ? { bottom: cam.bottom } : {}),
              ...(cam.left ? { left: cam.left } : {}),
              ...(cam.right ? { right: cam.right } : {}),
            };
            return (
              <div key={cam.id} className="absolute group cursor-pointer" style={style}>
                <div className={`w-10 h-10 ${cam.highlight ? "bg-primary ring-4 ring-primary/20 text-white" : "bg-surface-container-high dark:bg-on-secondary-fixed text-on-surface dark:text-white border border-outline-variant/20"} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                </div>
                <div className="hidden group-hover:block absolute top-12 left-1/2 -translate-x-1/2 glass-panel p-2 rounded-lg whitespace-nowrap text-[10px] font-bold text-on-surface shadow-xl border border-white/20 z-10">
                  {cam.label}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute top-4 left-4 glass-panel p-4 rounded-xl shadow-xl border border-white/40 max-w-[200px]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-secondary mb-3">Zone Classification</h3>
            <div className="space-y-2.5">
              {LEGEND.map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${l.color} shadow-sm`} />
                  <span className="text-xs font-medium text-on-surface-variant">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <div className="glass-panel p-1 rounded-lg shadow-xl flex flex-col border border-white/40">
              <Button className="p-2 hover:bg-surface-container-low rounded text-secondary transition-colors">
                <span className="material-symbols-outlined">add</span>
              </Button>
              <div className="h-px bg-outline-variant/30 mx-1" />
              <Button className="p-2 hover:bg-surface-container-low rounded text-secondary transition-colors">
                <span className="material-symbols-outlined">remove</span>
              </Button>
            </div>
            <Button className="glass-panel p-3 rounded-lg shadow-xl text-secondary border border-white/40 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">my_location</span>
            </Button>
          </div>
        </div>

        {/* Right detail panel */}
        {selectedZone && (
          <div className="w-full lg:w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="p-6 border-b border-outline-variant/20">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded uppercase tracking-wider">Selected Zone</span>
                <Button onClick={() => setSelectedZone(null)} className="text-secondary hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </Button>
              </div>
              <h2 className="text-xl font-bold text-on-surface">Zone C: Secure Vault</h2>
              <p className="text-on-surface-variant text-xs">Level 4 — Sector 12</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] uppercase font-bold text-secondary mb-1">Occupancy</p>
                  <p className="text-lg font-black text-on-surface">63/85</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] uppercase font-bold text-secondary mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-error" />
                    <p className="text-sm font-bold text-error">LOCKED</p>
                  </div>
                </div>
              </div>

              {/* Active identifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">Active Identifications</h3>
                <div className="space-y-2">
                  {IDENTIFICATIONS.map((p) => (
                    <div key={p.name} className="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-on-surface">{p.name}</p>
                        <p className="text-[10px] text-secondary">{p.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-primary">{p.match} Match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Camera feed thumbnail */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">Primary Surveillance</h3>
                <div className="relative group">
                  <div className="aspect-video bg-surface-container-lowest rounded-xl overflow-hidden relative border border-white/10">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-5xl">videocam</span>
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-bold text-white uppercase tracking-widest bg-black/40 px-1 rounded">LIVE</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <span className="material-symbols-outlined text-white text-3xl">fullscreen</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-2 text-center">CAM-12 - VAULT INTERIOR - 30 FPS</p>
                </div>
              </div>

              {/* Medical Locations */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-sm">local_hospital</span>
                  Medical Locations
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-error-container/30 rounded-lg">
                    <span className="material-symbols-outlined text-error text-lg">emergency</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">First Aid Station</p>
                      <p className="text-[10px] text-secondary">Room 4C-12 - Equipped</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-error-container/30 rounded-lg">
                    <span className="material-symbols-outlined text-error text-lg">medical_services</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">AED Defibrillator</p>
                      <p className="text-[10px] text-secondary">Corridor 4C - Wall Mount</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="p-4 bg-surface-container-high">
              <Button className="w-full py-2.5 bg-surface-container-high dark:bg-on-secondary-fixed text-on-surface dark:text-white font-bold text-xs rounded-lg hover:bg-surface-container dark:hover:opacity-90 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm">lock</span>
                Manual Lockdown
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
