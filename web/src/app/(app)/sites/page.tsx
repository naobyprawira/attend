"use client";

const SITE_STATS = [
  { label: "Total Sites", value: "42", icon: "domain", trend: "+3 this month", trendColor: "text-green-500", trendIcon: "trending_up" },
  { label: "Total Personnel", value: "1,894", icon: "group", trend: "Across all sites", trendColor: "text-primary-fixed-dim", trendIcon: "groups" },
  { label: "Monthly Traffic", value: "12.5k", icon: "swap_vert", trend: "+8.2% vs last month", trendColor: "text-green-500", trendIcon: "trending_up" },
];

const SITES = [
  { name: "Main HQ Campus", location: "San Francisco, CA", cameras: 24, personnel: 482, status: "Active", lastSync: "2 min ago" },
  { name: "East Wing Office", location: "New York, NY", cameras: 18, personnel: 315, status: "Active", lastSync: "5 min ago" },
  { name: "Research Lab Alpha", location: "Boston, MA", cameras: 12, personnel: 128, status: "Maintenance", lastSync: "1 hr ago" },
  { name: "Data Center Prime", location: "Austin, TX", cameras: 32, personnel: 94, status: "Active", lastSync: "1 min ago" },
  { name: "West Coast Hub", location: "Seattle, WA", cameras: 16, personnel: 267, status: "Active", lastSync: "3 min ago" },
  { name: "European Branch", location: "London, UK", cameras: 20, personnel: 198, status: "Active", lastSync: "8 min ago" },
  { name: "APAC Operations", location: "Singapore", cameras: 14, personnel: 156, status: "Active", lastSync: "4 min ago" },
  { name: "Manufacturing Plant", location: "Detroit, MI", cameras: 28, personnel: 254, status: "Maintenance", lastSync: "2 hr ago" },
];

const REGIONS = [
  { name: "North America", x: "22%", y: "35%", count: 18 },
  { name: "Europe", x: "48%", y: "28%", count: 8 },
  { name: "Asia Pacific", x: "75%", y: "40%", count: 12 },
  { name: "South America", x: "30%", y: "65%", count: 4 },
];

export default function SitesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">
          Global Node Network
        </h2>
        <p className="text-on-surface-variant mt-2 font-medium">
          Manage and monitor all surveillance sites across your organization.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SITE_STATS.map((stat) => (
          <div key={stat.label} className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-on-surface">{stat.value}</h3>
              <p className={`text-xs mt-2 flex items-center gap-1 ${stat.trendColor}`}>
                <span className="material-symbols-outlined text-sm">{stat.trendIcon}</span>
                {stat.trend}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[100px]">{stat.icon}</span>
            </div>
          </div>
        ))}

        {/* Uptime Donut */}
        <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-3 self-start">
            Uptime
          </p>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface-container-high"
                cx="50" cy="50" r="40" fill="transparent"
                stroke="currentColor" strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="40" fill="transparent"
                stroke="url(#uptimeGrad)" strokeWidth="8"
                strokeDasharray="251.2" strokeDashoffset="0.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="uptimeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#751859" }} />
                  <stop offset="100%" style={{ stopColor: "#923272" }} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-on-surface">99.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden">
        <div className="p-5 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-4">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
            All Sites
          </h4>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Search sites..."
                className="bg-surface-container-highest border-none rounded-lg text-sm pl-9 pr-4 py-2 focus:ring-2 focus:ring-primary/20 text-on-surface w-48"
              />
            </div>
            <button className="primary-gradient text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Site
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                <th className="text-left px-5 py-4 font-bold">Site Name</th>
                <th className="text-left px-5 py-4 font-bold">Location</th>
                <th className="text-left px-5 py-4 font-bold">Cameras</th>
                <th className="text-left px-5 py-4 font-bold">Personnel</th>
                <th className="text-left px-5 py-4 font-bold">Status</th>
                <th className="text-left px-5 py-4 font-bold">Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {SITES.map((site) => (
                <tr
                  key={site.name}
                  className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-on-surface">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">domain</span>
                      </div>
                      {site.name}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {site.location}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-on-surface">{site.cameras}</td>
                  <td className="px-5 py-4 font-mono text-on-surface">{site.personnel}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${
                      site.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-on-surface-variant">{site.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Map */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden p-4 sm:p-6 lg:p-8">
        <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-6">
          Distribution Map
        </h4>
        <div className="relative w-full aspect-[2.2/1] bg-surface-container-high rounded-xl overflow-hidden">
          {/* Simplified world map outline */}
          <svg className="w-full h-full" viewBox="0 0 1000 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Continents simplified */}
            <path d="M150,120 Q200,100 250,110 Q280,90 320,100 L340,130 Q330,160 300,170 Q270,200 240,190 L200,210 Q170,190 150,160 Z" className="fill-on-surface-variant/10" />
            <path d="M350,140 Q380,120 420,110 Q460,100 500,110 Q530,120 550,140 L560,180 Q540,220 500,230 Q460,240 420,230 L380,200 Q360,170 350,140 Z" className="fill-on-surface-variant/10" />
            <path d="M620,130 Q680,100 750,110 Q800,120 840,140 L860,180 Q850,220 820,250 Q780,270 740,260 L680,240 Q640,210 620,170 Z" className="fill-on-surface-variant/10" />
            <path d="M220,250 Q260,240 290,260 L310,300 Q300,340 270,350 Q240,340 220,310 Z" className="fill-on-surface-variant/10" />
            <path d="M720,300 Q760,290 800,300 L820,340 Q800,370 770,370 Q740,360 720,330 Z" className="fill-on-surface-variant/10" />
          </svg>

          {/* Region markers */}
          {REGIONS.map((region) => (
            <div
              key={region.name}
              className="absolute flex flex-col items-center"
              style={{ left: region.x, top: region.y, transform: "translate(-50%, -50%)" }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse">
                  <span className="text-xs font-black text-primary">{region.count}</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-on-surface-variant mt-1.5 whitespace-nowrap bg-surface-variant/80 px-2 py-0.5 rounded">
                {region.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
