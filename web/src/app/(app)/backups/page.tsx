"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

type BackupTab = "system" | "audit";
type StorageMode = "cloud" | "local";

const BACKUP_HISTORY = [
  { date: "Oct 24, 2023", time: "11:02:42 GMT+7", size: "42.8 GB", type: "FULL" as const, status: "SUCCESS" as const },
  { date: "Oct 23, 2023", time: "11:00:18 GMT+7", size: "2.1 GB", type: "INCREMENTAL" as const, status: "SUCCESS" as const },
  { date: "Oct 22, 2023", time: "11:01:55 GMT+7", size: "--", type: "INCREMENTAL" as const, status: "FAILED" as const },
  { date: "Oct 21, 2023", time: "10:58:30 GMT+7", size: "1.8 GB", type: "INCREMENTAL" as const, status: "SUCCESS" as const },
];

export default function BackupsPage() {
  const [activeTab, setActiveTab] = useState<BackupTab>("system");
  const [frequency, setFrequency] = useState("daily");
  const [retention, setRetention] = useState("30");
  const [storageMode, setStorageMode] = useState<StorageMode>("cloud");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-surface min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="sr-only">
            Backups
          </h1>
          <div className="flex items-center gap-1 border-b border-outline-variant/10">
            <Button
              onClick={() => setActiveTab("system")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "system"
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              System Backups
            </Button>
            <Button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "audit"
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Audit Logs
            </Button>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-sm">backup</span>
          Backup Now
        </Button>
      </div>

      {/* Configuration + Storage Info */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Schedule Configuration */}
        <div className="lg:col-span-3 bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Schedule Configuration
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Automated data redundancy engine
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-xl">settings_backup_restore</span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                Backup Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                Retention Period (Days)
              </label>
              <input
                type="number"
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                Storage Location
              </label>
              <div className="flex gap-3">
                <Button
                  onClick={() => setStorageMode("cloud")}
                  className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    storageMode === "cloud"
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface-container text-on-surface-variant border border-outline-variant/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">cloud</span>
                  Cloud
                </Button>
                <Button
                  onClick={() => setStorageMode("local")}
                  className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    storageMode === "local"
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface-container text-on-surface-variant border border-outline-variant/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">hard_drive</span>
                  Local
                </Button>
              </div>
            </div>

            <Button className="w-full bg-on-surface text-surface py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Save Configuration
            </Button>
          </div>
        </div>

        {/* Storage Info Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl text-white flex-1 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-10">
              <span className="material-symbols-outlined text-[120px]">cloud_done</span>
            </div>
            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Total Storage Used</p>
                <h2 className="text-4xl font-black mt-1">1.2TB</h2>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Last Validation</p>
                <h3 className="text-lg font-bold mt-1">2 Hours Ago</h3>
                <Button className="text-xs underline opacity-80 hover:opacity-100 mt-1">
                  Integrity Check Details
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-surface-variant p-6 rounded-xl border border-outline-variant/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Cloud Sync Status
              </p>
              <span className="text-xs font-bold text-primary">89%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full w-[89%]" />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3">
              Encryption Level: AES-256-GCM. Synchronizing backup shard #639 to aws-ap1. S3 region is ap-south-1.
            </p>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-on-surface">
              Backup History
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Transactional log of archival events
            </p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">
            history
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Date & Time
                </th>
                <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Size
                </th>
                <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {BACKUP_HISTORY.map((backup, i) => (
                <tr
                  key={i}
                  className="border-b border-outline-variant/5 hover:bg-surface-container transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface">
                      {backup.date}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {backup.time}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        backup.type === "FULL"
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit ${
                        backup.status === "SUCCESS"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {backup.status === "SUCCESS" ? "check_circle" : "cancel"}
                      </span>
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-sm">download</span>
                      </Button>
                      <Button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-sm">restore</span>
                      </Button>
                      <Button className="p-1.5 rounded-lg hover:bg-red-500/10 text-on-surface-variant hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Showing 4 of 124 records
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button className="w-8 h-8 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.3em]">
          Attend.AI Backup Engine v2.4.0
        </p>
      </div>
    </div>
  );
}
