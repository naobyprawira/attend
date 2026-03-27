"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { fetchStatus, fetchEvents, fetchEventStats } from "@/lib/api";
import type { ServerStatus, DetectionEvent, EventStats } from "@/lib/types";

function StatCard({
  label,
  subtitle,
  value,
  icon,
  trend,
}: {
  label: string;
  subtitle: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-[5px] p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <p className="text-lg font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <span style={{ color: "var(--color-primary)" }}>{label}</span>
        <span className="text-sm ml-1" style={{ color: "var(--color-muted)" }}>
          | {subtitle}
        </span>
      </p>
      <div className="flex items-center gap-4 mt-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          <span style={{ color: "var(--color-primary)" }}>{icon}</span>
        </div>
        <div>
          <p
            className="text-[28px] font-bold"
            style={{ fontFamily: "'Nunito', sans-serif", color: "var(--color-primary)" }}
          >
            {value}
          </p>
          {trend && (
            <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, e, st] = await Promise.all([
          fetchStatus(),
          fetchEvents({ limit: "10" }),
          fetchEventStats(),
        ]);
        setStatus(s);
        setEvents(e);
        setStats(st);
      } catch {}
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const cameraStatus = status?.camera_connected ? "Online" : "Offline";

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Camera"
            subtitle="Status"
            value={cameraStatus}
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            }
            trend={status ? `${status.viewer_count} viewer(s)` : undefined}
          />
          <StatCard
            label="Events"
            subtitle="Today"
            value={stats?.total_events ?? 0}
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
          />
          <StatCard
            label="Recognized"
            subtitle="Today"
            value={stats?.today?.face_recognized ?? 0}
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
          <StatCard
            label="Unknown"
            subtitle="Today"
            value={stats?.today?.unknown_face ?? 0}
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
          />
        </div>

        {/* Recent events table */}
        <div className="bg-white rounded-[5px]" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <p className="text-lg font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span style={{ color: "var(--color-primary)" }}>Recent Events</span>
              <span className="text-sm ml-1" style={{ color: "var(--color-muted)" }}>
                | Latest
              </span>
            </p>
            <a
              href="/events"
              className="text-xs font-semibold hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              View All
            </a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-xs uppercase tracking-wider border-b"
                style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}
              >
                <th className="text-left px-5 py-2.5 font-semibold">Time</th>
                <th className="text-left px-5 py-2.5 font-semibold w-12">Face</th>
                <th className="text-left px-5 py-2.5 font-semibold">Type</th>
                <th className="text-left px-5 py-2.5 font-semibold">Person</th>
                <th className="text-left px-5 py-2.5 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center" style={{ color: "var(--color-muted)" }}>
                    No events yet
                  </td>
                </tr>
              )}
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b hover:bg-[var(--color-bg)] transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="px-5 py-2.5 font-mono text-xs" style={{ color: "var(--color-secondary)" }}>
                    {new Date(event.timestamp).toLocaleTimeString("en-GB")}
                  </td>
                  <td className="px-5 py-2.5">
                    {event.thumbnail ? (
                      <img
                        src={`data:image/jpeg;base64,${event.thumbnail}`}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                        style={{ border: "1px solid var(--color-border)" }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}
                      />
                    )}
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-semibold"
                      style={
                        event.event_type === "face_recognized"
                          ? { backgroundColor: "#d1fae5", color: "var(--color-success)" }
                          : { backgroundColor: "#fee2e2", color: "var(--color-danger)" }
                      }
                    >
                      {event.event_type === "face_recognized" ? "RECOGNIZED" : "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-5 py-2.5" style={{ color: "var(--color-heading)" }}>
                    {event.person_name || "Unknown person"}
                  </td>
                  <td className="px-5 py-2.5 font-mono" style={{ color: "var(--color-secondary)" }}>
                    {event.confidence != null ? `${Math.round(event.confidence * 100)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* System info */}
        {status && (
          <div className="flex gap-6 text-xs font-mono" style={{ color: "var(--color-muted)" }}>
            <span>Uptime: {Math.floor(status.uptime / 60)}m</span>
            <span>Frames: {status.total_frames.toLocaleString()}</span>
            <span>Viewers: {status.viewer_count}</span>
            <span>Total Faces: {status.faces_detected_total}</span>
          </div>
        )}
      </div>
    </>
  );
}
