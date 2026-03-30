"use client";

import { useState } from "react";

// --- Dummy Data ---
const SEARCH_RESULTS = [
  {
    id: "Subject #8821",
    confidence: 94.2,
    camera: "Main Lobby - CAM-001",
    timestamp: "2026-03-30 10:42:15",
    thumbnail: "person",
  },
  {
    id: "Subject #9956",
    confidence: 89.7,
    camera: "East Wing - CAM-004",
    timestamp: "2026-03-30 10:38:02",
    thumbnail: "face",
  },
  {
    id: "Subject #8772",
    confidence: 87.1,
    camera: "Cafeteria - CAM-007",
    timestamp: "2026-03-30 09:55:44",
    thumbnail: "person_search",
  },
  {
    id: "Subject #9903",
    confidence: 82.5,
    camera: "Parking - CAM-012",
    timestamp: "2026-03-30 09:32:20",
    thumbnail: "person",
  },
  {
    id: "Subject #7641",
    confidence: 78.3,
    camera: "Conference - CAM-009",
    timestamp: "2026-03-30 08:48:11",
    thumbnail: "face",
  },
  {
    id: "Subject #8105",
    confidence: 72.9,
    camera: "Main Lobby - CAM-001",
    timestamp: "2026-03-29 17:22:50",
    thumbnail: "person_search",
  },
];

const FILTER_CAMERAS = ["All Cameras", "Main Lobby", "East Wing", "Cafeteria", "Parking", "Conference"];

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [confidenceRange, setConfidenceRange] = useState([60, 100]);
  const [dateFrom, setDateFrom] = useState("2026-03-29");
  const [dateTo, setDateTo] = useState("2026-03-30");
  const [selectedCamera, setSelectedCamera] = useState("All Cameras");
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface dark:bg-dark-surface min-h-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-on-secondary-fixed dark:text-dark-on-surface tracking-tight">
          Unified AI Intelligence
        </h2>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant mt-3 font-medium leading-relaxed">
          Seamlessly multi-vector search system. Upload a profile or specify attributes to locate
          individuals across the regional surveillance grid.
        </p>
      </div>

      {/* Search Area */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Upload + Text Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Upload Face Photo */}
          <div
            className={`bg-surface-variant dark:bg-dark-surface-variant rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-outline-variant/30 hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
            </div>
            <p className="text-sm font-bold text-on-surface dark:text-dark-on-surface">Upload Face Photo</p>
            <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-1 uppercase tracking-widest">
              Drag & drop or click to browse
            </p>
            <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-3">
              JPG, PNG up to 10MB
            </p>
          </div>

          {/* Text Search */}
          <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/10 p-6 flex flex-col">
            <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
              Text Search
            </h4>
            <div className="relative flex-1 flex flex-col">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-dark-on-surface-variant text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Name, ID, or description..."
                  className="w-full bg-surface-container dark:bg-dark-surface-container-high border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface dark:text-dark-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant mt-3 leading-relaxed">
                Search by name, employee ID, clothing description, or physical attributes.
              </p>
              <div className="mt-auto pt-4">
                <button className="primary-gradient text-white w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-sm">search</span>
                  Run Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/10 p-4 sm:p-6">
          <div className="flex flex-wrap items-end gap-4 sm:gap-6">
            {/* Confidence Range */}
            <div className="flex-1 min-w-[180px]">
              <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant block mb-2">
                Confidence Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={confidenceRange[0]}
                  onChange={(e) => setConfidenceRange([Number(e.target.value), confidenceRange[1]])}
                  className="w-16 bg-surface-container dark:bg-dark-surface-container-high border border-outline-variant/20 rounded-lg px-2 py-2 text-xs text-center text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-on-surface-variant dark:text-dark-on-surface-variant text-xs">to</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={confidenceRange[1]}
                  onChange={(e) => setConfidenceRange([confidenceRange[0], Number(e.target.value)])}
                  className="w-16 bg-surface-container dark:bg-dark-surface-container-high border border-outline-variant/20 rounded-lg px-2 py-2 text-xs text-center text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant font-bold">%</span>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex-1 min-w-[220px]">
              <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant block mb-2">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 bg-surface-container dark:bg-dark-surface-container-high border border-outline-variant/20 rounded-lg px-2 py-2 text-xs text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-on-surface-variant dark:text-dark-on-surface-variant text-xs">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 bg-surface-container dark:bg-dark-surface-container-high border border-outline-variant/20 rounded-lg px-2 py-2 text-xs text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Camera Filter */}
            <div className="min-w-[160px]">
              <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant dark:text-dark-on-surface-variant block mb-2">
                Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full bg-surface-container dark:bg-dark-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {FILTER_CAMERAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">
              Analysis Results
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant mt-1">
              {SEARCH_RESULTS.length} matches found
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
            <span className="material-symbols-outlined text-sm">sort</span>
            <span className="font-medium">Sorted by confidence</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEARCH_RESULTS.map((result) => (
            <div
              key={result.id}
              className="bg-surface-variant dark:bg-dark-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden group hover:border-primary/30 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-dark-surface-container-lowest">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/15 text-7xl">{result.thumbnail}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Confidence Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    result.confidence >= 90 ? "bg-green-500/90 text-white" :
                    result.confidence >= 80 ? "bg-tertiary/90 text-white" :
                    "bg-yellow-500/90 text-white"
                  }`}>
                    {result.confidence}%
                  </span>
                </div>
                {/* Subject ID */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-sm font-bold text-white">{result.id}</span>
                </div>
              </div>
              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">videocam</span>
                  <span>{result.camera}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{result.timestamp}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-lg py-2 hover:bg-primary/20 transition-colors">
                    View Detail
                  </button>
                  <button className="text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary transition-colors p-2">
                    <span className="material-symbols-outlined text-sm">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Retrieval Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-surface-variant dark:bg-dark-surface-variant border border-outline-variant/20 hover:border-primary/40 rounded-xl px-8 py-3 flex items-center gap-3 transition-all group">
            <span className="material-symbols-outlined text-primary text-lg">manage_search</span>
            <span className="text-sm font-bold text-on-surface dark:text-dark-on-surface group-hover:text-primary transition-colors">
              Advanced Retrieval
            </span>
            <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-on-surface-variant text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
