"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy data                                                         */
/* ------------------------------------------------------------------ */

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const BAR_HEIGHTS = [
  { main: "h-32", remote: "h-16" },
  { main: "h-40", remote: "h-24" },
  { main: "h-36", remote: "h-20" },
  { main: "h-48", remote: "h-32" },
  { main: "h-44", remote: "h-28" },
  { main: "h-16 opacity-30", remote: "h-8 opacity-20" },
  { main: "h-12 opacity-30", remote: "h-4 opacity-20" },
];

const DEPARTMENTS = [
  { name: "Engineering", pct: 12 },
  { name: "Marketing", pct: 24 },
  { name: "Product Design", pct: 8 },
  { name: "Data Science", pct: 15 },
];

const INSIGHTS = [
  {
    icon: "trending_up",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Peak Attendance",
    desc: "Attendance peaks on Tuesdays at 09:45 AM system-wide.",
  },
  {
    icon: "warning",
    iconBg: "bg-error/10",
    iconColor: "text-error",
    title: "Lateness Alert",
    desc: "Marketing dept. shows a 4% increase in lateness this week.",
  },
  {
    icon: "psychology",
    iconBg: "bg-tertiary-container/10",
    iconColor: "text-tertiary-container",
    title: "AI Forecast",
    desc: "98% confidence score that attendance will remain stable through Friday.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const [dateRange] = useState("Oct 01, 2023 - Oct 31, 2023");

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface dark:text-dark-on-surface">
              Attendance Analytics
            </h1>
            <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-sm mt-1">
              Surveillance metrics and behavioral intelligence across all sectors.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-surface-container-lowest dark:bg-dark-surface-container-lowest border border-outline-variant/20 dark:border-dark-outline-variant/20 rounded-lg px-3 py-2 gap-2 text-sm font-medium shadow-sm">
              <span className="material-symbols-outlined text-primary text-sm">
                calendar_month
              </span>
              <span className="whitespace-nowrap">{dateRange}</span>
              <span className="material-symbols-outlined text-secondary text-sm">
                expand_more
              </span>
            </div>
            <button className="flex items-center gap-2 bg-surface-container-high dark:bg-dark-surface-container-high hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest transition-colors px-4 py-2 rounded-lg text-primary font-semibold text-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Top: Attendance Rate Over Time */}
          <section className="col-span-1 sm:col-span-2 lg:col-span-12 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-primary">
                  Intelligence Feed
                </span>
                <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mt-1">
                  Attendance Rate Over Time
                </h2>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-semibold text-secondary">Main Office</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                  <span className="text-xs font-semibold text-secondary">Remote Hub</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-1 relative pt-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-8">
                <div className="border-t border-secondary"></div>
                <div className="border-t border-secondary"></div>
                <div className="border-t border-secondary"></div>
                <div className="border-t border-secondary"></div>
              </div>
              {/* Bars */}
              <div className="flex-1 flex items-end justify-between px-2 h-full pb-8">
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className="group/bar flex flex-col items-center gap-1 w-full max-w-[40px] relative"
                  >
                    <div
                      className={`w-full bg-primary/20 rounded-t-sm ${BAR_HEIGHTS[i].main} group-hover/bar:bg-primary/40 transition-colors`}
                    ></div>
                    <div
                      className={`w-full bg-primary rounded-t-sm ${BAR_HEIGHTS[i].remote} absolute bottom-8 opacity-40`}
                    ></div>
                    <span className="text-[10px] text-secondary font-bold">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Left: Late Frequency by Department */}
          <section className="col-span-1 lg:col-span-7 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-secondary">
                Late Frequency by Department
              </h2>
              <span className="material-symbols-outlined text-secondary opacity-40">
                more_vert
              </span>
            </div>
            <div className="space-y-6">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface dark:text-dark-on-surface">
                      {dept.name}
                    </span>
                    <span className="text-xs font-semibold text-primary">{dept.pct}% Late</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-low dark:bg-dark-surface-container-low rounded-full flex overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${dept.pct}%` }}></div>
                    <div
                      className="h-full bg-primary-container/30"
                      style={{ width: `${100 - dept.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Right: Status Distribution */}
          <section className="col-span-1 lg:col-span-5 bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl p-4 sm:p-6 flex flex-col">
            <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-secondary mb-6">
              Status Distribution
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              {/* SVG Donut Chart */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    className="text-surface-container-low dark:text-dark-surface-container-low"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#751859"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#99d76c"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="210"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-on-surface dark:text-dark-on-surface">
                    92%
                  </span>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    Efficiency
                  </span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface-container-low dark:bg-dark-surface-container-low rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-on-surface dark:text-dark-on-surface">
                      Present
                    </span>
                  </div>
                  <span className="text-xl font-bold">842</span>
                </div>
                <div className="p-3 bg-surface-container-low dark:bg-dark-surface-container-low rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="text-xs font-bold text-on-surface dark:text-dark-on-surface">
                      Remote
                    </span>
                  </div>
                  <span className="text-xl font-bold">156</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Insight Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSIGHTS.map((ins) => (
            <div
              key={ins.title}
              className="bg-surface-container-low dark:bg-dark-surface-container-low border border-outline-variant/10 dark:border-dark-outline-variant/10 p-6 rounded-xl flex items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-full ${ins.iconBg} flex items-center justify-center shrink-0`}
              >
                <span className={`material-symbols-outlined ${ins.iconColor}`}>
                  {ins.icon}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface dark:text-dark-on-surface">
                  {ins.title}
                </h4>
                <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                  {ins.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
