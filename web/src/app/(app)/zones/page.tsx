"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy data                                                        */
/* ------------------------------------------------------------------ */

const STATS = [
  { icon: "security", label: "Total Monitored Zones", value: "24", badge: "ACTIVE", badgeBg: "bg-tertiary-fixed", badgeText: "text-tertiary", iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/30", iconColor: "text-primary" },
  { icon: "dangerous", label: "High Security Areas", value: "08", badge: null, iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "text-error" },
];

const ZONES = [
  { name: "Main Lobby North", sub: "Ground Floor - Section A", icon: "corporate_fare", security: "OPEN", securityColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", cameras: ["CAM-01", "CAM-02"], cameraExtra: "+3 more", groups: ["ALL", "VS"], status: "OPERATIONAL", statusOk: true },
  { name: "Data Center 01", sub: "Basement - Restricted", icon: "terminal", security: "HIGH SECURITY", securityColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", cameras: ["DC-CAM-01", "DC-CAM-02"], cameraExtra: null, groups: ["ADMIN", "IT"], status: "OPERATIONAL", statusOk: true },
  { name: "Executive Suite", sub: "Level 12 - West Wing", icon: "meeting_room", security: "RESTRICTED", securityColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", cameras: ["EXEC-04"], cameraExtra: null, groups: ["EXEC", "+2"], status: "MAINTENANCE", statusOk: false },
  { name: "Employee Lounge", sub: "Level 04 - Commons", icon: "restaurant", security: "OPEN", securityColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", cameras: ["LOUNGE-01"], cameraExtra: null, groups: ["STAFF"], status: "OPERATIONAL", statusOk: true },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ZoneManagementPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-surface dark:bg-dark-surface min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Surveillance Core</p>
          <h1 className="text-3xl font-black text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">Zone Architecture</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high dark:bg-dark-surface-container-high text-primary font-semibold rounded-lg hover:brightness-95 transition-all text-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter Zones
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-semibold rounded-lg hover:shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm">
            <span className="material-symbols-outlined text-lg">add</span>
            Create Zone
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 dark:border-dark-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2 ${s.iconBg} ${s.iconColor} rounded-lg`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </span>
              {s.badge && (
                <span className={`text-[10px] font-bold ${s.badgeText} px-2 py-0.5 ${s.badgeBg} rounded-full`}>{s.badge}</span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{s.label}</p>
            <h3 className="text-3xl font-bold text-on-surface dark:text-dark-on-surface">{s.value}</h3>
          </div>
        ))}

        {/* Compliance card (spans 2 cols) */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 dark:border-dark-outline-variant/10 col-span-1 sm:col-span-2 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">AI Scan Efficiency</p>
              <h3 className="text-3xl font-bold text-primary">99.8<span className="text-lg">%</span></h3>
            </div>
            <div className="w-full bg-slate-100 dark:bg-dark-surface-container-high h-1.5 rounded-full mt-4">
              <div className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full" style={{ width: "99.8%" }} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-slate-50 dark:text-dark-surface-container opacity-10 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[96px]">monitoring</span>
          </div>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 dark:border-dark-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low dark:bg-dark-surface-container-low border-b border-outline-variant/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Zone Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Security Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Live Cameras</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Allowed Groups</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {ZONES.map((z) => (
                <tr key={z.name} className="hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-surface-container-high dark:bg-dark-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{z.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface dark:text-dark-on-surface">{z.name}</p>
                        <p className="text-xs text-secondary">{z.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${z.securityColor}`}>{z.security}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {z.cameras.map((c) => (
                        <span key={c} className="px-2 py-0.5 bg-secondary-fixed dark:bg-dark-surface-container-high text-on-secondary-fixed dark:text-dark-on-surface text-[10px] font-bold rounded">{c}</span>
                      ))}
                      {z.cameraExtra && <span className="text-xs text-secondary font-medium">{z.cameraExtra}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex -space-x-2">
                      {z.groups.map((g) => (
                        <div key={g} className="h-6 w-6 rounded-full bg-primary-container text-white border-2 border-surface-container-lowest dark:border-dark-surface-container-lowest flex items-center justify-center text-[8px] font-bold">
                          {g}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {z.statusOk ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
                        <span className="text-xs font-semibold text-tertiary-container">{z.status}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-error">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        <span className="text-xs font-semibold">{z.status}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div className="px-6 py-4 bg-surface-container-low dark:bg-dark-surface-container-low flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">Showing 4 of 24 surveillance zones</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              className="px-3 py-1 bg-surface-container-lowest dark:bg-dark-surface-container-lowest text-xs font-bold rounded border border-outline-variant/10 text-secondary hover:bg-white dark:hover:bg-dark-surface-container transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-primary text-white text-xs font-bold rounded hover:brightness-110 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Zone Overlay */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden relative group h-64">
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-600 text-[120px]">map</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h4 className="text-xl font-black mb-2 tracking-tight">Real-time Zone Overlay</h4>
            <p className="text-sm text-slate-300 max-w-md">Access advanced telemetry and facial recognition heatmaps directly from the integrated floor plan module.</p>
            <button className="mt-4 text-xs font-bold uppercase tracking-widest text-primary-fixed-dim hover:text-white transition-colors flex items-center gap-2">
              Launch Floor Plan <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* AI Threat Detection */}
        <div className="bg-primary-container text-on-primary-container p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-4xl mb-4">bolt</span>
            <h4 className="text-xl font-bold mb-3">AI Threat Detection</h4>
            <p className="text-sm opacity-80 leading-relaxed">System-wide surveillance is currently operating at peak efficiency. No unauthorized access attempts detected in high-security zones within the last 72 hours.</p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold opacity-70">SYSTEM INTEGRITY</span>
              <span className="text-xs font-bold">100%</span>
            </div>
            <div className="w-full bg-white/20 h-1 rounded-full">
              <div className="bg-white h-full rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
