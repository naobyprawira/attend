"use client";

import { useState } from "react";

interface Shift {
  id: string;
  name: string;
  type: "Normal" | "Flexible";
  checkIn: string;
  checkOut: string;
  grace: string;
  threshold: string;
}

const SHIFTS: Shift[] = [
  { id: "1", name: "Morning Intelligence A", type: "Normal", checkIn: "08:00 AM", checkOut: "05:00 PM", grace: "15 min", threshold: "45h / week" },
  { id: "2", name: "Standard Surveillance", type: "Normal", checkIn: "08:00 AM", checkOut: "05:00 PM", grace: "15 min", threshold: "40h / week" },
  { id: "3", name: "Night Watch Operatives", type: "Flexible", checkIn: "10:00 PM", checkOut: "06:00 AM", grace: "30 min", threshold: "38h / week" },
  { id: "4", name: "Administrative Support", type: "Normal", checkIn: "09:00 AM", checkOut: "06:00 PM", grace: "10 min", threshold: "40h / week" },
];

export default function ShiftManagementPage() {
  const [expandedId, setExpandedId] = useState<string>("2");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 lg:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Resource Allocation</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-secondary-fixed dark:text-dark-on-surface mt-1">
            Shift Management
          </h2>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-2 max-w-lg text-sm">
            Define and oversee temporal operational frameworks. High-precision surveillance requires rigorous schedule enforcement.
          </p>
        </div>
        <button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-lg font-bold text-sm tracking-wide shadow-lg shadow-primary/20 flex items-center space-x-2 active:scale-95 duration-150 transition-all self-start sm:self-auto">
          <span className="material-symbols-outlined text-sm">add</span>
          <span>CREATE SHIFT</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Active Shifts */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 dark:border-dark-outline-variant/10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Active Shifts</span>
            <span className="material-symbols-outlined text-primary">bolt</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tighter text-on-surface dark:text-dark-on-surface">14</span>
            <span className="text-xs text-on-tertiary-fixed-variant ml-2">+2 from last week</span>
          </div>
        </div>

        {/* Grace Compliance */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 dark:border-dark-outline-variant/10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Grace Compliance</span>
            <span className="material-symbols-outlined text-primary">verified_user</span>
          </div>
          <div className="mt-4 flex items-end">
            <span className="text-3xl font-black tracking-tighter text-on-surface dark:text-dark-on-surface">98.2%</span>
            <div className="ml-4 flex-1 h-1.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-primary to-primary-fixed-dim" style={{ width: "98%" }} />
            </div>
          </div>
        </div>

        {/* Overtime Hours */}
        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 dark:border-dark-outline-variant/10 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Overtime Hours</span>
            <span className="material-symbols-outlined text-primary">history</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tighter text-on-surface dark:text-dark-on-surface">124.5h</span>
            <span className="text-xs text-error ml-2">High threshold alert</span>
          </div>
        </div>
      </div>

      {/* Shift Table */}
      <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(27,28,29,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low dark:bg-dark-surface-container-low">
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase">Shift Name</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase">Type</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase text-center">Check-In</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase text-center">Check-Out</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase text-center">Grace</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase text-center">Threshold</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant tracking-[0.15em] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 dark:divide-dark-outline-variant/10">
              {SHIFTS.map((shift) => (
                <>
                  <tr
                    key={shift.id}
                    className={`group transition-colors ${
                      expandedId === shift.id
                        ? "bg-surface-container/30 dark:bg-dark-surface-container/30"
                        : "hover:bg-surface-container dark:hover:bg-dark-surface-container"
                    }`}
                  >
                    <td className="px-4 sm:px-8 py-6 font-bold text-on-secondary-fixed dark:text-dark-on-surface">
                      <div className="flex items-center space-x-2">
                        <span>{shift.name}</span>
                        {expandedId === shift.id && (
                          <span className="material-symbols-outlined text-primary text-sm">unfold_less</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <span className={`font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase ${
                        shift.type === "Flexible"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed"
                          : "bg-secondary-container text-primary"
                      }`}>
                        {shift.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-6 text-center text-on-surface-variant dark:text-dark-on-surface-variant font-medium">{shift.checkIn}</td>
                    <td className="px-4 sm:px-8 py-6 text-center text-on-surface-variant dark:text-dark-on-surface-variant font-medium">{shift.checkOut}</td>
                    <td className="px-4 sm:px-8 py-6 text-center text-on-surface-variant dark:text-dark-on-surface-variant">{shift.grace}</td>
                    <td className="px-4 sm:px-8 py-6 text-center text-on-surface-variant dark:text-dark-on-surface-variant">{shift.threshold}</td>
                    <td className="px-4 sm:px-8 py-6 text-right">
                      {expandedId === shift.id ? (
                        <button
                          onClick={() => setExpandedId("")}
                          className="p-2 text-primary"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setExpandedId(shift.id)}
                            className="p-2 text-secondary hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="p-2 text-secondary hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>

                  {/* Timeline Sub-row */}
                  {expandedId === shift.id && (
                    <tr key={`${shift.id}-timeline`} className="bg-surface-container/30 dark:bg-dark-surface-container/30">
                      <td className="px-4 sm:px-8 pb-8" colSpan={7}>
                        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest p-4 sm:p-8 rounded-xl border border-outline-variant/20 dark:border-dark-outline-variant/20">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">
                              Visual Timeline Anatomy
                            </h4>
                            <div className="flex space-x-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant">CORE SHIFT</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-primary-container" />
                                <span className="text-[10px] font-bold text-on-surface-variant dark:text-dark-on-surface-variant">GRACE PERIOD</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline Bar */}
                          <div className="relative w-full h-16 bg-surface-container-high dark:bg-dark-surface-container-high rounded-lg overflow-hidden flex items-center">
                            {/* Time Markers */}
                            <div className="absolute inset-0 flex justify-between px-4 items-center opacity-20 pointer-events-none">
                              <span className="text-[9px] font-bold">06:00</span>
                              <span className="text-[9px] font-bold">09:00</span>
                              <span className="text-[9px] font-bold">12:00</span>
                              <span className="text-[9px] font-bold">15:00</span>
                              <span className="text-[9px] font-bold">18:00</span>
                              <span className="text-[9px] font-bold">21:00</span>
                            </div>

                            {/* Timeline Content */}
                            <div className="relative h-10 mx-auto w-4/5 bg-surface-container-high/50 dark:bg-dark-surface-container-high/50 rounded-md overflow-hidden flex items-center">
                              <div className="absolute left-[10%] h-full bg-primary/20 border-l-2 border-primary w-[75%]" />
                              <div className="absolute top-0 bottom-0 flex items-center" style={{ left: "10%", width: "75%" }}>
                                <div className="h-full bg-primary-container w-[10%] opacity-80" />
                                <div className="h-full bg-primary flex-1 flex items-center justify-center">
                                  <span className="text-[10px] text-white font-bold tracking-widest hidden sm:inline">ACTIVE SURVEILLANCE WINDOW</span>
                                  <span className="text-[8px] text-white font-bold tracking-wide sm:hidden">ACTIVE</span>
                                </div>
                                <div className="h-full bg-primary-container w-[5%] opacity-80" />
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between px-[10%] text-[10px] font-black text-primary uppercase tracking-tighter">
                            <span>{shift.checkIn} (Check-in)</span>
                            <span>{shift.checkOut} (Check-out)</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-8 py-6 bg-surface-container-low/50 dark:bg-dark-surface-container-low/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant font-medium">
            Showing 4 of 14 operational shifts
          </span>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors rounded">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "hover:bg-surface-container dark:hover:bg-dark-surface-container text-on-surface dark:text-dark-on-surface"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-2 hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors rounded">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Shift Optimization Banner */}
      <div className="p-4 sm:p-8 rounded-2xl bg-[#1a1a27] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary-fixed/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary-fixed text-2xl sm:text-3xl">psychology</span>
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">AI Shift Optimization</h3>
            <p className="text-white/60 text-sm max-w-md">
              Attend.AI has detected a potential overlap in &quot;Morning Intelligence A&quot; and &quot;Administrative Support&quot;. Would you like to auto-rebalance?
            </p>
          </div>
        </div>
        <button className="px-6 py-2 border border-primary-fixed/20 rounded-lg text-primary-fixed font-bold text-xs tracking-widest uppercase hover:bg-primary-fixed/10 transition-colors whitespace-nowrap">
          Review Suggestions
        </button>
      </div>
    </div>
  );
}
