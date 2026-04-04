"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy Data                                                         */
/* ------------------------------------------------------------------ */

interface DeptRow {
  name: string;
  color: string;
  headcount: number;
  presentRate: number;
  avgHours: number;
  exceptions: number;
  grade: string;
}

const STATS = [
  {
    label: "Compliance",
    value: "94.2",
    unit: "%",
    trend: "+2.4%",
    trendUp: true,
    icon: "verified",
    iconColor: "text-emerald-500",
  },
  {
    label: "Avg Hours",
    value: "4.8",
    unit: "hr",
    trend: "+0.3",
    trendUp: true,
    icon: "schedule",
    iconColor: "text-amber-500",
  },
  {
    label: "Flagged",
    value: "24",
    unit: "",
    trend: "-3",
    trendUp: false,
    icon: "flag",
    iconColor: "text-error",
  },
  {
    label: "Grade",
    value: "A+",
    unit: "",
    trend: "",
    trendUp: true,
    icon: "emoji_events",
    iconColor: "text-primary",
  },
];

const DEPARTMENTS: DeptRow[] = [
  {
    name: "Engineering",
    color: "bg-primary",
    headcount: 48,
    presentRate: 96.2,
    avgHours: 5.1,
    exceptions: 6,
    grade: "A+",
  },
  {
    name: "Product Design",
    color: "bg-tertiary",
    headcount: 24,
    presentRate: 93.8,
    avgHours: 4.7,
    exceptions: 8,
    grade: "A",
  },
  {
    name: "Marketing",
    color: "bg-amber-500",
    headcount: 32,
    presentRate: 91.4,
    avgHours: 4.5,
    exceptions: 5,
    grade: "B+",
  },
  {
    name: "Human Resources",
    color: "bg-emerald-500",
    headcount: 16,
    presentRate: 97.1,
    avgHours: 4.9,
    exceptions: 5,
    grade: "A+",
  },
];

const INSIGHTS = [
  "Engineering maintains the most consistent department-wide attendance at 96.2%, with minimal exceptions relative to headcount.",
  "Product Design shows a slight dip in average hours (4.7h) likely correlated with the current sprint cycle wind-down period.",
  "Marketing flagged 5 exceptions this period, down from 9 last month -- indicating improved schedule adherence after policy refresh.",
  "HR leads in present rate (97.1%) setting the organizational benchmark for attendance compliance.",
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DepartmentSummaryPage() {
  const [departments] = useState(DEPARTMENTS);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
          <span className="font-medium opacity-60">Surveillance Intelligence</span>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-on-surface">
              Department Summary
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Q4 Monthly Compliance &middot; October 2023
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
            Export PDF
          </button>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </span>
                <span className={`material-symbols-outlined text-base ${stat.iconColor}`}>
                  {stat.icon}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-on-surface">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-base font-bold text-on-surface-variant">
                    {stat.unit}
                  </span>
                )}
              </div>
              {stat.trend && (
                <p
                  className={`text-[11px] font-semibold mt-1 ${
                    stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-error"
                  }`}
                >
                  {stat.trend} from last period
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Table & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-outline-variant/10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Balance Performance Metrics
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-outline-variant/10">
                      <th className="px-4 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Department
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">
                        Headcount
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Present Rate
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">
                        Avg Hours
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">
                        Exceptions
                      </th>
                      <th className="px-4 sm:px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr
                        key={dept.name}
                        className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="px-4 sm:px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${dept.color}`}
                            ></span>
                            <span className="text-sm font-bold text-on-surface">
                              {dept.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-semibold text-on-surface">
                            {dept.headcount}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${dept.presentRate}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-on-surface w-12 text-right">
                              {dept.presentRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-semibold text-on-surface">
                            {dept.avgHours}h
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-error/10 text-error text-sm font-bold">
                            {dept.exceptions}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-10 h-8 rounded-lg text-sm font-black ${
                              dept.grade === "A+"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : dept.grade === "A"
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {dept.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observational Summary */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Observational Summary
                </h2>
              </div>
              <div className="space-y-3">
                {INSIGHTS.map((insight, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-on-surface-variant"
                  >
                    {insight}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-outline-variant/10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs text-primary">insights</span>
                  Attendance Byline
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs text-primary">query_stats</span>
                  AI Overlay (84%)
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar Card */}
          <div className="space-y-6">
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-lg">tune</span>
                <h3 className="text-sm font-bold text-on-surface">
                  Optimize Operations Shift Buffer
                </h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Based on current compliance metrics, consider adjusting the shift buffer
                window by 15 minutes to reduce late-arrival exceptions across departments
                with sub-95% present rates.
              </p>
              <div className="flex items-center gap-3">
                <button className="bg-primary hover:brightness-110 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-primary/20">
                  Apply Recommendation
                </button>
                <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">
                  Dismiss
                </button>
              </div>
            </div>

            {/* Mini stats */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Quick Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">
                    Total Employees
                  </span>
                  <span className="text-sm font-black text-on-surface">
                    120
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">
                    Active Today
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    112
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">
                    On Leave
                  </span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
