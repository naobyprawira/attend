"use client";

const SITE_PERFORMANCE = [
  { name: "Main HQ Campus", value: 94, identifications: 3248 },
  { name: "East Wing Office", value: 88, identifications: 2815 },
  { name: "Research Lab Alpha", value: 72, identifications: 1642 },
  { name: "Data Center Prime", value: 96, identifications: 2190 },
  { name: "West Coast Hub", value: 82, identifications: 1876 },
  { name: "European Branch", value: 78, identifications: 1534 },
  { name: "APAC Operations", value: 85, identifications: 1497 },
];

const FEED_ENTRIES = [
  { time: "10:42 AM", site: "Main HQ", event: "Unauthorized access attempt detected at Gate B", severity: "error" },
  { time: "10:38 AM", site: "East Wing", event: "Cross-site personnel match: David Park identified at secondary location", severity: "warning" },
  { time: "10:35 AM", site: "Data Center", event: "New personnel registered via cross-site sync", severity: "info" },
  { time: "10:30 AM", site: "West Coast", event: "Recognition model updated across 4 nodes", severity: "info" },
  { time: "10:24 AM", site: "APAC Ops", event: "Shift change synchronization completed", severity: "info" },
  { time: "10:18 AM", site: "European", event: "High-confidence match flagged for review", severity: "warning" },
];

const SITE_CIRCLES = [
  { name: "HQ Campus", pct: 68, color: "#751859" },
  { name: "East Wing", pct: 72, color: "#923272" },
  { name: "Data Center", pct: 91, color: "#751859" },
];

export default function CrossSitePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface dark:bg-dark-surface min-h-full">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-extrabold text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">
          Cross-Site Intelligence
        </h2>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-2 font-medium">
          Unified intelligence across all connected surveillance nodes.
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Large Stat */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-2">
            Total Identifications
          </p>
          <h3 className="text-5xl font-black text-on-surface dark:text-dark-on-surface">14,802</h3>
          <p className="text-xs mt-2 flex items-center gap-1 text-green-500">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +1.2K vs last period
          </p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">fingerprint</span>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-2">
            Cross-Site Accuracy
          </p>
          <h3 className="text-4xl font-black text-on-surface dark:text-dark-on-surface">98.4%</h3>
          <div className="w-full h-1.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: "98.4%" }} />
          </div>
          <p className="text-xs mt-2 text-on-surface-variant dark:text-dark-on-surface-variant">Match confidence threshold</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">verified</span>
          </div>
        </div>

        {/* Connected Sites */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-2">
            Connected Sites
          </p>
          <h3 className="text-4xl font-black text-on-surface dark:text-dark-on-surface">
            10 <span className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant font-medium">/ 18</span>
          </h3>
          <p className="text-xs mt-2 flex items-center gap-1 text-primary-fixed-dim">
            <span className="material-symbols-outlined text-sm">link</span>
            8 pending sync
          </p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">hub</span>
          </div>
        </div>
      </div>

      {/* Performance + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Performance Comparison */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/5">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-6">
            Site Performance Comparison
          </h4>
          <div className="space-y-4">
            {SITE_PERFORMANCE.map((site) => (
              <div key={site.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface dark:text-dark-on-surface font-medium">{site.name}</span>
                  <span className="text-on-surface-variant dark:text-dark-on-surface-variant font-mono">{site.identifications.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000"
                    style={{ width: `${site.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unified Intelligence Feed */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/10 dark:border-dark-outline-variant/10 flex justify-between items-center">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
              Unified Intelligence Feed
            </h4>
            <span className="text-[10px] bg-primary/20 text-primary-fixed-dim px-2 py-1 rounded font-bold">LIVE</span>
          </div>
          <div className="divide-y divide-outline-variant/5 dark:divide-dark-outline-variant/5 flex-1 overflow-y-auto">
            {FEED_ENTRIES.map((entry, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  entry.severity === "error" ? "bg-error" : entry.severity === "warning" ? "bg-yellow-500" : "bg-green-500"
                }`} />
                <div className="min-w-0">
                  <p className="text-xs text-on-surface dark:text-dark-on-surface font-medium">{entry.event}</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                    {entry.site} &bull; {entry.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Circular Progress Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {SITE_CIRCLES.map((site) => (
          <div key={site.name} className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-high dark:text-dark-surface-container-high"
                  cx="50" cy="50" r="40" fill="transparent"
                  stroke="currentColor" strokeWidth="6"
                />
                <circle
                  cx="50" cy="50" r="40" fill="transparent"
                  stroke={site.color} strokeWidth="6"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * site.pct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-on-surface dark:text-dark-on-surface">{site.pct}%</span>
              </div>
            </div>
            <p className="text-xs font-bold text-on-surface dark:text-dark-on-surface mt-3">{site.name}</p>
            <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest mt-0.5">Sync Rate</p>
          </div>
        ))}
      </div>
    </div>
  );
}
