"use client";

const INCIDENTS = [
  { title: "Site Delta Latency Spike", time: "10:42 AM", severity: "warning", detail: "Latency exceeded 50ms threshold for 3 minutes" },
  { title: "Node 07 Reconnected", time: "10:18 AM", severity: "info", detail: "Auto-recovery successful after 12s downtime" },
  { title: "Certificate Renewal", time: "09:55 AM", severity: "info", detail: "TLS certificates renewed for 4 endpoints" },
];

const NODES = [
  { id: "entry", label: "Entry Gate", x: 120, y: 100, type: "secondary" },
  { id: "db", label: "DB Gateway", x: 120, y: 280, type: "secondary" },
  { id: "hq", label: "Main HQ Server", x: 350, y: 190, type: "primary" },
  { id: "conf", label: "Conference", x: 580, y: 100, type: "secondary" },
  { id: "parking", label: "Parking", x: 580, y: 280, type: "secondary" },
];

const CONNECTIONS = [
  { from: "entry", to: "hq" },
  { from: "db", to: "hq" },
  { from: "hq", to: "conf" },
  { from: "hq", to: "parking" },
  { from: "entry", to: "conf" },
  { from: "db", to: "parking" },
];

function getNodePos(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export default function NetworkPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface dark:bg-dark-surface min-h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-4xl font-extrabold text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">
          Network Topology Viewer
        </h2>
        <span className="flex items-center gap-1.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Active
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Network Uptime" value="99.8%" icon="uptime" />
        <StatBox label="Active Nodes" value="14" icon="hub" />
        <StatBox label="Connections" value="248" icon="cable" />
        <StatBox label="Avg Latency" value="12ms" icon="speed" />
      </div>

      {/* Main Content: Topology + Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Diagram */}
        <div className="lg:col-span-2 bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/5 p-4 sm:p-6 lg:p-8">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-6">
            Live Infrastructure Map
          </h4>
          <div className="relative w-full" style={{ minHeight: 380 }}>
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 700 380" fill="none">
              {CONNECTIONS.map((conn, i) => {
                const from = getNodePos(conn.from);
                const to = getNodePos(conn.to);
                return (
                  <line
                    key={i}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    className="stroke-outline-variant/30 dark:stroke-dark-outline-variant/30"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                );
              })}
            </svg>
            {NODES.map((node) => (
              <div
                key={node.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${(node.x / 700) * 100}%`, top: `${(node.y / 380) * 100}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                  node.type === "primary"
                    ? "bg-gradient-to-br from-primary to-primary-container text-white"
                    : "bg-surface-container-highest dark:bg-dark-surface-container-highest text-on-surface dark:text-dark-on-surface border border-outline-variant/20"
                }`}>
                  <span className="material-symbols-outlined">
                    {node.id === "hq" ? "dns" : node.id === "entry" ? "door_front" : node.id === "db" ? "database" : node.id === "conf" ? "meeting_room" : "local_parking"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-on-surface dark:text-dark-on-surface mt-2 whitespace-nowrap">
                  {node.label}
                </span>
                <span className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[9px] text-green-500 font-medium">Online</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Report */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/10 dark:border-dark-outline-variant/10">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
              Incident Report
            </h4>
          </div>
          <div className="divide-y divide-outline-variant/5 dark:divide-dark-outline-variant/5 flex-1">
            {INCIDENTS.map((inc, i) => (
              <div key={i} className="px-5 py-4 hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`material-symbols-outlined text-sm ${
                    inc.severity === "warning" ? "text-yellow-500" : "text-green-500"
                  }`}>
                    {inc.severity === "warning" ? "warning" : "info"}
                  </span>
                  <h5 className="text-sm font-bold text-on-surface dark:text-dark-on-surface">{inc.title}</h5>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant ml-6">{inc.detail}</p>
                <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-1.5 ml-6">{inc.time}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-outline-variant/10 dark:border-dark-outline-variant/10">
            <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">history</span>
              View All Incidents
            </button>
          </div>
        </div>
      </div>

      {/* Network Synchronization Status */}
      <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant">
            Network Synchronization Status
          </h4>
          <span className="text-[10px] bg-green-500/10 text-green-500 font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Synced
          </span>
        </div>
        <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
          Syncing model updates and configuration changes across all connected nodes. Last full sync 4 minutes ago.
        </p>
        <div className="w-full h-3 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000" style={{ width: "100%" }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">
          <span>14 / 14 nodes synced</span>
          <span>100% complete</span>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-surface-variant dark:bg-dark-surface-variant p-5 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
      <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-on-surface dark:text-dark-on-surface">{value}</h3>
      <div className="absolute -right-3 -bottom-3 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <span className="material-symbols-outlined text-[72px]">{icon}</span>
      </div>
    </div>
  );
}
