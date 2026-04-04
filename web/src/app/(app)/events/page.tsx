"use client";

import { Button } from "@/components/ui/Button";

import { useMemo, useState } from "react";
import { useEvents, useEventStats } from "@/lib/queries";
import type { DetectionEvent, EventStats } from "@/lib/types";
import { Select } from "@/components/Select";

const DUMMY_EVENTS: DetectionEvent[] = [
  { id: 1, timestamp: new Date(Date.now() - 60000).toISOString(), event_type: "face_recognized", person_name: "Marcus Thompson", confidence: 0.994, bbox: null, thumbnail: null, frame_number: null },
  { id: 2, timestamp: new Date(Date.now() - 120000).toISOString(), event_type: "face_recognized", person_name: "Sarah Chen", confidence: 0.989, bbox: null, thumbnail: null, frame_number: null },
  { id: 3, timestamp: new Date(Date.now() - 180000).toISOString(), event_type: "unknown_face", person_name: null, confidence: null, bbox: null, thumbnail: null, frame_number: null },
  { id: 4, timestamp: new Date(Date.now() - 300000).toISOString(), event_type: "face_recognized", person_name: "David Park", confidence: 0.972, bbox: null, thumbnail: null, frame_number: null },
  { id: 5, timestamp: new Date(Date.now() - 420000).toISOString(), event_type: "face_recognized", person_name: "Aisha Rahman", confidence: 0.991, bbox: null, thumbnail: null, frame_number: null },
  { id: 6, timestamp: new Date(Date.now() - 600000).toISOString(), event_type: "unknown_face", person_name: null, confidence: null, bbox: null, thumbnail: null, frame_number: null },
  { id: 7, timestamp: new Date(Date.now() - 900000).toISOString(), event_type: "face_recognized", person_name: "Lisa Wong", confidence: 0.965, bbox: null, thumbnail: null, frame_number: null },
];

export default function EventCenterPage() {
  const [typeFilter, setTypeFilter] = useState("");
  const [personInput, setPersonInput] = useState("");
  const [personFilter, setPersonFilter] = useState("");

  const queryParams = useMemo(() => {
    const params: Record<string, string> = { limit: "100" };
    if (typeFilter) params.type = typeFilter;
    if (personFilter.trim()) params.person = personFilter.trim();
    return params;
  }, [typeFilter, personFilter]);

  const eventsQuery = useEvents(queryParams);
  const statsQuery = useEventStats();

  const loading = eventsQuery.isLoading || statsQuery.isLoading;
  const backendOnline = !eventsQuery.isError && !statsQuery.isError;
  const events = backendOnline ? (eventsQuery.data ?? []) : DUMMY_EVENTS;
  const stats: EventStats | null = backendOnline ? (statsQuery.data ?? null) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonFilter(personInput);
  };

  const displayEvents = backendOnline
    ? events
    : events.filter((e) => {
        if (typeFilter && e.event_type !== typeFilter) return false;
        if (personFilter && !(e.person_name || "").toLowerCase().includes(personFilter.toLowerCase())) return false;
        return true;
      });

  const totalEvents = stats?.total_events ?? displayEvents.length;
  const recognized = stats?.today?.face_recognized ?? displayEvents.filter((e) => e.event_type === "face_recognized").length;
  const unknown = stats?.today?.unknown_face ?? displayEvents.filter((e) => e.event_type === "unknown_face").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-surface min-h-full">
      {/* Page Header */}
      <div>
        <h2 className="sr-only">
          Access Logs
        </h2>
      </div>

      {/* Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-variant p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Total Events</p>
          <p className="text-2xl font-black text-on-surface mt-1">{totalEvents}</p>
        </div>
        <div className="bg-surface-variant p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Recognized</p>
          <p className="text-2xl font-black text-green-500 mt-1">{recognized}</p>
        </div>
        <div className="bg-surface-variant p-5 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Unknown</p>
          <p className="text-2xl font-black text-error mt-1">{unknown}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/10 p-5 flex flex-wrap items-end gap-4">
        <div>
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] block mb-2">
            Type
          </label>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "", label: "All Types" },
              { value: "face_recognized", label: "Recognized" },
              { value: "unknown_face", label: "Unknown" },
            ]}
          />
        </div>
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div>
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] block mb-2">
              Person
            </label>
            <input
              type="text"
              placeholder="Search person..."
              value={personInput}
              onChange={(e) => setPersonInput(e.target.value)}
              className="bg-surface-container-highest border-none rounded-lg text-sm px-4 py-2.5 w-56 focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>
          <Button
            type="submit"
            className="primary-gradient text-white text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/5 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
              <th className="text-left px-5 py-4 font-bold">Time</th>
              <th className="text-left px-5 py-4 font-bold w-12">Face</th>
              <th className="text-left px-5 py-4 font-bold">Type</th>
              <th className="text-left px-5 py-4 font-bold">Person</th>
              <th className="text-left px-5 py-4 font-bold">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-2xl mb-2 block">progress_activity</span>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && displayEvents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-on-surface-variant">
                  No events found
                </td>
              </tr>
            )}
            {!loading && displayEvents.map((event) => (
              <tr
                key={event.id}
                className={`border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors ${
                  event.event_type === "unknown_face" ? "bg-error/5" : ""
                }`}
              >
                <td className="px-5 py-3 font-mono text-xs text-on-surface-variant">
                  {new Date(event.timestamp).toLocaleString("en-GB")}
                </td>
                <td className="px-5 py-3">
                  {event.thumbnail ? (
                    <img
                      src={`data:image/jpeg;base64,${event.thumbnail}`}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover border border-outline-variant/20"
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      event.event_type === "face_recognized"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-error/10 border border-error/20"
                    }`}>
                      <span className={`material-symbols-outlined text-sm ${
                        event.event_type === "face_recognized" ? "text-primary" : "text-error"
                      }`}>
                        {event.event_type === "face_recognized" ? "person" : "person_off"}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${
                    event.event_type === "face_recognized"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-error/10 text-error"
                  }`}>
                    {event.event_type === "face_recognized" ? "Recognized" : "Unknown"}
                  </span>
                </td>
                <td className="px-5 py-3 font-bold text-on-surface">
                  {event.person_name || <span className="italic text-error">Unrecognized</span>}
                </td>
                <td className="px-5 py-3 font-mono text-on-surface-variant">
                  {event.confidence != null ? `${Math.round(event.confidence * 100)}%` : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="text-xs text-on-surface-variant">
        Showing {displayEvents.length} events
        {eventsQuery.isFetching && <span className="ml-2">(refreshing)</span>}
        {!backendOnline && <span className="ml-2 text-primary">(demo data)</span>}
      </div>
    </div>
  );
}
