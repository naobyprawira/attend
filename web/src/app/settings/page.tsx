"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { fetchSettings, updateSettings } from "@/lib/api";
import type { Settings } from "@/lib/types";

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[5px]" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="px-5 pt-5 pb-3">
        <p className="text-lg font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span style={{ color: "var(--color-primary)" }}>{title}</span>
        </p>
      </div>
      <div className="px-5 pb-5 space-y-4">{children}</div>
    </div>
  );
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "var(--color-body)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {});
  }, []);

  const update = (key: string, value: number) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings({
        confidence_threshold: settings.confidence_threshold,
        temporal_alpha: settings.temporal_alpha,
        target_fps: settings.target_fps,
        jpeg_quality: settings.jpeg_quality,
      });
      setDirty(false);
    } catch {}
    setSaving(false);
  };

  if (!settings) {
    return (
      <div className="p-6" style={{ color: "var(--color-muted)" }}>
        Loading settings...
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Settings" breadcrumb="Manage / Settings">
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50 cursor-pointer font-semibold"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl">
        <SettingsCard title="Detection">
          <SettingsRow label="Face Detection">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ backgroundColor: "#d1fae5", color: "var(--color-success)" }}
            >
              ENABLED
            </span>
          </SettingsRow>
          <SettingsRow label="Face Recognition">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ backgroundColor: "#d1fae5", color: "var(--color-success)" }}
            >
              ENABLED
            </span>
          </SettingsRow>
          <SettingsRow label="Distance Threshold">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={40}
                step={0.5}
                value={settings.confidence_threshold}
                onChange={(e) => update("confidence_threshold", parseFloat(e.target.value))}
                className="w-32 accent-[var(--color-primary)]"
              />
              <span className="text-xs font-mono w-8" style={{ color: "var(--color-secondary)" }}>
                {settings.confidence_threshold}
              </span>
            </div>
          </SettingsRow>
          <SettingsRow label="Model">
            <span className="text-xs font-mono" style={{ color: "var(--color-secondary)" }}>
              {settings.recognition_model}
            </span>
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="Background Removal">
          <SettingsRow label="YOLO Segmentation">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ backgroundColor: "#d1fae5", color: "var(--color-success)" }}
            >
              ENABLED
            </span>
          </SettingsRow>
          <SettingsRow label="Temporal Smoothing">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={settings.temporal_alpha}
                onChange={(e) => update("temporal_alpha", parseFloat(e.target.value))}
                className="w-32 accent-[var(--color-primary)]"
              />
              <span className="text-xs font-mono w-8" style={{ color: "var(--color-secondary)" }}>
                {settings.temporal_alpha}
              </span>
            </div>
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="Camera">
          <SettingsRow label="Target FPS">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={settings.target_fps}
                onChange={(e) => update("target_fps", parseInt(e.target.value))}
                className="w-32 accent-[var(--color-primary)]"
              />
              <span className="text-xs font-mono w-8" style={{ color: "var(--color-secondary)" }}>
                {settings.target_fps}
              </span>
            </div>
          </SettingsRow>
          <SettingsRow label="JPEG Quality">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={30}
                max={100}
                step={5}
                value={settings.jpeg_quality}
                onChange={(e) => update("jpeg_quality", parseInt(e.target.value))}
                className="w-32 accent-[var(--color-primary)]"
              />
              <span className="text-xs font-mono w-8" style={{ color: "var(--color-secondary)" }}>
                {settings.jpeg_quality}
              </span>
            </div>
          </SettingsRow>
        </SettingsCard>

        <SettingsCard title="System Info">
          <SettingsRow label="Server Uptime">
            <span className="text-xs font-mono" style={{ color: "var(--color-secondary)" }}>
              {Math.floor(settings.server_uptime / 60)}m {settings.server_uptime % 60}s
            </span>
          </SettingsRow>
          <SettingsRow label="GPU">
            <span
              className="text-xs font-mono"
              style={{ color: settings.gpu_available ? "var(--color-success)" : "var(--color-muted)" }}
            >
              {settings.gpu_available ? settings.gpu_name : "Not available"}
            </span>
          </SettingsRow>
          <SettingsRow label="YOLO Model">
            <span className="text-xs font-mono" style={{ color: "var(--color-secondary)" }}>
              {settings.yolo_model}
            </span>
          </SettingsRow>
          <SettingsRow label="Face Model">
            <span className="text-xs font-mono" style={{ color: "var(--color-secondary)" }}>
              {settings.face_model}
            </span>
          </SettingsRow>
        </SettingsCard>
      </div>
    </>
  );
}
