"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy Data                                                         */
/* ------------------------------------------------------------------ */

const FILTER_PILLS = [
  { label: "Critical", color: "bg-error/10 text-error border-error/20" },
  { label: "Access Violation", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { label: "Late Arrival", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "Early Departure", color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
  { label: "Unauthorized Zone", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

const REPORT_NAV = [
  { icon: "summarize", label: "Reports", active: false },
  { icon: "warning", label: "Exception Report", active: true },
];

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Product Design",
  "Marketing",
  "Human Resources",
];

interface ExceptionCard {
  id: string;
  name: string;
  department: string;
  initials: string;
  avatar: string;
  violationType: string;
  violationColor: string;
  date: string;
  time: string;
  description: string;
  status: "pending" | "resolved" | "escalated";
}

const EXCEPTIONS: ExceptionCard[] = [
  {
    id: "EXC-001",
    name: "Marcus Thorne",
    department: "Engineering",
    initials: "MT",
    avatar: "",
    violationType: "Access Violation",
    violationColor: "bg-amber-500/10 text-amber-600",
    date: "Oct 15, 2023",
    time: "09:42 AM",
    description: "Attempted access to restricted server room without proper clearance badge during non-scheduled hours.",
    status: "pending",
  },
  {
    id: "EXC-002",
    name: "Elena Vance",
    department: "Product Design",
    initials: "EV",
    avatar: "",
    violationType: "Critical",
    violationColor: "bg-error/10 text-error",
    date: "Oct 14, 2023",
    time: "02:18 PM",
    description: "Multiple failed biometric authentication attempts at main entrance. Security protocol triggered after 3rd attempt.",
    status: "escalated",
  },
  {
    id: "EXC-003",
    name: "Raj Patel",
    department: "Engineering",
    initials: "RP",
    avatar: "",
    violationType: "Late Arrival",
    violationColor: "bg-primary/10 text-primary",
    date: "Oct 13, 2023",
    time: "10:15 AM",
    description: "Arrived 75 minutes past scheduled shift start. Third occurrence this month -- pattern flagged for review.",
    status: "pending",
  },
  {
    id: "EXC-004",
    name: "Mei-Lin Zhou",
    department: "Marketing",
    initials: "MZ",
    avatar: "",
    violationType: "Early Departure",
    violationColor: "bg-tertiary/10 text-tertiary",
    date: "Oct 12, 2023",
    time: "03:30 PM",
    description: "Left premises 2.5 hours before scheduled end-of-shift without prior manager approval on record.",
    status: "resolved",
  },
];

const BOTTOM_STATS = [
  {
    icon: "warning",
    iconColor: "text-error",
    value: "24",
    label: "Total Exceptions",
    sub: "This period",
  },
  {
    icon: "schedule",
    iconColor: "text-amber-500",
    value: "12.8h",
    label: "Avg Resolution",
    sub: "- 4.2h improvement",
  },
  {
    icon: "pending_actions",
    iconColor: "text-primary",
    value: "08",
    label: "Pending Review",
    sub: "Requires attention",
  },
  {
    icon: "check_circle",
    iconColor: "text-emerald-500",
    value: "94%",
    label: "Resolution Rate",
    sub: "+6% from last period",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ExceptionReportPage() {
  const [activePills, setActivePills] = useState<Set<string>>(new Set());
  const [department, setDepartment] = useState(DEPARTMENTS[0]);

  const togglePill = (label: string) => {
    setActivePills((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const statusBadge = (status: ExceptionCard["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-600";
      case "escalated":
        return "bg-error/10 text-error";
      case "resolved":
        return "bg-emerald-500/10 text-emerald-600";
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="sr-only">
                Exception Report
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-xs font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Oct 01 &ndash; Oct 31, 2023
              </div>
              <Button className="flex items-center gap-2 bg-primary hover:brightness-110 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                Export PDF
              </Button>
              <Button className="bg-primary-container hover:brightness-110 text-on-primary-container px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/10">
                Generate PDF
              </Button>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Left Nav Sidebar */}
          <aside className="hidden lg:block">
            <nav className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-3 space-y-1">
              {REPORT_NAV.map((item) => (
                <Button
                  key={item.label}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_PILLS.map((pill) => (
                <Button
                  key={pill.label}
                  onClick={() => togglePill(pill.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activePills.has(pill.label)
                      ? pill.color + " ring-2 ring-primary/30"
                      : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:border-outline-variant/40"
                  }`}
                >
                  {pill.label}
                </Button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="pl-3 pr-8 py-1.5 rounded-lg bg-surface-container border border-outline-variant/20 text-xs font-semibold text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
                <Button className="bg-primary hover:brightness-110 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                  Apply Filter
                </Button>
              </div>
            </div>

            {/* Exception Cards */}
            <div className="space-y-4">
              {EXCEPTIONS.map((exc) => (
                <div
                  key={exc.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-4 sm:p-5 hover:border-outline-variant/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-bold">
                        {exc.initials}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-on-surface">
                            {exc.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            {exc.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${exc.violationColor}`}
                          >
                            {exc.violationType}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${statusBadge(exc.status)}`}
                          >
                            {exc.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                        {exc.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {exc.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {exc.time}
                          </span>
                          <span className="text-on-surface-variant/75">
                            {exc.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">
                              visibility
                            </span>
                          </Button>
                          <Button className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">
                              edit
                            </span>
                          </Button>
                          <Button className="p-1.5 rounded-lg hover:bg-error/10 transition-colors">
                            <span className="material-symbols-outlined text-error text-lg">
                              flag
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {BOTTOM_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`material-symbols-outlined text-base ${stat.iconColor}`}>
                      {stat.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-on-surface">
                    {stat.value}
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
