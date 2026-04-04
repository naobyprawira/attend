"use client";

import { useState } from "react";

interface Camera {
  id: string;
  name: string;
  url: string;
  location: string;
  checkpoint: "in" | "out" | "both";
  status: "online" | "offline";
  type: string;
  fps: number;
  resolution: string;
  lastSeen: string;
  thumbnail: string;
}

const DUMMY_CAMERAS: Camera[] = [
  {
    id: "CAM-001",
    name: "Main Entrance Alpha",
    url: "rtsp://192.168.1.104/live",
    location: "Building A, Ground Floor",
    checkpoint: "in",
    status: "online",
    type: "RTSP / H.264",
    fps: 30,
    resolution: "1080p",
    lastSeen: "Just now",
    thumbnail: "",
  },
  {
    id: "CAM-002",
    name: "Engineering Floor B2",
    url: "rtsp://192.168.1.108/live",
    location: "Building B, Floor 2",
    checkpoint: "both",
    status: "online",
    type: "RTSP / H.265",
    fps: 24,
    resolution: "1080p",
    lastSeen: "2 min ago",
    thumbnail: "",
  },
  {
    id: "CAM-003",
    name: "Conference Room A",
    url: "rtsp://192.168.1.115/live",
    location: "Building A, Floor 3",
    checkpoint: "in",
    status: "online",
    type: "RTSP / H.264",
    fps: 15,
    resolution: "720p",
    lastSeen: "Just now",
    thumbnail: "",
  },
  {
    id: "CAM-004",
    name: "Parking Garage B2",
    url: "rtsp://192.168.1.120/live",
    location: "Basement Level 2",
    checkpoint: "out",
    status: "offline",
    type: "RTSP / H.264",
    fps: 30,
    resolution: "1080p",
    lastSeen: "3 hours ago",
    thumbnail: "",
  },
  {
    id: "CAM-005",
    name: "Perimeter North Gate",
    url: "rtsp://192.168.1.125/live",
    location: "Perimeter, North Gate",
    checkpoint: "both",
    status: "online",
    type: "RTSP / H.265",
    fps: 24,
    resolution: "4K",
    lastSeen: "Just now",
    thumbnail: "",
  },
];

type FilterTab = "all" | "online" | "maintenance";

export default function CameraManagementPage() {
  const [cameras, setCameras] = useState<Camera[]>(DUMMY_CAMERAS);
  const [showModal, setShowModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "fail">("idle");

  // Form state
  const [formUrl, setFormUrl] = useState("");
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCheckpoint, setFormCheckpoint] = useState<"in" | "out" | "both">("in");

  const openNewModal = () => {
    setEditingCamera(null);
    setFormUrl("");
    setFormName("");
    setFormLocation("");
    setFormCheckpoint("in");
    setTestStatus("idle");
    setShowModal(true);
  };

  const openEditModal = (cam: Camera) => {
    setEditingCamera(cam);
    setFormUrl(cam.url);
    setFormName(cam.name);
    setFormLocation(cam.location);
    setFormCheckpoint(cam.checkpoint);
    setTestStatus("idle");
    setShowModal(true);
  };

  const handleTestConnection = () => {
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus(formUrl.startsWith("rtsp://") ? "success" : "fail");
    }, 1500);
  };

  const handleSave = () => {
    if (!formName || !formUrl) return;

    if (editingCamera) {
      setCameras((prev) =>
        prev.map((c) =>
          c.id === editingCamera.id
            ? { ...c, name: formName, url: formUrl, location: formLocation, checkpoint: formCheckpoint }
            : c,
        ),
      );
    } else {
      const newId = `CAM-${String(cameras.length + 1).padStart(3, "0")}`;
      setCameras((prev) => [
        ...prev,
        {
          id: newId,
          name: formName,
          url: formUrl,
          location: formLocation,
          checkpoint: formCheckpoint,
          status: "offline",
          type: "RTSP / H.264",
          fps: 30,
          resolution: "1080p",
          lastSeen: "Never",
          thumbnail: "",
        },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCameras((prev) => prev.filter((c) => c.id !== id));
  };

  const onlineCount = cameras.filter((c) => c.status === "online").length;
  const avgFps = cameras.length > 0 ? Math.round(cameras.reduce((sum, c) => sum + c.fps, 0) / cameras.length) : 0;
  const healthPct = cameras.length > 0 ? Math.round((onlineCount / cameras.length) * 100) : 0;

  const filteredCameras =
    activeTab === "online"
      ? cameras.filter((c) => c.status === "online")
      : activeTab === "maintenance"
        ? cameras.filter((c) => c.status === "offline")
        : cameras;

  const stats = [
    {
      label: "Total Assets",
      value: "128",
      icon: "videocam",
      iconBg: "bg-primary-fixed",
      iconColor: "text-primary",
    },
    {
      label: "Live Feeds",
      value: "124",
      icon: "sensors",
      iconBg: "bg-tertiary-fixed/20",
      iconColor: "text-tertiary",
    },
    {
      label: "Avg Frame Rate",
      value: `${avgFps} FPS`,
      icon: "speed",
      iconBg: "bg-primary-fixed",
      iconColor: "text-primary",
    },
    {
      label: "System Health",
      value: `${healthPct}%`,
      icon: "monitor_heart",
      iconBg: "bg-tertiary-fixed/20",
      iconColor: "text-tertiary",
      pulse: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-on-secondary-fixed tracking-tight">
            Camera Management
          </h1>
          <p className="text-secondary mt-1 text-sm font-medium">
            Global Surveillance Infrastructure
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="primary-gradient text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Camera
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined text-[22px] ${stat.iconColor}`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-extrabold text-on-surface tracking-tight">
                  {stat.value}
                </p>
                {stat.pulse && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <div className="flex flex-wrap items-center gap-1">
            {([
              { key: "all" as FilterTab, label: "All Cameras" },
              { key: "online" as FilterTab, label: "Online Only" },
              { key: "maintenance" as FilterTab, label: "Maintenance" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-primary/10 text-primary"
                    : "text-secondary hover:bg-surface-container"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
            <button className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left px-6 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  Location
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  FPS
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  Last Seen
                </th>
                <th className="text-right px-6 py-3 text-[11px] font-extrabold text-secondary tracking-widest uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCameras.map((cam) => (
                <tr
                  key={cam.id}
                  className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors"
                >
                  {/* Name with thumbnail */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0">
                        <span className="material-symbols-outlined text-secondary/40 text-lg">videocam</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {cam.name}
                        </p>
                        <p className="text-[11px] text-secondary font-mono">
                          {cam.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Location */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-on-surface-variant">
                      {cam.location}
                    </span>
                  </td>
                  {/* Type */}
                  <td className="px-4 py-4">
                    <span className="text-xs font-mono tracking-tighter text-secondary">
                      {cam.type}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4">
                    {cam.status === "online" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-error-container text-on-error-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" />
                        Offline
                      </span>
                    )}
                  </td>
                  {/* FPS */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-on-surface">
                      {cam.fps}
                    </span>
                  </td>
                  {/* Last Seen */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-secondary">
                      {cam.lastSeen}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(cam)}
                        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-all"
                        title="Edit camera"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cam.id)}
                        className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/10 transition-all"
                        title="Delete camera"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCameras.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-secondary">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-30 block">videocam_off</span>
                    <p className="text-sm">No cameras found for this filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10">
          <p className="text-xs text-secondary">
            Showing <span className="font-semibold text-on-surface">1</span> to{" "}
            <span className="font-semibold text-on-surface">{filteredCameras.length}</span> of{" "}
            <span className="font-semibold text-on-surface">128</span> results
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg text-secondary hover:bg-surface-container transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {[1, 2, 3, "...", 26].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors flex items-center justify-center ${
                  page === 1
                    ? "bg-primary text-white"
                    : typeof page === "number"
                      ? "text-secondary hover:bg-surface-container"
                      : "text-secondary cursor-default"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-8 h-8 rounded-lg text-secondary hover:bg-surface-container transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Optimization Banner */}
      <div className="bg-on-secondary-fixed rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-fixed text-[22px]">auto_awesome</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">
              Bandwidth Alert: Adaptive Streaming
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              AI has detected 3 cameras with suboptimal bitrate settings. Optimization can reduce bandwidth by 23%.
            </p>
          </div>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-colors shrink-0">
          Apply Optimization
        </button>
      </div>

      {/* RTSP Setup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-on-secondary-fixed/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_-12px_rgba(27,28,29,0.25)] overflow-hidden flex flex-col md:flex-row">
            {/* Left: Preview Frame */}
            <div className="md:w-5/12 bg-on-secondary-fixed p-4 sm:p-6 lg:p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`w-2 h-2 rounded-full ${
                    testStatus === "success"
                      ? "bg-green-500"
                      : testStatus === "fail"
                        ? "bg-red-500"
                        : "bg-primary"
                  } ${testStatus === "testing" ? "animate-pulse" : ""}`}
                />
                <h3 className="text-white font-bold tracking-tight uppercase text-xs">
                  {testStatus === "testing"
                    ? "Testing Connection..."
                    : testStatus === "success"
                      ? "Connection Successful"
                      : testStatus === "fail"
                        ? "Connection Failed"
                        : "Live Preview"}
                </h3>
              </div>

              <div className="flex-1 rounded-xl overflow-hidden bg-surface-container-highest relative aspect-video md:aspect-auto">
                <div className="absolute inset-0 bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/10 text-8xl">videocam</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <span className="material-symbols-outlined text-white/40 text-4xl mb-2">
                      {testStatus === "success" ? "videocam" : testStatus === "testing" ? "sync" : "videocam_off"}
                    </span>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest">
                      {testStatus === "success"
                        ? "Stream Active"
                        : testStatus === "testing"
                          ? "Connecting..."
                          : "Awaiting Link"}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 text-[10px] text-white/50 font-mono">00:00:00:00</div>
                <div className="absolute bottom-4 right-4 flex gap-1">
                  <div className="w-1 h-3 bg-white/20" />
                  <div className="w-1 h-3 bg-white/20" />
                  <div className="w-1 h-3 bg-white/20" />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 uppercase font-bold tracking-widest">Resolution</span>
                  <span className="text-white font-medium">1080p (FHD)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 uppercase font-bold tracking-widest">Framerate</span>
                  <span className="text-white font-medium">30 FPS</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="md:w-7/12 p-10 bg-surface-container-lowest">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-on-surface tracking-tighter">
                    {editingCamera ? "Edit Camera" : "RTSP Camera Setup"}
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Configure your stream endpoint and metadata.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-secondary hover:text-on-surface p-2 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                {/* RTSP URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                    RTSP Stream URL
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="rtsp://admin:password@192.168.1.100:554/live"
                      className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 text-on-surface"
                    />
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testStatus === "testing" || !formUrl}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-surface-container-low text-primary text-[10px] font-bold rounded-md hover:bg-surface-container-high transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                      {testStatus === "testing" ? "Testing..." : "Test Connection"}
                    </button>
                  </div>
                  {testStatus === "success" && (
                    <p className="text-green-500 text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Connection successful
                    </p>
                  )}
                  {testStatus === "fail" && (
                    <p className="text-error text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      Connection failed - check URL format
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Camera Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                      Camera Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Lobby South-East"
                      className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    />
                  </div>
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                      Location
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/50 text-lg">
                        location_on
                      </span>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="Building B, Floor 2"
                        className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                      />
                    </div>
                  </div>
                </div>

                {/* Checkpoint Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                    Checkpoint Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["in", "out", "both"] as const).map((val) => (
                      <label
                        key={val}
                        className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formCheckpoint === val
                            ? "border-primary/40 bg-primary/5"
                            : "border-transparent bg-surface-container-low hover:bg-surface-container-high"
                        }`}
                      >
                        <input
                          type="radio"
                          name="checkpoint"
                          value={val}
                          checked={formCheckpoint === val}
                          onChange={() => setFormCheckpoint(val)}
                          className="sr-only"
                        />
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                          {val === "in" ? "Check-In" : val === "out" ? "Check-Out" : "Both"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-highestest transition-all uppercase tracking-widest text-xs"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 primary-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all uppercase tracking-[0.2em] text-xs"
                  >
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
