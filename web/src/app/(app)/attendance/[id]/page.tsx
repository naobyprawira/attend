"use client";

import { useState, use } from "react";

type DayStatus = "present" | "absent" | "late" | "overtime" | "weekend" | "empty";

interface DailyLog {
  day: number;
  month: string;
  weekday: string;
  session: string;
  duration: string;
  inTime: string;
  outTime: string;
  status: "OVERTIME" | "LATE ARRIVAL" | "ON TIME" | "ABSENT";
}

const PERSON = {
  name: "Alexander Vance",
  role: "Senior Systems Architect",
  employeeId: "AI-90210-V",
  department: "Infrastructure",
  confidence: 98.4,
  monthlyPresent: 22,
  monthlyTotal: 24,
  totalOvertime: 14.5,
};

const CALENDAR_DAYS: { day: number | null; status: DayStatus; timeIn?: string; timeOut?: string }[] = [
  // Row 1: Oct starts on Friday (4 empties + Fri, Sat, Sun)
  { day: null, status: "empty" }, { day: null, status: "empty" }, { day: null, status: "empty" }, { day: null, status: "empty" },
  { day: 1, status: "present", timeIn: "09:02", timeOut: "18:15" },
  { day: 2, status: "weekend" }, { day: 3, status: "weekend" },
  // Row 2
  { day: 4, status: "present", timeIn: "08:55", timeOut: "18:05" },
  { day: 5, status: "late", timeIn: "09:45", timeOut: "18:30" },
  { day: 6, status: "overtime", timeIn: "08:30", timeOut: "21:45" },
  { day: 7, status: "present", timeIn: "08:58", timeOut: "18:10" },
  { day: 8, status: "present", timeIn: "09:05", timeOut: "18:00" },
  { day: 9, status: "weekend" }, { day: 10, status: "weekend" },
  // Row 3
  { day: 11, status: "present", timeIn: "08:50", timeOut: "18:00" },
  { day: 12, status: "absent" },
  { day: 13, status: "present", timeIn: "09:00", timeOut: "18:10" },
  { day: 14, status: "present", timeIn: "08:55", timeOut: "18:05" },
  { day: 15, status: "present", timeIn: "09:01", timeOut: "18:00" },
  { day: 16, status: "weekend" }, { day: 17, status: "weekend" },
];

const DAILY_LOGS: DailyLog[] = [
  { day: 6, month: "OCT", weekday: "Friday", session: "Friday Session", duration: "13h 15m Total Duration", inTime: "08:30", outTime: "21:45", status: "OVERTIME" },
  { day: 5, month: "OCT", weekday: "Thursday", session: "Thursday Session", duration: "08h 45m Total Duration", inTime: "09:45", outTime: "18:30", status: "LATE ARRIVAL" },
  { day: 4, month: "OCT", weekday: "Wednesday", session: "Wednesday Session", duration: "09h 10m Total Duration", inTime: "08:55", outTime: "18:05", status: "ON TIME" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const statusColors: Record<DayStatus, string> = {
  present: "bg-tertiary-fixed-dim/20 border-t-2 border-tertiary",
  absent: "bg-error/5 border-t-2 border-error/50",
  late: "bg-amber-400/10 border-t-2 border-amber-500",
  overtime: "bg-primary-fixed-dim/20 border-t-2 border-primary",
  weekend: "bg-surface-container-low border-t-2 border-outline-variant/50",
  empty: "bg-surface-container-low/30",
};

const statusTextColor: Record<DayStatus, string> = {
  present: "text-on-tertiary-fixed-variant",
  late: "text-amber-700",
  overtime: "text-on-primary-fixed-variant",
  absent: "text-error",
  weekend: "text-secondary",
  empty: "",
};

const badgeStyles: Record<string, string> = {
  "OVERTIME": "bg-primary-fixed text-on-primary-fixed",
  "LATE ARRIVAL": "bg-amber-100 text-amber-800",
  "ON TIME": "bg-tertiary-fixed text-on-tertiary-fixed",
  "ABSENT": "bg-error-container text-on-error-container",
};

export default function IndividualAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [currentMonth] = useState("October 2023");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-on-surface-variant font-medium text-sm">
        <span className="material-symbols-outlined mr-2 text-primary">person_search</span>
        Person Detail: {PERSON.name}
        <span className="ml-2 text-xs text-secondary">(ID: {id})</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left: Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl bg-surface-container flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-6xl text-secondary">person</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest flex items-center">
                  <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  ACTIVE
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                  {PERSON.name}
                </h2>
                <p className="text-on-surface-variant font-medium">
                  {PERSON.role}
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface-variant/40">
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Employee ID</span>
                <span className="text-sm font-semibold text-on-surface">{PERSON.employeeId}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-variant/40">
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Department</span>
                <span className="text-sm font-semibold text-on-surface">{PERSON.department}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Confidence Score</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-tertiary mr-2">{PERSON.confidence}%</span>
                  <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-tertiary to-tertiary-fixed"
                      style={{ width: `${PERSON.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg font-bold text-sm tracking-wide uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
              Export Observation Report
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Monthly Present</p>
              <p className="text-2xl font-bold text-primary">
                {PERSON.monthlyPresent}{" "}
                <span className="text-xs text-on-surface-variant font-normal">/ {PERSON.monthlyTotal}</span>
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Total Overtime</p>
              <p className="text-2xl font-bold text-tertiary-container">
                {PERSON.totalOvertime}{" "}
                <span className="text-xs text-on-surface-variant font-normal">hrs</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Calendar + Logs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calendar */}
          <div className="bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-on-surface">Attendance Log</h3>
                <p className="text-sm text-on-surface-variant">October 2023 Visual Grid</p>
              </div>
              <div className="flex items-center space-x-2 bg-surface-container-low p-1 rounded-lg">
                <button className="p-2 hover:bg-surface-container-lowest rounded-md transition-all">
                  <span className="material-symbols-outlined text-secondary">chevron_left</span>
                </button>
                <span className="px-4 text-sm font-bold tracking-widest uppercase">{currentMonth}</span>
                <button className="p-2 hover:bg-surface-container-lowest rounded-md transition-all">
                  <span className="material-symbols-outlined text-secondary">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 text-[10px] font-bold tracking-widest text-secondary uppercase">
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim mr-2" /> Present</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-error/60 mr-2" /> Absent</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-2" /> Late</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-fixed-dim mr-2" /> Overtime</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Weekday Headers */}
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-on-surface-variant mb-2 sm:mb-4 uppercase">
                  {d}
                </div>
              ))}

              {/* Day Cells */}
              {CALENDAR_DAYS.map((cell, i) => (
                <div
                  key={i}
                  className={`h-16 sm:h-20 lg:h-24 rounded-lg p-2 sm:p-3 transition-all ${statusColors[cell.status]} ${
                    cell.status !== "empty" && cell.status !== "weekend" ? "hover:scale-[1.03] cursor-pointer" : ""
                  }`}
                >
                  {cell.day && (
                    <>
                      <span className={`text-xs font-bold ${cell.status === "weekend" ? "text-secondary" : "text-on-surface"}`}>
                        {cell.day}
                      </span>
                      {cell.status === "absent" && (
                        <div className="mt-1 sm:mt-2 text-[8px] font-bold text-error uppercase">ABSENT</div>
                      )}
                      {cell.timeIn && cell.timeOut && cell.status !== "weekend" && (
                        <div className={`mt-1 sm:mt-2 text-[8px] font-medium ${statusTextColor[cell.status]} hidden sm:block`}>
                          {cell.timeIn} - {cell.timeOut}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Logs */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 sm:px-8 py-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h4 className="text-sm font-bold tracking-tight uppercase text-on-surface">
                Detailed Daily Logs
              </h4>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                Showing: Oct 1 - Oct 15
              </span>
            </div>

            <div className="divide-y divide-surface-container">
              {DAILY_LOGS.map((log) => (
                <div
                  key={log.day}
                  className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-low flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-secondary">{log.month}</span>
                      <span className="text-lg font-bold leading-none text-on-surface">{String(log.day).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{log.session}</p>
                      <div className="flex items-center text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mt-1">
                        <span className="material-symbols-outlined text-xs mr-1">schedule</span>
                        {log.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 ml-16 sm:ml-0">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">In / Out</p>
                      <p className="text-sm font-mono font-bold text-on-surface">
                        {log.inTime} <span className="text-on-surface-variant font-normal px-2">&rarr;</span> {log.outTime}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest whitespace-nowrap ${badgeStyles[log.status]}`}>
                      {log.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-surface-container-low text-center">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all">
                Load Full History Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
