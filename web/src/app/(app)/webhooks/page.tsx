"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

const ENDPOINTS = [
  { name: "Production SIEM", url: "https://siem.corp.io/webhooks/attend", events: ["face_recognized", "alert"], status: true, lastTriggered: "2 min ago" },
  { name: "Slack Alerts", url: "https://hooks.slack.com/services/T0...", events: ["alert"], status: true, lastTriggered: "18 min ago" },
  { name: "Local Backup", url: "https://192.168.1.50/api/v1/webhooks/in", events: ["face_recognized", "unknown_face", "sync"], status: false, lastTriggered: "2 hrs ago" },
];

const DELIVERY_LOG = [
  { id: "evt_9842a1", endpoint: "Production SIEM", status: 200, time: "10:42:15 AM", duration: "124ms" },
  { id: "evt_9841f3", endpoint: "Slack Alerts", status: 200, time: "10:38:02 AM", duration: "89ms" },
  { id: "evt_9840b2", endpoint: "Production SIEM", status: 200, time: "10:35:44 AM", duration: "112ms" },
  { id: "evt_983fc1", endpoint: "Local Backup", status: 408, time: "10:30:20 AM", duration: "5002ms" },
  { id: "evt_983ea4", endpoint: "Production SIEM", status: 200, time: "10:24:11 AM", duration: "98ms" },
];

const TRAFFIC_BARS = [65, 82, 74, 90, 68, 95, 88];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WebhooksPage() {
  const [activeEndpoints, setActiveEndpoints] = useState(ENDPOINTS);
  const [currentPage] = useState(1);

  const toggleStatus = (index: number) => {
    setActiveEndpoints((prev) =>
      prev.map((ep, i) => (i === index ? { ...ep, status: !ep.status } : ep))
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="sr-only">
            Webhook Management
          </h2>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            type="text"
            placeholder="Search webhooks..."
            className="bg-surface-container-highest border-none rounded-lg text-sm pl-9 pr-4 py-2 focus:ring-2 focus:ring-primary/20 text-on-surface w-56"
          />
        </div>
      </div>

      {/* Top Row: Traffic Stat + Config Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic */}
        <div className="lg:col-span-2 bg-surface-variant p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2">
            Total Webhook Traffic
          </p>
          <h3 className="text-4xl font-black text-on-surface">124.8k</h3>
          <p className="text-xs text-on-surface-variant mt-1">Deliveries this period</p>
          <div className="flex items-end gap-2 mt-6 h-20">
            {TRAFFIC_BARS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-md transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-on-surface-variant">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-fixed-dim">settings</span>
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Configuration</h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Define custom intelligence endpoints for your infrastructure.
            </p>
          </div>
          <Button className="mt-6 w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 tracking-widest uppercase hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            Create Webhook
          </Button>
        </div>
      </div>

      {/* Active Endpoints */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden">
        <div className="p-5 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-4">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
            Active Endpoints
          </h4>
          <Button className="text-xs text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                <th className="text-left px-5 py-4 font-bold">Webhook Name</th>
                <th className="text-left px-5 py-4 font-bold">URL</th>
                <th className="text-left px-5 py-4 font-bold">Event Types</th>
                <th className="text-left px-5 py-4 font-bold">Status</th>
                <th className="text-left px-5 py-4 font-bold">Last Triggered</th>
              </tr>
            </thead>
            <tbody>
              {activeEndpoints.map((ep, i) => (
                <tr key={ep.name} className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                  <td className="px-5 py-4 font-bold text-on-surface">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">webhook</span>
                      {ep.name}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-on-surface-variant max-w-[200px] truncate">
                    {ep.url}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {ep.events.map((evt) => (
                        <span key={evt} className="text-[9px] px-2 py-0.5 rounded bg-primary/10 text-primary-fixed-dim font-bold uppercase tracking-wider">
                          {evt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      onClick={() => toggleStatus(i)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        ep.status ? "bg-green-500" : "bg-surface-container-high"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        ep.status ? "translate-x-5" : "translate-x-0.5"
                      }`} />
                    </Button>
                  </td>
                  <td className="px-5 py-4 text-xs text-on-surface-variant">{ep.lastTriggered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Delivery History */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden">
        <div className="p-5 border-b border-outline-variant/10">
          <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
            Recent Delivery History
          </h4>
        </div>
        <div className="divide-y divide-outline-variant/5">
          {DELIVERY_LOG.map((log) => (
            <div key={log.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                  log.status === 200 ? "bg-green-500/10 text-green-500" : "bg-error/10 text-error"
                }`}>
                  {log.status}
                </span>
                <div>
                  <p className="text-xs font-bold text-on-surface">{log.endpoint}</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">{log.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <span>{log.duration}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant/10 flex flex-wrap justify-between items-center gap-3">
          <p className="text-[10px] text-on-surface-variant">
            Showing 5 of 12 webhooks
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">Page {currentPage} of 4</span>
            <Button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </Button>
            <Button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
