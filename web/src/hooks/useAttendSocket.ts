"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BgMode, FaceCapture, FrameMetadata } from "@/lib/types";
import { getWsUrl } from "@/lib/api";

export function useAttendSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastImgRef = useRef<HTMLImageElement | null>(null);

  const [connected, setConnected] = useState(false);
  const [metadata, setMetadata] = useState<FrameMetadata | null>(null);
  const [faceCaptures, setFaceCaptures] = useState<FaceCapture[]>([]);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  const fpsCounterRef = useRef(0);
  const reconnectDelay = useRef(1000);

  const connect = useCallback(() => {
    const ws = new WebSocket(getWsUrl("/ws/feed"));
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      reconnectDelay.current = 1000;
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const blob = new Blob([event.data], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
          }
          lastImgRef.current = img;
          URL.revokeObjectURL(url);
        };
        img.src = url;
        setFrameCount((c) => c + 1);
        fpsCounterRef.current++;
      } else {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "frame_metadata") {
            setMetadata(data);
          } else if (data.type === "face_capture") {
            setFaceCaptures((prev) => [data, ...prev].slice(0, 100));
          }
        } catch { /* ignore malformed */ }
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, reconnectDelay.current);
      reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 10000);
    };

    ws.onerror = () => {};
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  // FPS counter
  useEffect(() => {
    const id = setInterval(() => {
      setFps(fpsCounterRef.current);
      fpsCounterRef.current = 0;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const setBgMode = useCallback((mode: BgMode) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ bg: mode }));
    }
  }, []);

  return { connected, metadata, faceCaptures, fps, frameCount, canvasRef, lastImgRef, setBgMode };
}
