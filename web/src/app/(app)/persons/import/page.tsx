"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

interface ImportEntry {
  id: string;
  initials: string;
  name: string;
  empId: string;
  department: string;
  email: string;
  photoStatus: "high" | "none";
  validation: "valid" | "duplicate" | "error";
  errorMessage?: string;
}

const DUMMY_DATA: ImportEntry[] = [
  {
    id: "1",
    initials: "JD",
    name: "Julianne Deckers",
    empId: "EMP-9021",
    department: "Neural Systems",
    email: "j.deckers@intel.monolith",
    photoStatus: "high",
    validation: "valid",
  },
  {
    id: "2",
    initials: "RM",
    name: "Robert McAllister",
    empId: "INVALID_ID",
    department: "Surveillance Operations",
    email: "missing_entry@---",
    photoStatus: "none",
    validation: "duplicate",
    errorMessage: "Duplicated ID Field",
  },
  {
    id: "3",
    initials: "SA",
    name: "Sia Arlow",
    empId: "EMP-4482",
    department: "Logic Architecture",
    email: "sia.arlow@intel.monolith",
    photoStatus: "high",
    validation: "valid",
  },
  {
    id: "4",
    initials: "KU",
    name: "Kaito Uzumaki",
    empId: "EMP-1102",
    department: "Infrastructure",
    email: "invalid_format.email",
    photoStatus: "high",
    validation: "error",
    errorMessage: "Regex Format Error",
  },
  {
    id: "5",
    initials: "LN",
    name: "Lila Nguyen",
    empId: "EMP-7710",
    department: "Ethics Board",
    email: "l.nguyen@intel.monolith",
    photoStatus: "high",
    validation: "valid",
  },
];

export default function BatchImportPage() {
  const [entries] = useState<ImportEntry[]>(DUMMY_DATA);
  const [fileName, setFileName] = useState<string | null>(null);

  const _validCount = entries.filter((e) => e.validation === "valid").length;
  const _errorCount = entries.filter((e) => e.validation !== "valid").length;
  const _totalCount = entries.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="sr-only">
          Batch Import Preview
        </h2>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/10 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary transition-all group-hover:w-2" />
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 rounded-lg p-8 sm:p-12 bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) setFileName(file.name);
            }}
          >
            <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">
                description
              </span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">
              Upload Excel File
            </h3>
            <p className="text-on-surface-variant text-sm mb-6 text-center">
              {fileName
                ? `Selected: ${fileName}`
                : "Drag and drop your .xlsx registry file here"}
            </p>
            <Button
              className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95"
              onClick={() => setFileName("sample_registry.xlsx")}
            >
              Select File
            </Button>
          </div>
        </div>

        {/* Template Resources */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between h-full">
            <div>
              <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
                Template Resources
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Ensure your data follows the standardized monolith schema for
                accurate face-matching and attendance tracking.
              </p>
            </div>
            <a
              href="#"
              className="flex items-center space-x-3 text-primary font-bold group/link"
            >
              <span className="material-symbols-outlined group-hover/link:translate-y-0.5 transition-transform">
                download
              </span>
              <span className="text-sm">Download Template</span>
            </a>
          </div>
        </div>
      </div>

      {/* Validation Summary Bar */}
      <div className="bg-surface-container-high dark:bg-on-secondary-fixed text-on-surface dark:text-white p-4 sm:p-5 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xl border border-outline-variant/20">
        <div className="flex items-center gap-6 sm:gap-12 px-2 sm:px-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-white/80 mb-1">
              Status Report
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed" />
                <span className="font-bold text-lg">47 Valid</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="font-bold text-lg text-error">
                  3 Errors
                </span>
              </div>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-outline-variant/40 dark:bg-white/10 hidden md:block" />
          <div className="hidden md:block">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-white/80 mb-1">
              Total Records
            </span>
            <p className="font-bold text-lg">50 Entities Detected</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-2 sm:px-4">
          <Button className="text-on-surface-variant dark:text-white/70 hover:text-on-surface dark:hover:text-white px-4 py-2 font-semibold text-sm transition-colors">
            Discard Batch
          </Button>
          <Button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 sm:px-8 py-3 rounded-lg font-bold text-sm shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
            Import Valid
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low text-left">
                <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary">
                  Person Details
                </th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary">
                  ID &amp; Dept
                </th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary">
                  Email Registry
                </th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary text-center">
                  Photo Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary text-right">
                  Validation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {entries.map((entry) => {
                const isInvalid = entry.validation !== "valid";
                return (
                  <tr
                    key={entry.id}
                    className={
                      isInvalid
                        ? "bg-error-container/5 hover:bg-error-container/10 transition-colors"
                        : "hover:bg-surface-container transition-colors"
                    }
                  >
                    {/* Person Details */}
                    <td className="px-6 py-5">
                      <div
                        className={`flex items-center space-x-4 ${isInvalid ? "opacity-80" : ""}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold flex-shrink-0">
                          {entry.initials}
                        </div>
                        <span className="font-semibold text-on-surface whitespace-nowrap">
                          {entry.name}
                        </span>
                      </div>
                    </td>

                    {/* ID & Dept */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium ${
                            entry.empId === "INVALID_ID"
                              ? "text-error"
                              : "text-on-surface"
                          }`}
                        >
                          {entry.empId}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {entry.department}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      <span
                        className={`text-sm ${
                          entry.validation === "error"
                            ? "text-error font-medium underline underline-offset-4 decoration-dashed"
                            : entry.validation === "duplicate"
                              ? "text-on-surface-variant italic"
                              : "text-on-surface-variant"
                        }`}
                      >
                        {entry.email}
                      </span>
                    </td>

                    {/* Photo Status */}
                    <td className="px-6 py-5 text-center">
                      {entry.photoStatus === "high" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-tertiary-fixed/20 text-tertiary-container text-[10px] font-bold uppercase tracking-wider">
                          High Resolution
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-error-container text-on-error-container text-[10px] font-bold uppercase tracking-wider">
                          No Image Detected
                        </span>
                      )}
                    </td>

                    {/* Validation */}
                    <td className="px-6 py-5 text-right">
                      {entry.validation === "valid" ? (
                        <span
                          className="material-symbols-outlined text-tertiary font-bold"
                          style={{
                            fontVariationSettings: "'wght' 700",
                          }}
                        >
                          check_circle
                        </span>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-[10px] font-bold text-error uppercase tracking-tighter">
                            {entry.errorMessage}
                          </span>
                          <span
                            className="material-symbols-outlined text-error font-bold"
                            style={{
                              fontVariationSettings: "'wght' 700",
                            }}
                          >
                            cancel
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 sm:px-8 py-6 bg-surface-container-low/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Showing first {entries.length} entries of 50
          </span>
          <div className="flex space-x-2">
            <Button className="p-2 rounded hover:bg-surface-container-high transition-colors text-secondary cursor-not-allowed opacity-30">
              <span className="material-symbols-outlined">chevron_left</span>
            </Button>
            <Button className="p-2 rounded hover:bg-surface-container-high transition-colors text-on-surface">
              <span className="material-symbols-outlined">chevron_right</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="pt-8 sm:pt-12 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-secondary/60 gap-2">
        <span>Attend.AI Core v4.2.1</span>
        <span>Last Processed: 2025-11-24 14:02:11 UTC</span>
      </div>
    </div>
  );
}
