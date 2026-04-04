"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";
import { Select } from "@/components/Select";

/* ------------------------------------------------------------------ */
/*  Types & Dummy Data                                                 */
/* ------------------------------------------------------------------ */

const TABS = [
  "Monthly Summary",
  "Daily Detail",
  "Exception Report",
  "Overtime Report",
  "Department Summary",
] as const;

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Product Design",
  "Marketing",
  "Human Resources",
];

const FEATURE_TAGS = [
  { icon: "hub", label: "Automated Data Mapping" },
  { icon: "sync", label: "Real-time Cross-referencing" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [dateFrom] = useState("Oct 01, 2023");
  const [dateTo] = useState("Oct 31, 2023");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [personSearch, setPersonSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="sr-only">
              Reports
            </h1>
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-sm text-on-surface placeholder:text-on-surface-variant/75 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </header>

        {/* Tab Bar */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 min-w-max">
            {TABS.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              Date Range
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-lg">
                calendar_today
              </span>
              <span className="text-sm text-on-surface font-medium">
                {dateFrom} &ndash; {dateTo}
              </span>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant text-lg">
                expand_more
              </span>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              Department
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg z-10 pointer-events-none">
                apartment
              </span>
              <Select
                value={department}
                onChange={setDepartment}
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Person Search */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              Person Search
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                person_search
              </span>
              <input
                type="text"
                placeholder="Name or ID..."
                value={personSearch}
                onChange={(e) => setPersonSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-sm text-on-surface placeholder:text-on-surface-variant/75 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Generate Row */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Button className="bg-primary hover:brightness-110 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all shadow-lg shadow-primary/20">
            Generate
          </Button>
          <div className="flex items-center gap-1">
            <Button className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                picture_as_pdf
              </span>
            </Button>
            <Button className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                grid_on
              </span>
            </Button>
            <Button className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                mail
              </span>
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-on-surface-variant/75 text-3xl">
              bar_chart
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-on-surface mb-2">
            Ready to compile
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FEATURE_TAGS.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-primary text-sm">
                  {tag.icon}
                </span>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {/* Last Generated */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Last Generated
            </span>
            <h3 className="text-xl font-black text-on-surface mt-1">
              Weekly Audit
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Compiled 2h ago
            </p>
          </div>

          {/* Scheduled Tasks */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Scheduled Tasks
            </span>
            <h3 className="text-xl font-black text-on-surface mt-1">
              04 Active
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Next run at 00:00 AM
            </p>
          </div>

          {/* Storage Usage */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Storage Usage
            </span>
            <h3 className="text-xl font-black text-primary mt-1">84.2 GB</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              82% archive efficiency
            </p>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Button className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container shadow-xl shadow-primary/20 flex items-center justify-center hover:brightness-110 transition-all z-30">
        <span className="material-symbols-outlined text-2xl">add</span>
      </Button>
    </div>
  );
}
