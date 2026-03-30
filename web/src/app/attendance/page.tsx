"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "present" | "late" | "absent" | "not-yet";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: Status;
  time: string;
  timeLabel: string;
}

const EMPLOYEES: Employee[] = [
  { id: "1", name: "Marcus Sterling", role: "Lead Architect", status: "present", time: "08:42:15 AM", timeLabel: "Verified Entry" },
  { id: "2", name: "Sarah Chen", role: "Senior Designer", status: "late", time: "+14m 22s", timeLabel: "Tardy Offset" },
  { id: "3", name: "David Miller", role: "DevOps Engineer", status: "absent", time: "Sick Leave", timeLabel: "Reported Status" },
  { id: "4", name: "Elena Rossi", role: "HR Generalist", status: "not-yet", time: "09:30:00 AM", timeLabel: "Expected Arrival" },
  { id: "5", name: "Jonathan Wu", role: "CTO", status: "present", time: "07:55:12 AM", timeLabel: "Verified Entry" },
  { id: "6", name: "Maya Thompson", role: "Project Manager", status: "present", time: "08:58:33 AM", timeLabel: "Verified Entry" },
  { id: "7", name: "James O'Connor", role: "Lead Analyst", status: "absent", time: "Bereavement", timeLabel: "Reported Status" },
  { id: "8", name: "Priya Sharma", role: "QA Lead", status: "present", time: "08:30:00 AM", timeLabel: "Verified Entry" },
];

const FILTERS = ["All", "Present", "Late", "Absent"] as const;

const statusConfig: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  present: { label: "Present", bg: "bg-tertiary/10", text: "text-tertiary", dot: "bg-tertiary" },
  late: { label: "Late", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-600" },
  absent: { label: "Absent", bg: "bg-error-container/30", text: "text-error", dot: "bg-error" },
  "not-yet": { label: "Not Yet", bg: "bg-surface-container dark:bg-dark-surface-container", text: "text-secondary", dot: "bg-secondary/50" },
};

const statusIcon: Record<Status, string> = {
  present: "visibility",
  late: "history",
  absent: "mail",
  "not-yet": "notifications_active",
};

export default function TodayAttendancePage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [department, setDepartment] = useState("All Departments");

  const filtered = activeFilter === "All"
    ? EMPLOYEES
    : EMPLOYEES.filter((e) => e.status === activeFilter.toLowerCase().replace(" ", "-"));

  const presentCount = EMPLOYEES.filter((e) => e.status === "present").length;
  const lateCount = EMPLOYEES.filter((e) => e.status === "late").length;
  const absentCount = EMPLOYEES.filter((e) => e.status === "absent").length;
  const notYetCount = EMPLOYEES.filter((e) => e.status === "not-yet").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-12">
      {/* Page Header */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1">
              Surveillance Log
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-secondary-fixed dark:text-dark-on-surface">
              Today&apos;s Attendance
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-surface-container-high dark:bg-dark-surface-container-high text-primary rounded-xl text-sm font-semibold hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors">
              Export Report
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm align-middle mr-1">stream</span>
              Live Mode
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(27,28,29,0.08)] bg-outline-variant/10 dark:bg-dark-outline-variant/10">
          <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Present</p>
              <p className="text-2xl sm:text-3xl font-black text-tertiary">{presentCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Late</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600">{lateCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Absent</p>
              <p className="text-2xl sm:text-3xl font-black text-error">{absentCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-error-container/30 flex items-center justify-center text-error">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Not Yet</p>
              <p className="text-2xl sm:text-3xl font-black text-secondary">{notYetCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-high dark:bg-dark-surface-container-high flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 bg-surface-container-low dark:bg-dark-surface-container-low px-4 py-2 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-on-surface-variant dark:text-dark-on-surface-variant tracking-widest">Dept:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-transparent border-none text-sm font-semibold focus:ring-0 p-0 text-primary cursor-pointer"
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Creative Ops</option>
            <option>Human Capital</option>
          </select>
        </div>
        <div className="flex gap-2 p-1 bg-surface-container-low dark:bg-dark-surface-container-low rounded-xl">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeFilter === f
                  ? "bg-surface-container-lowest dark:bg-dark-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-on-surface-variant dark:text-dark-on-surface-variant text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          Live Updates Enabled
        </div>
      </section>

      {/* Employee Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {filtered.map((emp) => {
          const cfg = statusConfig[emp.status];
          return (
            <Link
              key={emp.id}
              href={`/attendance/${emp.id}`}
              className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-2xl shadow-[0_20px_50px_-12px_rgba(27,28,29,0.08)] hover:-translate-y-1 transition-transform duration-300 group block"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-xl bg-surface-container dark:bg-dark-surface-container flex items-center justify-center ${emp.status === "absent" || emp.status === "not-yet" ? "opacity-50" : ""}`}>
                  <span className="material-symbols-outlined text-3xl text-secondary">person</span>
                </div>
                <span className={`px-3 py-1 ${cfg.bg} ${cfg.text} text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-secondary-fixed dark:text-dark-on-surface leading-tight">
                  {emp.name}
                </h3>
                <p className="text-xs font-medium text-secondary uppercase tracking-widest mt-1">
                  {emp.role}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-surface-container dark:border-dark-surface-container flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-on-surface-variant/50 dark:text-dark-on-surface-variant/50 uppercase tracking-tighter">
                    {emp.timeLabel}
                  </p>
                  <p className={`text-xs font-mono font-bold ${
                    emp.status === "late" ? "text-amber-600" :
                    emp.status === "absent" ? "text-error" :
                    "text-on-surface-variant dark:text-dark-on-surface-variant"
                  }`}>
                    {emp.time}
                  </p>
                </div>
                <span className="text-primary hover:bg-primary-fixed p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-lg">{statusIcon[emp.status]}</span>
                </span>
              </div>
            </Link>
          );
        })}

        {/* Enroll Card */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-2xl border-2 border-dashed border-outline-variant/30 dark:border-dark-outline-variant/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low dark:hover:bg-dark-surface-container-low transition-colors min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-surface-container dark:bg-dark-surface-container flex items-center justify-center text-secondary mb-4">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <p className="text-sm font-bold text-secondary uppercase tracking-widest">Enroll Marker</p>
          <p className="text-[10px] text-secondary/60 mt-1">Add new biometric identity</p>
        </div>
      </section>
    </div>
  );
}
