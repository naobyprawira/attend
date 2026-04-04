"use client";

import { Button } from "@/components/ui/Button";

import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/translations";
import { useSettings, useUpdateSettings } from "@/lib/queries";
import { toast } from "sonner";

const DEFAULT_SETTINGS: Settings = {
  face_detection_enabled: true,
  face_recognition_enabled: true,
  confidence_threshold: 23.56,
  recognition_model: "Facenet512",
  yolo_enabled: true,
  temporal_alpha: 0.3,
  target_fps: 15,
  jpeg_quality: 80,
  gpu_available: true,
  gpu_name: "NVIDIA RTX 4090",
  yolo_model: "yolo11n-seg.pt",
  face_model: "Facenet512",
  server_uptime: 3600,
};

type MutableSettingsKey =
  | "confidence_threshold"
  | "temporal_alpha"
  | "target_fps"
  | "jpeg_quality";

export default function SettingsPage() {
  const { data, isError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [dirty, setDirty] = useState(false);
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    if (data && !dirty) {
      setSettings(data);
    }
  }, [data, dirty]);

  const update = (key: MutableSettingsKey, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        confidence_threshold: settings.confidence_threshold,
        temporal_alpha: settings.temporal_alpha,
        target_fps: settings.target_fps,
        jpeg_quality: settings.jpeg_quality,
      });
      setDirty(false);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    }
  };

  const saving = updateSettingsMutation.isPending;
  const backendOnline = !!data && !isError;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-surface min-h-full">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="sr-only">
            {t("settings.title")}
          </h2>
        </div>
        {dirty && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="primary-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            {saving ? t("common.saving") : t("common.save")}
          </Button>
        )}
      </div>

      {!backendOnline && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-sm">info</span>
          <span className="text-xs text-primary font-medium">{t("common.backendOffline")}</span>
        </div>
      )}

      <div className="max-w-3xl w-full space-y-6">
        {/* Language */}
        <SettingsCard title={t("settings.language")} icon="translate">
          <SettingsRow label={t("settings.languageLabel")}>
            <div className="flex items-center gap-2">
              {(["en", "id"] as Locale[]).map((lang) => (
                <Button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    locale === lang
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {lang === "en" ? "English" : "Bahasa Indonesia"}
                </Button>
              ))}
            </div>
          </SettingsRow>
          <p className="text-xs text-on-surface-variant">
            {t("settings.languageDesc")}
          </p>
        </SettingsCard>

        {/* Detection */}
        <SettingsCard title={t("settings.detection")} icon="face">
          <SettingsRow label={t("settings.faceDetection")}>
            <StatusBadge enabled={settings.face_detection_enabled} labelEnabled={t("common.enabled")} labelDisabled={t("common.disabled")} />
          </SettingsRow>
          <SettingsRow label={t("settings.faceRecognition")}>
            <StatusBadge enabled={settings.face_recognition_enabled} labelEnabled={t("common.enabled")} labelDisabled={t("common.disabled")} />
          </SettingsRow>
          <SettingsRow label={t("settings.distanceThreshold")}>
            <SliderControl
              value={settings.confidence_threshold}
              min={5} max={40} step={0.5}
              onChange={(v) => update("confidence_threshold", v)}
            />
          </SettingsRow>
          <SettingsRow label={t("settings.recognitionModel")}>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-3 py-1 rounded-lg">
              {settings.recognition_model}
            </span>
          </SettingsRow>
        </SettingsCard>

        {/* Background Removal */}
        <SettingsCard title={t("settings.backgroundRemoval")} icon="auto_fix_high">
          <SettingsRow label={t("settings.yoloSegmentation")}>
            <StatusBadge enabled={settings.yolo_enabled} labelEnabled={t("common.enabled")} labelDisabled={t("common.disabled")} />
          </SettingsRow>
          <SettingsRow label={t("settings.temporalSmoothing")}>
            <SliderControl
              value={settings.temporal_alpha}
              min={0.1} max={1} step={0.05}
              onChange={(v) => update("temporal_alpha", v)}
            />
          </SettingsRow>
        </SettingsCard>

        {/* Camera */}
        <SettingsCard title={t("settings.camera")} icon="videocam">
          <SettingsRow label={t("settings.targetFps")}>
            <SliderControl
              value={settings.target_fps}
              min={5} max={30} step={1}
              onChange={(v) => update("target_fps", v)}
            />
          </SettingsRow>
          <SettingsRow label={t("settings.jpegQuality")}>
            <SliderControl
              value={settings.jpeg_quality}
              min={30} max={100} step={5}
              onChange={(v) => update("jpeg_quality", v)}
            />
          </SettingsRow>
        </SettingsCard>

        {/* System Info */}
        <SettingsCard title={t("settings.systemInfo")} icon="info">
          <SettingsRow label={t("settings.serverUptime")}>
            <span className="text-xs font-mono text-on-surface-variant">
              {Math.floor(settings.server_uptime / 60)}m {settings.server_uptime % 60}s
            </span>
          </SettingsRow>
          <SettingsRow label={t("settings.gpu")}>
            <span className={`text-xs font-mono ${settings.gpu_available ? "text-green-500" : "text-on-surface-variant"}`}>
              {settings.gpu_available ? settings.gpu_name : t("settings.notAvailable")}
            </span>
          </SettingsRow>
          <SettingsRow label={t("settings.yoloModel")}>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-3 py-1 rounded-lg">
              {settings.yolo_model}
            </span>
          </SettingsRow>
          <SettingsRow label={t("settings.faceModel")}>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-3 py-1 rounded-lg">
              {settings.face_model}
            </span>
          </SettingsRow>
        </SettingsCard>
      </div>
    </div>
  );
}

function SettingsCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-variant rounded-xl border border-outline-variant/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h3 className="text-sm font-bold tracking-widest uppercase text-on-surface">
          {title}
        </h3>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-on-surface font-medium">{label}</span>
      {children}
    </div>
  );
}

function StatusBadge({ enabled, labelEnabled = "Enabled", labelDisabled = "Disabled" }: { enabled: boolean; labelEnabled?: string; labelDisabled?: string }) {
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
      enabled ? "bg-green-500/10 text-green-500" : "bg-error/10 text-error"
    }`}>
      {enabled ? labelEnabled : labelDisabled}
    </span>
  );
}

function SliderControl({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-32 accent-primary"
      />
      <span className="text-xs font-mono font-bold text-primary min-w-[3rem] text-right">
        {value}
      </span>
    </div>
  );
}
