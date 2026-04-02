"use client";

import { useStatus, useEvents, useEventStats } from "@/lib/queries";

// Dummy data for when backend is offline
const DUMMY_ACTIVITY = [
  { id: 1, name: "Marcus Thompson", dept: "Engineering", time: "10:42:15 AM", confidence: 99.4, status: "authorized" as const },
  { id: 2, name: "Sarah Chen", dept: "Product", time: "10:41:02 AM", confidence: 98.9, status: "authorized" as const },
  { id: 3, name: null, dept: "Main Lobby", time: "10:38:44 AM", confidence: 0, status: "flagged" as const },
  { id: 4, name: "David Park", dept: "Marketing", time: "10:35:20 AM", confidence: 97.2, status: "authorized" as const },
  { id: 5, name: "Aisha Rahman", dept: "Engineering", time: "10:32:11 AM", confidence: 99.1, status: "authorized" as const },
];

const DUMMY_FEEDS = [
  { id: "001-LBY", name: "Main Lobby", color: "red" as const },
  { id: "004-ENG", name: "Eng Floor", color: "red" as const },
  { id: "009-CNF", name: "Conf. A", color: "green" as const },
];

const DEPARTMENTS = [
  { name: "Engineering", count: 142, pct: 85 },
  { name: "Product Design", count: 48, pct: 40 },
  { name: "Marketing & Sales", count: 92, pct: 65 },
];

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const BAR_HEIGHTS = [40, 60, 80, 70, 90, 50, 100];
const BAR_FILLS = [60, 80, 70, 95, 85, 40, 100];

export default function DashboardPage() {
  const { data: status } = useStatus();
  const { data: events = [] } = useEvents({ limit: "10" });
  const { data: stats } = useEventStats();

  const backendOnline = !!status;
  const totalScans = backendOnline ? (stats?.total_events ?? 0) : 12842;
  const activeZones = backendOnline ? (status?.viewer_count ?? 0) : 24;
  const avgConfidence = 98.2;
  const unrecognized = backendOnline ? (stats?.today?.unknown_face ?? 0) : 14;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface dark:bg-dark-surface min-h-full">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Scans"
          value={totalScans.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          trend="+12% vs last week"
          trendColor="text-green-500"
          trendIcon="trending_up"
          bgIcon="face"
        />
        <StatCard
          label="Active Zones"
          value={String(activeZones)}
          trend="Operational"
          trendColor="text-primary-fixed-dim"
          trendIcon="check_circle"
          bgIcon="grid_view"
        />
        <StatCard
          label="Avg Confidence"
          value={`${avgConfidence}%`}
          progressPct={avgConfidence}
          bgIcon="verified"
        />
        <StatCard
          label="Unrecognized"
          value={String(unrecognized)}
          trend="Requires Review"
          trendColor="text-error"
          trendIcon="warning"
          bgIcon="person_off"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Charts */}
        <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Donut Chart */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/5 flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-8 self-start">
              Daily Attendance Rate
            </h4>
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-surface-container-high dark:text-dark-surface-container-high"
                  cx="128" cy="128" r="110" fill="transparent"
                  stroke="currentColor" strokeWidth="20"
                />
                <circle
                  cx="128" cy="128" r="110" fill="transparent"
                  stroke="url(#plumGradient)" strokeWidth="20"
                  strokeDasharray="691" strokeDashoffset="110"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="plumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#751859" }} />
                    <stop offset="100%" style={{ stopColor: "#923272" }} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-on-surface dark:text-dark-on-surface">84%</span>
                <span className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest mt-1">
                  Present Today
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 w-full mt-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <p className="text-xs text-on-surface dark:text-dark-on-surface font-bold">482</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">Present</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-surface-container-high dark:bg-dark-surface-container-high" />
                <div>
                  <p className="text-xs text-on-surface dark:text-dark-on-surface font-bold">92</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">Absent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/5 flex flex-col">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
              7-Day Peak Trends
            </h4>
            <div className="flex-1 flex items-end gap-2 px-2 pb-4 mt-8">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-surface-container-high dark:bg-dark-surface-container-high rounded-t-lg relative group"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className={`absolute inset-x-0 bottom-0 bg-primary group-hover:bg-primary-container transition-all rounded-t-lg ${
                      i === 6 ? "ai-pulse bg-primary-container" : ""
                    }`}
                    style={{ height: `${BAR_FILLS[i]}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant font-medium">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Department Occupancy */}
          <div className="col-span-1 md:col-span-2 bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/5">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
                Department Occupancy
              </h4>
              <span className="text-[10px] bg-primary/20 text-primary-fixed-dim px-2 py-1 rounded">
                Real-time
              </span>
            </div>
            <div className="space-y-6">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between text-xs text-on-surface dark:text-dark-on-surface">
                    <span className="font-medium">{dept.name}</span>
                    <span className="font-bold">{dept.count} people</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${dept.pct}%`, opacity: dept.pct > 60 ? 1 : dept.pct > 30 ? 0.7 : 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Camera Feeds */}
        <div className="col-span-1 lg:col-span-4 bg-surface-variant dark:bg-dark-surface-variant p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
              Live Feeds
            </h4>
            <div className="flex gap-2">
              <button className="p-1 hover:text-primary transition-colors text-on-surface-variant dark:text-dark-on-surface-variant">
                <span className="material-symbols-outlined text-sm">fullscreen</span>
              </button>
              <button className="p-1 hover:text-primary transition-colors text-on-surface-variant dark:text-dark-on-surface-variant">
                <span className="material-symbols-outlined text-sm">more_vert</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 flex-1">
            {DUMMY_FEEDS.map((feed) => (
              <div key={feed.id} className="relative rounded-xl overflow-hidden aspect-video border border-outline-variant/10 group bg-dark-surface-container-lowest">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/20 text-6xl">videocam</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${feed.color === "red" ? "bg-red-600 animate-pulse" : "bg-green-600"}`} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
                    {feed.name}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-[10px] text-white/70">Cam ID: {feed.id}</p>
                </div>
                <div className="absolute inset-0 border-2 border-primary/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Stream */}
      <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
            Live Activity Stream
          </h4>
          <a href="/events" className="text-primary font-bold text-xs hover:underline">
            View Full Logs
          </a>
        </div>
        <div className="divide-y divide-outline-variant/5 dark:divide-dark-outline-variant/5">
          {(backendOnline ? events.slice(0, 5) : []).map((event) => (
            <ActivityRow
              key={event.id}
              name={event.person_name}
              dept={event.event_type === "face_recognized" ? "Recognized" : "Unknown"}
              time={new Date(event.timestamp).toLocaleTimeString("en-US")}
              confidence={event.confidence ? Math.round(event.confidence * 100) : 0}
              status={event.event_type === "face_recognized" ? "authorized" : "flagged"}
            />
          ))}
          {!backendOnline &&
            DUMMY_ACTIVITY.map((item) => (
              <ActivityRow
                key={item.id}
                name={item.name}
                dept={item.dept}
                time={item.time}
                confidence={item.confidence}
                status={item.status}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendColor,
  trendIcon,
  bgIcon,
  progressPct,
}: {
  label: string;
  value: string;
  trend?: string;
  trendColor?: string;
  trendIcon?: string;
  bgIcon: string;
  progressPct?: number;
}) {
  return (
    <div className="bg-surface-variant dark:bg-dark-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-2">
          {label}
        </p>
        <h3 className="text-3xl font-black text-on-surface dark:text-dark-on-surface">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trendColor}`}>
            {trendIcon && <span className="material-symbols-outlined text-sm">{trendIcon}</span>}
            {trend}
          </p>
        )}
        {progressPct != null && (
          <div className="w-full h-1 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <span className="material-symbols-outlined text-[100px]">{bgIcon}</span>
      </div>
    </div>
  );
}

function ActivityRow({
  name,
  dept,
  time,
  confidence,
  status,
}: {
  name: string | null;
  dept: string;
  time: string;
  confidence: number;
  status: "authorized" | "flagged";
}) {
  const isFlagged = status === "flagged";

  return (
    <div className={`p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors group ${isFlagged ? "bg-error/5" : ""}`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center ${
          isFlagged
            ? "border border-error/50 bg-error/20"
            : "border border-primary/20 bg-primary/10"
        }`}>
          <span className={`material-symbols-outlined ${isFlagged ? "text-error" : "text-primary"}`}>
            {isFlagged ? "person_search" : "person"}
          </span>
        </div>
        <div>
          <h5 className={`text-sm font-bold text-on-surface dark:text-dark-on-surface ${isFlagged ? "italic" : ""}`}>
            {name || "Unrecognized Entity"}
          </h5>
          <p className={`text-[10px] uppercase ${isFlagged ? "text-error font-bold" : "text-on-surface-variant dark:text-dark-on-surface-variant"}`}>
            {dept} &bull; {time}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="text-right">
          <p className={`text-xs font-bold ${isFlagged ? "text-error" : "text-primary-fixed-dim"}`}>
            {isFlagged ? "No Match" : `${confidence.toFixed(1)}% Match`}
          </p>
          <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase">Confidence</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          isFlagged
            ? "bg-error text-white"
            : "bg-green-500/10 text-green-500"
        }`}>
          {status === "authorized" ? "Authorized" : "Flagged"}
        </div>
      </div>
    </div>
  );
}
