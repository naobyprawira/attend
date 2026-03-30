"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dummy data                                                        */
/* ------------------------------------------------------------------ */

const PURPOSES = ["Meeting", "Maintenance", "Delivery", "Interview"];

const VISITORS = [
  {
    id: "V-9283-AA",
    name: "Marcus Sterling",
    host: "Sarah Connor",
    dept: "Cybernetics Div.",
    purpose: "Technical Audit",
    timeIn: "08:45 AM",
    timeExp: "05:00 PM",
    timeIcon: "login",
    status: "CHECKED IN",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    expired: false,
    grayed: false,
  },
  {
    id: "V-9284-BA",
    name: "Elena Rodriguez",
    host: "David Chen",
    dept: "Human Resources",
    purpose: "Candidate Interview",
    timeIn: "Oct 24, 11:30",
    timeExp: "01:00 PM",
    timeIcon: "calendar_today",
    status: "PRE-REGISTERED",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    expired: false,
    grayed: false,
  },
  {
    id: "V-9102-XC",
    name: "Thomas Anderson",
    host: "Agent Smith",
    dept: "Security Ops",
    purpose: "Interrogation",
    timeIn: "06:00 AM",
    timeExp: "Overstayed: 2h",
    timeIcon: "history",
    status: "EXPIRED",
    statusColor: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    expired: true,
    grayed: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function VisitorManagementPage() {
  const [selectedPurpose, setSelectedPurpose] = useState("Meeting");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-surface dark:bg-dark-surface min-h-screen">
      {/* ---- Pre-Register Visitor ---- */}
      <section className="mb-12">
        <div className="mb-6">
          <h3 className="text-sm font-bold tracking-[0.05em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase">Registration Terminal</h3>
          <p className="text-2xl font-semibold text-on-surface dark:text-dark-on-surface mt-1">Pre-Register Visitor</p>
        </div>

        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl p-4 sm:p-6 lg:p-8 border border-outline-variant/10 dark:border-dark-outline-variant/10">
          <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10" onSubmit={(e) => e.preventDefault()}>
            {/* Photo upload */}
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-xl bg-surface-container-high dark:bg-dark-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant dark:border-dark-outline-variant text-secondary group cursor-pointer hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-4xl mb-2">add_a_photo</span>
                <span className="text-xs font-bold uppercase tracking-wider">Upload Portrait</span>
                <p className="text-[10px] text-center px-4 mt-2">Required for biometric identification matching</p>
              </div>
              <div className="flex gap-2 w-full max-w-[192px]">
                <button type="button" className="flex-1 py-2 text-[11px] font-bold uppercase border border-outline-variant dark:border-dark-outline-variant rounded hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors text-on-surface dark:text-dark-on-surface">Capture</button>
                <button type="button" className="flex-1 py-2 text-[11px] font-bold uppercase border border-outline-variant dark:border-dark-outline-variant rounded hover:bg-surface-container dark:hover:bg-dark-surface-container transition-colors text-on-surface dark:text-dark-on-surface">Library</button>
              </div>
            </div>

            {/* Form fields */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1">Visitor Full Name</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary-container outline-none transition-all text-on-surface dark:text-dark-on-surface"
                  placeholder="e.g. Jonathan Wick"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1">Host Employee Search</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary-container outline-none transition-all text-on-surface dark:text-dark-on-surface"
                    placeholder="Search by name or department..."
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">person_search</span>
                </div>
              </div>

              {/* Purpose of visit */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1">Purpose of Visit</label>
                <div className="flex flex-wrap gap-2">
                  {PURPOSES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPurpose(p)}
                      className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                        selectedPurpose === p
                          ? "bg-primary text-white"
                          : "bg-surface-container-high dark:bg-dark-surface-container-high text-secondary hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <input
                    type="text"
                    className="px-4 py-1.5 bg-transparent border-b border-outline-variant dark:border-dark-outline-variant text-xs outline-none focus:border-primary min-w-[120px] text-on-surface dark:text-dark-on-surface"
                    placeholder="Other..."
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1">Arrival Schedule</label>
                <div className="flex gap-2">
                  <input type="date" className="flex-1 bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary-container outline-none transition-all text-on-surface dark:text-dark-on-surface" />
                  <input type="time" className="w-32 bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary-container outline-none transition-all text-on-surface dark:text-dark-on-surface" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-secondary tracking-widest px-1">Expected Departure</label>
                <input type="time" className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary-container outline-none transition-all text-on-surface dark:text-dark-on-surface" />
              </div>

              {/* Submit */}
              <div className="sm:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-3 rounded-lg font-bold text-sm tracking-wide shadow-xl active:scale-95 transition-all"
                >
                  GENERATE ACCESS PASS
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ---- Active Visitors ---- */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h3 className="text-sm font-bold tracking-[0.05em] text-on-surface-variant dark:text-dark-on-surface-variant uppercase">Operational Monitoring</h3>
            <p className="text-2xl font-semibold text-on-surface dark:text-dark-on-surface mt-1">Active Visitors</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container dark:bg-dark-surface-container px-4 py-2 rounded-lg flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-black uppercase text-secondary">14 Present</span>
              </div>
              <div className="w-px h-4 bg-outline-variant/30" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11px] font-black uppercase text-secondary">08 Expected</span>
              </div>
            </div>
            <button className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest border border-outline-variant/20 dark:border-dark-outline-variant/20 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-surface-container transition-colors">
              <span className="material-symbols-outlined text-secondary">filter_list</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-dark-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 dark:border-dark-outline-variant/10 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low dark:bg-dark-surface-container-low border-b border-outline-variant/10 dark:border-dark-outline-variant/10">
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-secondary tracking-widest">Identity</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-secondary tracking-widest">Host / Department</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-secondary tracking-widest">Purpose</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-secondary tracking-widest">Timestamp</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-secondary tracking-widest text-center">Security Status</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase text-secondary tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {VISITORS.map((v) => (
                  <tr key={v.id} className="hover:bg-surface-container-low/30 dark:hover:bg-dark-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${v.grayed ? "border-slate-200 dark:border-slate-600 grayscale" : "border-primary-fixed"} bg-surface-container-high dark:bg-dark-surface-container-high flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-secondary">person</span>
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${v.grayed ? "text-slate-400 line-through" : "text-on-surface dark:text-dark-on-surface"}`}>{v.name}</p>
                          <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant font-medium">ID: {v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className={`text-sm font-medium ${v.grayed ? "text-slate-400" : "text-on-surface dark:text-dark-on-surface"}`}>{v.host}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-tighter ${v.grayed ? "text-secondary/50" : "text-secondary"}`}>{v.dept}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2.5 py-1 bg-surface-container-high dark:bg-dark-surface-container-high rounded font-medium ${v.grayed ? "text-slate-400" : "text-on-surface-variant dark:text-dark-on-surface-variant"}`}>{v.purpose}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold flex items-center gap-1 ${v.grayed ? "text-slate-400" : v.status === "PRE-REGISTERED" ? "text-secondary italic" : "text-on-surface dark:text-dark-on-surface"}`}>
                          <span className={`material-symbols-outlined text-[14px] ${!v.grayed && !v.expired ? "text-emerald-500" : ""}`}>{v.timeIcon}</span>
                          {v.timeIn}
                        </span>
                        <span className={`text-[10px] ${v.expired ? "text-error font-bold" : "text-secondary"}`}>
                          {v.expired ? v.timeExp : `Exp: ${v.timeExp}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${v.statusColor}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-1">
                        {v.expired ? (
                          <>
                            <button className="p-2 text-error animate-pulse" title="Alert"><span className="material-symbols-outlined text-[20px]">priority_high</span></button>
                            <button className="p-2 text-secondary hover:text-primary transition-colors" title="Extend Stay"><span className="material-symbols-outlined text-[20px]">more_time</span></button>
                            <button className="p-2 text-secondary hover:text-error transition-colors" title="Block"><span className="material-symbols-outlined text-[20px]">block</span></button>
                          </>
                        ) : (
                          <>
                            <button className="p-2 text-secondary hover:text-primary transition-colors" title="Print Badge"><span className="material-symbols-outlined text-[20px]">badge</span></button>
                            <button className="p-2 text-secondary hover:text-primary transition-colors" title="Extend Stay"><span className="material-symbols-outlined text-[20px]">more_time</span></button>
                            <button className={`p-2 text-secondary hover:text-error transition-colors ${v.status === "PRE-REGISTERED" ? "opacity-30 cursor-not-allowed" : ""}`} title="Check Out">
                              <span className="material-symbols-outlined text-[20px]">logout</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-surface-container-low/50 dark:bg-dark-surface-container-low/50 py-3 px-6 flex items-center justify-between border-t border-outline-variant/10 dark:border-dark-outline-variant/10">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Displaying 1-3 of 22 entries</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-highest dark:bg-dark-surface-container-highest text-secondary disabled:opacity-30">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {[1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-[11px] font-bold ${
                    currentPage === p
                      ? "bg-primary text-white"
                      : "bg-surface-container-highest dark:bg-dark-surface-container-highest text-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-highest dark:bg-dark-surface-container-highest text-secondary">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
