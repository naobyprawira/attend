"use client";

import { useAttendSocket } from "@/hooks/useAttendSocket";
import type { BgMode, FaceCapture } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

const BG_MODES: { value: BgMode; label: string; icon: string }[] = [
  { value: "normal", label: "OFF", icon: "visibility" },
  { value: "blur", label: "BLUR", icon: "blur_on" },
  { value: "green", label: "GREEN", icon: "landscape" },
  { value: "black", label: "BLACK", icon: "contrast" },
];

interface Toast {
  id: string;
  capture: FaceCapture;
  exiting: boolean;
}

export default function LiveViewPage() {
  const { connected, metadata, faceCaptures, fps, frameCount, canvasRef, setBgMode } =
    useAttendSocket();
  const [activeBg, setActiveBg] = useState<BgMode>("normal");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedFeed, setSelectedFeed] = useState("001-LBY");

  const handleBgChange = (mode: BgMode) => {
    setActiveBg(mode);
    setBgMode(mode);
  };

  // Show toast notifications for face captures
  useEffect(() => {
    if (faceCaptures.length === 0) return;
    const latest = faceCaptures[0];
    const id = `${latest.timestamp}-${Math.random()}`;
    setToasts((prev) => [{ id, capture: latest, exiting: false }, ...prev].slice(0, 5));

    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    }, 4000);
    const removeTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [faceCaptures]);

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!metadata?.detections?.length || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      const hit = metadata.detections.find((d) => {
        const [bx, by, bw, bh] = d.bbox;
        return mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      for (const det of metadata.detections) {
        const [x, y, w, h] = det.bbox;
        const isRecognized = !!det.name;
        const isHovered = det === hit;
        ctx.strokeStyle = isRecognized ? "#22c55e" : "#ef4444";
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.strokeRect(x, y, w, h);
        if (isHovered) {
          const label = det.name || "Unknown";
          ctx.font = "bold 12px 'Inter', sans-serif";
          const tw = ctx.measureText(label).width;
          ctx.fillStyle = isRecognized ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)";
          ctx.fillRect(x, y - 22, tw + 12, 22);
          ctx.fillStyle = "#fff";
          ctx.fillText(label, x + 6, y - 6);
        }
      }
    },
    [metadata, canvasRef],
  );

  const processingMs = metadata?.processing_ms ?? 0;

  const DUMMY_FEEDS = [
    { id: "001-LBY", name: "Main Lobby", status: "live" },
    { id: "004-ENG", name: "Eng Floor", status: "live" },
    { id: "009-CNF", name: "Conf. A", status: "idle" },
    { id: "012-PKG", name: "Parking B2", status: "live" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-surface dark:bg-dark-surface relative">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Feed Selector Tabs */}
        <div className="bg-surface-container dark:bg-dark-surface-container px-6 py-3 flex items-center gap-3 border-b border-outline-variant/10 dark:border-dark-outline-variant/10">
          {DUMMY_FEEDS.map((feed) => (
            <button
              key={feed.id}
              onClick={() => setSelectedFeed(feed.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                selectedFeed === feed.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-dark-surface-container-highest"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${feed.status === "live" ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
              {feed.name}
            </button>
          ))}
        </div>

        {/* Video Canvas */}
        <div className="flex-1 flex items-center justify-center relative bg-dark-surface-container-lowest">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="max-w-full max-h-full cursor-crosshair rounded-lg"
            onMouseMove={handleCanvasMouseMove}
          />
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <span className="material-symbols-outlined text-white/30 text-6xl mb-4 block">videocam_off</span>
                <p className="text-white/50 text-sm tracking-[3px] font-mono uppercase">No Signal</p>
                <p className="text-white/30 text-xs mt-2">Awaiting camera connection...</p>
              </div>
            </div>
          )}

          {/* Overlay Info */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md ${
              connected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}>
              <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {connected ? "Live" : "Offline"}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/60 text-[10px] font-mono">
              {new Date().toLocaleTimeString("en-GB")}
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 text-[10px] font-bold">
              {fps} FPS
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 text-[10px] font-bold">
              {metadata?.faces ?? 0} Faces
            </div>
          </div>
        </div>

        {/* Face Strip */}
        {faceCaptures.length > 0 && (
          <div className="bg-dark-surface-container-lowest border-t border-white/10 px-4 py-3 flex gap-3 overflow-x-auto">
            {faceCaptures.slice(0, 20).map((cap, i) => (
              <div key={i} className="shrink-0 text-center group">
                <div className="relative">
                  <img
                    src={`data:image/jpeg;base64,${cap.thumbnail}`}
                    alt=""
                    className="w-14 h-14 rounded-lg border-2 object-cover transition-transform group-hover:scale-105"
                    style={{ borderColor: cap.name ? "#22c55e" : "#ef4444" }}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                    cap.name ? "bg-green-500" : "bg-red-500"
                  }`}>
                    <span className="material-symbols-outlined text-white text-[10px]">
                      {cap.name ? "check" : "close"}
                    </span>
                  </div>
                </div>
                <div
                  className="text-[9px] mt-1.5 font-bold truncate w-14 uppercase tracking-tight"
                  style={{ color: cap.name ? "#22c55e" : "#ef4444" }}
                >
                  {cap.name || "Unknown"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Control Panel */}
      <div className="w-80 bg-surface-container-lowest dark:bg-dark-surface-container border-l border-outline-variant/10 dark:border-dark-outline-variant/10 flex flex-col">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-px bg-outline-variant/10 dark:bg-dark-outline-variant/10">
          {[
            { label: "FPS", value: fps, color: "text-primary" },
            {
              label: "LATENCY",
              value: processingMs > 0 ? `${Math.round(processingMs)}ms` : "--",
              color: processingMs < 50 ? "text-green-500" : processingMs < 100 ? "text-yellow-500" : "text-red-500",
            },
            { label: "FRAMES", value: frameCount.toLocaleString(), color: "text-on-surface dark:text-dark-on-surface" },
            { label: "FACES", value: metadata?.faces ?? 0, color: "text-on-surface dark:text-dark-on-surface" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest dark:bg-dark-surface-container p-4 text-center">
              <div className={`text-xl font-black font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[9px] mt-1 tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant font-bold uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* BG Mode */}
        <div className="px-5 py-4 border-b border-outline-variant/10 dark:border-dark-outline-variant/10">
          <div className="text-[10px] tracking-widest mb-3 text-on-surface-variant dark:text-dark-on-surface-variant font-bold uppercase">
            Background Mode
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BG_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => handleBgChange(m.value)}
                className={`py-2 px-1 text-[9px] tracking-wider font-bold rounded-lg cursor-pointer transition-all flex flex-col items-center gap-1 ${
                  activeBg === m.value
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-surface-container dark:bg-dark-surface-container-high text-on-surface-variant dark:text-dark-on-surface-variant border border-transparent hover:border-outline-variant/20"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="px-5 py-3 border-b border-outline-variant/10 dark:border-dark-outline-variant/10 flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: connected ? "#22c55e" : "#ef4444",
              animation: connected ? "pulse-live 1.5s infinite" : "none",
            }}
          />
          <span className="text-xs font-mono font-bold text-on-surface-variant dark:text-dark-on-surface-variant">
            {connected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>

        {/* Live Log */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-5 py-3 text-[10px] tracking-widest border-b border-outline-variant/10 dark:border-dark-outline-variant/10 text-on-surface-variant dark:text-dark-on-surface-variant font-bold uppercase flex items-center justify-between">
            <span>Live Log</span>
            <span className="text-primary">{faceCaptures.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {faceCaptures.slice(0, 30).map((cap, i) => (
              <div
                key={i}
                className="px-5 py-3 border-b border-outline-variant/5 dark:border-dark-outline-variant/5 hover:bg-surface-container dark:hover:bg-dark-surface-container-high transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">
                    {new Date(cap.timestamp).toLocaleTimeString("en-GB")}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      cap.name
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {cap.name ? `${Math.round(cap.confidence * 100)}%` : "NO MATCH"}
                  </span>
                </div>
                <p className={`text-xs font-bold mt-1 ${cap.name ? "text-on-surface dark:text-dark-on-surface" : "text-red-400 italic"}`}>
                  {cap.name || "Unknown face"}
                </p>
              </div>
            ))}
            {faceCaptures.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant dark:text-dark-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 opacity-30">face</span>
                <p className="text-xs">Waiting for detections...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="absolute top-20 right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <CheckInToast key={toast.id} capture={toast.capture} exiting={toast.exiting} />
        ))}
      </div>
    </div>
  );
}

function CheckInToast({ capture, exiting }: { capture: FaceCapture; exiting: boolean }) {
  const isRecognized = !!capture.name;

  return (
    <div
      className={`pointer-events-auto w-80 rounded-xl overflow-hidden shadow-2xl ${
        exiting ? "animate-slide-out-right" : "animate-slide-in-right"
      }`}
    >
      <div className={`${isRecognized ? "bg-green-600" : "bg-red-600"} px-4 py-2 flex items-center gap-2`}>
        <span className="material-symbols-outlined text-white text-sm">
          {isRecognized ? "check_circle" : "error"}
        </span>
        <span className="text-white text-[10px] font-bold uppercase tracking-widest">
          {isRecognized ? "Check-In Confirmed" : "Unrecognized Face"}
        </span>
      </div>
      <div className="bg-white dark:bg-dark-surface-container-high p-4 flex items-center gap-4">
        <div className="relative">
          {capture.thumbnail ? (
            <img
              src={`data:image/jpeg;base64,${capture.thumbnail}`}
              alt=""
              className={`w-14 h-14 rounded-lg object-cover border-2 ${isRecognized ? "border-green-500" : "border-red-500"}`}
            />
          ) : (
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${isRecognized ? "bg-green-100 border-2 border-green-500" : "bg-red-100 border-2 border-red-500"}`}>
              <span className="material-symbols-outlined text-2xl">{isRecognized ? "person" : "person_off"}</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-on-surface dark:text-dark-on-surface truncate">
            {capture.name || "Unknown Person"}
          </p>
          <p className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-wider mt-0.5">
            {new Date(capture.timestamp).toLocaleTimeString("en-US")}
          </p>
        </div>
        {isRecognized && (
          <div className="text-right shrink-0">
            <p className="text-lg font-black text-green-600">
              {Math.round(capture.confidence * 100)}%
            </p>
            <p className="text-[8px] text-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-widest">Match</p>
          </div>
        )}
      </div>
    </div>
  );
}
