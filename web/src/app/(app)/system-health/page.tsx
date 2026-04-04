"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

/* ── Gauge data ── */
const GAUGES = [
  { label: "Processing Load", value: 75, unit: "%", color: "#751859", sub: "Avg. Neural Processing Load" },
  { label: "GPU VRAM", value: 32, unit: "%", color: "#923272", sub: "128 / 400MB Allocated" },
  { label: "YOLO FPS", value: 91, unit: "%", color: "#751859", sub: "Target: 60FPS+ Real-time" },
  { label: "Storage", value: 50, unit: "%", color: "#923272", sub: "112 GB Free of 256 GB" },
];

/* ── Server nodes ── */
const NODES = [
  {
    name: "SRV-ALPHA-01",
    status: "Operational",
    statusColor: "text-green-400",
    ip: "10.0.1.12",
    uptime: "47d 12h",
    cpu: 34,
    ram: 62,
    image: "Main Inference Node",
  },
  {
    name: "SRV-BETA-02",
    status: "Operational",
    statusColor: "text-green-400",
    ip: "10.0.1.15",
    uptime: "23d 8h",
    cpu: 58,
    ram: 71,
    image: "Edge Processing Unit",
  },
  {
    name: "SRV-GAMMA-03",
    status: "Degraded",
    statusColor: "text-amber-400",
    ip: "10.0.1.22",
    uptime: "5d 3h",
    cpu: 89,
    ram: 94,
    image: "Backup Redundancy",
  },
  {
    name: "SRV-DELTA-04",
    status: "Operational",
    statusColor: "text-green-400",
    ip: "10.0.2.10",
    uptime: "61d 0h",
    cpu: 12,
    ram: 38,
    image: "Storage Gateway",
  },
];

/* ── Latency regions ── */
const REGIONS = [
  { name: "NA-East", latency: "12ms", status: "good" },
  { name: "NA-West", latency: "18ms", status: "good" },
  { name: "EU-Central", latency: "45ms", status: "good" },
  { name: "APAC-South", latency: "92ms", status: "warn" },
  { name: "APAC-East", latency: "78ms", status: "good" },
  { name: "SA-East", latency: "110ms", status: "warn" },
];

/* ── Circular Gauge SVG component ── */
function CircularGauge({
  value,
  label,
  sub,
  color,
}: {
  value: number;
  label: string;
  sub: string;
  color: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-surface-container-highest"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-on-surface">
            {value}
            <span className="text-sm">%</span>
          </span>
        </div>
      </div>
      <p className="text-sm font-bold text-on-surface mt-3">
        {label}
      </p>
      <p className="text-[10px] text-on-surface-variant mt-0.5 text-center">
        {sub}
      </p>
    </div>
  );
}

export default function SystemHealthPage() {
  const [reportGenerating, setReportGenerating] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => setReportGenerating(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Page Header */}
      <div>
        <h2 className="sr-only">
          Core Telemetry
        </h2>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
        {GAUGES.map((g) => (
          <CircularGauge
            key={g.label}
            value={g.value}
            label={g.label}
            sub={g.sub}
            color={g.color}
          />
        ))}
      </div>

      {/* Surveillance Node Health */}
      <div>
        <h3 className="text-lg font-bold text-on-surface mb-4 tracking-tight">
          Surveillance Node Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NODES.map((node) => (
            <div
              key={node.name}
              className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/5"
            >
              {/* Image placeholder */}
              <div className="h-28 bg-surface-container-high relative flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/35">
                  dns
                </span>
                <div className="absolute bottom-2 left-3 text-[9px] text-on-surface-variant/60 font-mono">
                  {node.image}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-on-surface">
                    {node.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold ${node.statusColor}`}
                  >
                    {node.status}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant font-mono">
                  {node.ip} &bull; Up {node.uptime}
                </p>
                {/* Mini bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[9px] text-on-surface-variant mb-1">
                      <span>CPU</span>
                      <span>{node.cpu}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${node.cpu}%`,
                          backgroundColor:
                            node.cpu > 80 ? "#ef4444" : "#751859",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-on-surface-variant mb-1">
                      <span>RAM</span>
                      <span>{node.ram}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${node.ram}%`,
                          backgroundColor:
                            node.ram > 90 ? "#ef4444" : "#923272",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Latency Map + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map section */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
          <h3 className="text-lg font-bold text-on-surface mb-2 tracking-tight">
            Global Latency Map
          </h3>
          <p className="text-xs text-on-surface-variant mb-6">
            Node-to-node latency, measuring end-to-end processing roundtrip. Cooled
            regions indicate nominal operation levels.
          </p>

          {/* World map placeholder */}
          <div className="relative w-full h-48 sm:h-64 bg-surface-container rounded-xl flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/35">
              public
            </span>
            {/* Latency dots */}
            <div className="absolute top-8 left-[20%] w-3 h-3 bg-green-400 rounded-full animate-pulse" title="NA-East" />
            <div className="absolute top-12 left-[12%] w-3 h-3 bg-green-400 rounded-full animate-pulse" title="NA-West" />
            <div className="absolute top-6 left-[48%] w-3 h-3 bg-green-400 rounded-full animate-pulse" title="EU-Central" />
            <div className="absolute top-[55%] left-[70%] w-3 h-3 bg-amber-400 rounded-full animate-pulse" title="APAC-South" />
            <div className="absolute top-[30%] left-[78%] w-3 h-3 bg-green-400 rounded-full animate-pulse" title="APAC-East" />
            <div className="absolute top-[65%] left-[30%] w-3 h-3 bg-amber-400 rounded-full animate-pulse" title="SA-East" />
          </div>

          {/* Region table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-on-surface-variant border-b border-outline-variant/10">
                  <th className="pb-2 font-bold">Region</th>
                  <th className="pb-2 font-bold">Latency</th>
                  <th className="pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {REGIONS.map((r) => (
                  <tr
                    key={r.name}
                    className="border-b border-outline-variant/5 text-on-surface"
                  >
                    <td className="py-2 font-medium">{r.name}</td>
                    <td className="py-2 font-mono">{r.latency}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                          r.status === "good"
                            ? "text-green-500"
                            : "text-amber-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.status === "good"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {r.status === "good" ? "Nominal" : "Elevated"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Network Overview
            </h4>
            <div>
              <p className="text-2xl font-extrabold text-primary">4</p>
              <p className="text-[10px] text-on-surface-variant">
                Active Nodes
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-on-surface">
                99.7%
              </p>
              <p className="text-[10px] text-on-surface-variant">
                Fleet Uptime (30d)
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-on-surface">
                2.1M
              </p>
              <p className="text-[10px] text-on-surface-variant">
                Frames Processed Today
              </p>
            </div>
          </div>

          {/* Generate Report */}
          <Button
            onClick={handleGenerateReport}
            disabled={reportGenerating}
            className="w-full primary-gradient text-white px-5 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 text-sm"
          >
            <span className="material-symbols-outlined text-sm">
              {reportGenerating ? "hourglass_top" : "description"}
            </span>
            {reportGenerating ? "Generating..." : "Export Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
