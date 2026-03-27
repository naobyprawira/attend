"use client";

import { useAttendSocket } from "@/hooks/useAttendSocket";
import type { BgMode, Detection } from "@/lib/types";
import { useCallback, useState } from "react";

const BG_MODES: { value: BgMode; label: string }[] = [
  { value: "normal", label: "OFF" },
  { value: "blur", label: "BLUR" },
  { value: "green", label: "GREEN" },
  { value: "black", label: "BLACK" },
];

export default function LiveViewPage() {
  const { connected, metadata, faceCaptures, fps, frameCount, canvasRef, setBgMode } =
    useAttendSocket();
  const [activeBg, setActiveBg] = useState<BgMode>("normal");
  const [hoveredDetection, setHoveredDetection] = useState<Detection | null>(null);

  const handleBgChange = (mode: BgMode) => {
    setActiveBg(mode);
    setBgMode(mode);
  };

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
      setHoveredDetection(hit || null);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      for (const det of metadata.detections) {
        const [x, y, w, h] = det.bbox;
        const isRecognized = !!det.name;
        const isHovered = det === hit;
        ctx.strokeStyle = isRecognized ? "#198754" : "#dc3545";
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.strokeRect(x, y, w, h);
        if (isHovered) {
          const label = det.name || "Unknown";
          ctx.font = "12px 'Open Sans', sans-serif";
          const tw = ctx.measureText(label).width;
          ctx.fillStyle = isRecognized ? "rgba(25,135,84,0.85)" : "rgba(220,53,69,0.85)";
          ctx.fillRect(x, y - 20, tw + 10, 20);
          ctx.fillStyle = "#fff";
          ctx.fillText(label, x + 5, y - 6);
        }
      }
    },
    [metadata, canvasRef],
  );

  const processingMs = metadata?.processing_ms ?? 0;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col bg-[#1a1a2e]">
        <div className="flex-1 flex items-center justify-center relative">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="max-w-full max-h-full cursor-crosshair rounded"
            onMouseMove={handleCanvasMouseMove}
          />
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/50 text-sm tracking-[3px] font-mono">NO SIGNAL</span>
            </div>
          )}
        </div>

        {/* Face strip */}
        {faceCaptures.length > 0 && (
          <div className="bg-[#16162a] border-t border-white/10 px-3 py-2 flex gap-2 overflow-x-auto">
            {faceCaptures.slice(0, 20).map((cap, i) => (
              <div key={i} className="shrink-0 text-center">
                <img
                  src={`data:image/jpeg;base64,${cap.thumbnail}`}
                  alt=""
                  className="w-12 h-12 rounded border border-white/20 object-cover"
                />
                <div
                  className="text-[9px] mt-0.5 font-mono truncate w-12"
                  style={{ color: cap.name ? "#22c55e" : "#ef4444" }}
                >
                  {cap.name || "???"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control panel */}
      <div
        className="w-72 bg-white border-l flex flex-col"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-px bg-[var(--color-border)]">
          {[
            { label: "FPS", value: fps, color: "var(--color-primary)" },
            {
              label: "LATENCY",
              value: processingMs > 0 ? `${Math.round(processingMs)}ms` : "—",
              color:
                processingMs < 50
                  ? "var(--color-success)"
                  : processingMs < 100
                    ? "var(--color-warning)"
                    : "var(--color-danger)",
            },
            { label: "FRAMES", value: frameCount.toLocaleString(), color: "var(--color-heading)" },
            { label: "FACES", value: metadata?.faces ?? 0, color: "var(--color-heading)" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-3 text-center">
              <div className="text-lg font-bold font-mono" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[9px] mt-0.5 tracking-wider" style={{ color: "var(--color-muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* BG Mode */}
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="text-[10px] tracking-wider mb-2" style={{ color: "var(--color-muted)" }}>
            BACKGROUND
          </div>
          <div className="flex gap-1.5">
            {BG_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => handleBgChange(m.value)}
                className="flex-1 py-1.5 text-[10px] tracking-wider font-semibold border rounded cursor-pointer transition-colors"
                style={
                  activeBg === m.value
                    ? {
                        backgroundColor: "var(--color-primary-light)",
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                      }
                    : {
                        backgroundColor: "white",
                        borderColor: "var(--color-border)",
                        color: "var(--color-muted)",
                      }
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Connection status */}
        <div
          className="px-4 py-2.5 border-b flex items-center gap-2"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: connected ? "var(--color-success)" : "var(--color-danger)",
              animation: connected ? "pulse-live 1.5s infinite" : "none",
            }}
          />
          <span className="text-xs font-mono" style={{ color: "var(--color-secondary)" }}>
            {connected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>

        {/* Live event log */}
        <div className="flex-1 flex flex-col min-h-0">
          <div
            className="px-4 py-2 text-[10px] tracking-wider border-b"
            style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}
          >
            LIVE LOG
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-1 text-[11px]">
            {faceCaptures.slice(0, 30).map((cap, i) => (
              <div
                key={i}
                className="py-1.5 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="font-mono" style={{ color: "var(--color-muted)" }}>
                  {new Date(cap.timestamp).toLocaleTimeString("en-GB")}
                </span>
                <span
                  className="ml-2 font-semibold"
                  style={{ color: cap.name ? "var(--color-success)" : "var(--color-danger)" }}
                >
                  {cap.name
                    ? `${cap.name} (${Math.round(cap.confidence * 100)}%)`
                    : "Unknown face"}
                </span>
              </div>
            ))}
            {faceCaptures.length === 0 && (
              <div className="text-center py-4" style={{ color: "var(--color-muted)" }}>
                Waiting for detections...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
