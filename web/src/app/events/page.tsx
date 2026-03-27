"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { fetchEvents, fetchEventStats } from "@/lib/api";
import type { DetectionEvent, EventStats } from "@/lib/types";

export default function EventCenterPage() {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [personFilter, setPersonFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadEvents = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const params: Record<string, string> = { limit: "100" };
      if (typeFilter) params.type = typeFilter;
      if (personFilter) params.person = personFilter;
      const [e, s] = await Promise.all([fetchEvents(params), fetchEventStats()]);
      setEvents(e);
      setStats(s);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadEvents(true);
    const id = setInterval(() => loadEvents(false), 5000);
    return () => clearInterval(id);
  }, [typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadEvents(true);
  };

  return (
    <>
      <PageHeader title="Event Center" breadcrumb="Events" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Filters */}
        <div
          className="bg-white rounded-[5px] flex items-end gap-4 px-4 py-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div>
            <label className="text-xs block mb-1" style={{ color: "var(--color-secondary)" }}>
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border rounded-md text-sm px-3 py-2 focus:outline-none focus:border-[var(--color-primary)]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-body)" }}
            >
              <option value="">All Types</option>
              <option value="face_recognized">Recognized</option>
              <option value="unknown_face">Unknown</option>
            </select>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 items-end">
            <div>
              <label className="text-xs block mb-1" style={{ color: "var(--color-secondary)" }}>
                Person
              </label>
              <input
                type="text"
                placeholder="Search person..."
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
                className="bg-white border rounded-md text-sm px-3 py-2 w-48 focus:outline-none focus:border-[var(--color-primary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-body)" }}
              />
            </div>
            <button
              type="submit"
              className="text-white text-sm px-5 py-2 rounded-lg cursor-pointer font-semibold"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Summary */}
        {stats && (
          <div className="flex gap-6 text-sm">
            <span style={{ color: "var(--color-secondary)" }}>
              Total:{" "}
              <span className="font-bold" style={{ color: "var(--color-heading)" }}>
                {stats.total_events}
              </span>
            </span>
            <span style={{ color: "var(--color-secondary)" }}>
              Recognized:{" "}
              <span className="font-bold" style={{ color: "var(--color-success)" }}>
                {stats.today?.face_recognized ?? 0}
              </span>
            </span>
            <span style={{ color: "var(--color-secondary)" }}>
              Unknown:{" "}
              <span className="font-bold" style={{ color: "var(--color-danger)" }}>
                {stats.today?.unknown_face ?? 0}
              </span>
            </span>
            {stats.most_seen && (
              <span style={{ color: "var(--color-secondary)" }}>
                Most seen:{" "}
                <span className="font-bold" style={{ color: "var(--color-primary)" }}>
                  {stats.most_seen.person_name} ({stats.most_seen.count})
                </span>
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-[5px] overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-xs uppercase tracking-wider"
                style={{
                  color: "var(--color-muted)",
                  backgroundColor: "var(--color-bg)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <th className="text-left px-5 py-3 font-semibold">Time</th>
                <th className="text-left px-5 py-3 font-semibold w-12">Face</th>
                <th className="text-left px-5 py-3 font-semibold">Type</th>
                <th className="text-left px-5 py-3 font-semibold">Person</th>
                <th className="text-left px-5 py-3 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center" style={{ color: "var(--color-muted)" }}>
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center" style={{ color: "var(--color-muted)" }}>
                    No events found
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
                    {new Date(event.timestamp).toLocaleString("en-GB")}
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
                    {event.person_name || "—"}
                  </td>
                  <td className="px-5 py-2.5 font-mono" style={{ color: "var(--color-secondary)" }}>
                    {event.confidence != null ? `${Math.round(event.confidence * 100)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-xs" style={{ color: "var(--color-muted)" }}>
          Showing {events.length} events
        </div>
      </div>
    </>
  );
}
