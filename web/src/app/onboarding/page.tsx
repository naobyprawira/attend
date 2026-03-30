"use client";

import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HwCheck {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
}

interface AdminForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CameraForm {
  name: string;
  protocol: "websocket" | "rtsp";
  url: string;
}

interface PersonForm {
  fullName: string;
  employeeId: string;
  department: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "System Check", icon: "verified_user" },
  { label: "Create Admin", icon: "admin_panel_settings" },
  { label: "Add Camera", icon: "videocam" },
  { label: "Register Person", icon: "person_add" },
] as const;

const HW_CHECKS: HwCheck[] = [
  { icon: "memory", title: "CPU Infrastructure", subtitle: "Intel\u00ae Xeon\u00ae Platinum 8000 series or equivalent", badge: "OPTIMIZED" },
  { icon: "settings_input_component", title: "Memory Allocation", subtitle: "64GB DDR5 System Memory available", badge: "OPTIMIZED" },
  { icon: "developer_board", title: "GPU Neural Engine", subtitle: "NVIDIA\u00ae A100 Tensor Core Detected", badge: "READY" },
  { icon: "database", title: "Storage Throughput", subtitle: "2TB NVMe SSD \u2014 3500MB/s Read/Write", badge: "READY" },
  { icon: "lan", title: "Network Latency", subtitle: "Gigabit Fiber \u2014 < 5ms ping to gateway", badge: "READY" },
];

const DEPARTMENTS = ["Engineering", "Marketing", "Operations", "HR", "Finance", "Security", "Executive"];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Step 2 - Admin form
  const [admin, setAdmin] = useState<AdminForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Step 3 - Camera form
  const [camera, setCamera] = useState<CameraForm>({
    name: "",
    protocol: "rtsp",
    url: "",
  });
  const [cameraTestStatus, setCameraTestStatus] = useState<"idle" | "testing" | "success" | "fail">("idle");

  // Step 4 - Person form
  const [person, setPerson] = useState<PersonForm>({
    fullName: "",
    employeeId: "",
    department: "Engineering",
  });
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const progressPct = Math.round((step / STEPS.length) * 100);

  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, 4)), []);
  const goPrev = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const handleCameraTest = () => {
    setCameraTestStatus("testing");
    setTimeout(() => {
      setCameraTestStatus(camera.url.length > 5 ? "success" : "fail");
    }, 1500);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex h-full overflow-hidden bg-surface">
      {/* ============ SIDEBAR ============ */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 bg-surface-container-lowest border-r border-outline-variant/20 p-6 space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">security</span>
          </div>
          <span className="text-lg font-black text-primary tracking-tighter">Attend.AI</span>
        </div>

        {/* Phase label */}
        <div className="px-2">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">Onboarding</p>
          <p className="text-[10px] text-on-surface-variant">Phase 1: Initialization</p>
        </div>

        {/* Step Nav */}
        <nav className="space-y-1">
          {STEPS.map((s, i) => {
            const idx = i + 1;
            const isActive = step === idx;
            const isDone = step > idx;
            return (
              <button
                key={s.label}
                onClick={() => setStep(idx)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "primary-gradient text-white shadow-lg shadow-primary/20"
                    : isDone
                      ? "text-primary hover:bg-primary/5"
                      : "text-secondary hover:text-primary hover:bg-surface-container"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isDone ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {isDone ? "check_circle" : s.icon}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Setup Progress */}
        <div className="mt-auto p-4 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-lg">rocket_launch</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Setup Progress</p>
              <p className="text-[10px] text-on-surface-variant">{progressPct}% Complete</p>
            </div>
          </div>
          <div className="w-full bg-outline-variant/30 h-1 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <header className="bg-surface-container-lowest/80 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tighter text-primary md:hidden">Attend.AI</span>
            <span className="hidden md:inline text-xl font-bold tracking-tighter text-primary">Attend.AI</span>
            <div className="h-4 w-px bg-outline-variant/50" />
            <span className="text-sm font-medium text-secondary">Infrastructure Setup</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button className="material-symbols-outlined text-secondary hover:bg-surface-container p-2 rounded-lg transition-colors">
                help_outline
              </button>
              <button className="material-symbols-outlined text-secondary hover:bg-surface-container p-2 rounded-lg transition-colors">
                settings
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/30">
              <span className="text-sm font-semibold text-primary">System Admin</span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-secondary">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          {step === 1 && <StepHardwareValidation onNext={goNext} />}
          {step === 2 && (
            <StepCreateAdmin
              form={admin}
              onChange={setAdmin}
              onNext={goNext}
              onPrev={goPrev}
            />
          )}
          {step === 3 && (
            <StepAddCamera
              form={camera}
              onChange={setCamera}
              testStatus={cameraTestStatus}
              onTest={handleCameraTest}
              onNext={goNext}
              onPrev={goPrev}
            />
          )}
          {step === 4 && (
            <StepRegisterPerson
              form={person}
              onChange={setPerson}
              dragOver={dragOver}
              setDragOver={setDragOver}
              uploadedImage={uploadedImage}
              onImageDrop={handleImageDrop}
              onImageSelect={handleImageSelect}
              onPrev={goPrev}
            />
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/20 px-6 py-3 flex justify-between items-center z-50">
          {STEPS.map((s, i) => {
            const idx = i + 1;
            const isActive = step === idx;
            return (
              <button
                key={s.label}
                onClick={() => setStep(idx)}
                className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-secondary"}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {s.icon}
                </span>
                <span className="text-[10px] font-bold">{s.label.split(" ").pop()}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 1 - Hardware Validation                                       */
/* ================================================================== */

function StepHardwareValidation({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col min-h-full">
      <div className="grid grid-cols-12 gap-8 items-start flex-1">
        {/* Left: Checklist */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <header className="mb-4">
            <span className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
              Step 01 &mdash; Environment Diagnostics
            </span>
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-secondary-fixed mt-1 mb-2">
              Hardware Validation
            </h1>
            <p className="text-on-surface-variant text-lg">
              We&apos;re verifying your environment to ensure optimal AI inference performance.
            </p>
          </header>

          <div className="bg-surface-container-lowest rounded-xl p-8 space-y-3">
            {HW_CHECKS.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-surface-container transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">{item.title}</h3>
                    <p className="text-sm text-on-surface-variant">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-tertiary">{item.badge}</span>
                  <span
                    className="material-symbols-outlined text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Visual feedback */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          {/* Server preview card */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-on-secondary-fixed">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-on-secondary-fixed/80 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/10 text-8xl">dns</span>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Live System Diagnostics
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <p className="text-white font-bold text-sm">datacenter-node-01</p>
                <p className="text-white/60 text-[10px] uppercase">status: verifying packets...</p>
              </div>
              <div className="text-right">
                <p className="text-primary-fixed-dim font-black text-2xl tracking-tighter">98%</p>
                <p className="text-white/40 text-[10px] uppercase">load efficiency</p>
              </div>
            </div>
          </div>

          {/* Inference stability */}
          <div className="bg-surface-container-low rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Inference Stability
              </h4>
              <span className="text-xs font-medium text-primary bg-primary-fixed px-2 py-0.5 rounded">
                High Confidence
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-secondary-fixed-dim to-primary w-[94%]" />
            </div>
            <p className="text-[11px] text-on-surface-variant">
              The current hardware configuration exceeds the minimum requirements for 4K video facial
              recognition at 60fps.
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">info</span>
            <div>
              <p className="text-sm font-semibold text-on-surface mb-1">Expert Recommendation</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Consider enabling Hardware Acceleration in the next step to reduce power consumption by
                up to 30% during idle periods.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 flex justify-between items-center border-t border-outline-variant/20">
        <button className="flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors">
          <span className="material-symbols-outlined">restart_alt</span>
          Rerun Diagnostic
        </button>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 text-primary font-bold hover:bg-surface-container transition-colors rounded-lg">
            Export Logs
          </button>
          <button
            onClick={onNext}
            className="px-10 py-3 primary-gradient text-white font-bold rounded-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            Continue to Admin Setup
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== */
/*  STEP 2 - Create Admin                                              */
/* ================================================================== */

function StepCreateAdmin({
  form,
  onChange,
  onNext,
  onPrev,
}: {
  form: AdminForm;
  onChange: (f: AdminForm) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const update = (field: keyof AdminForm, value: string) =>
    onChange({ ...form, [field]: value });

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
          Step 02 &mdash; Identity Configuration
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-on-secondary-fixed tracking-tighter mt-2 mb-4 leading-tight">
          Create Primary Administrator
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
          Establish the root credentials for the Attend.AI environment. This account will have full
          oversight of surveillance nodes and personnel records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20">
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              onNext();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Administrator Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => update("username", e.target.value)}
                    placeholder="e.g. admin_01"
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
                  />
                  <div className="absolute right-3 top-3 text-outline">
                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Institutional Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="admin@organization.ai"
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
                  />
                  <div className="absolute right-3 top-3 text-outline">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Access Secret
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
                  />
                  <div className="absolute right-3 top-3 text-outline">
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Validate Secret
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
                  />
                  <div className="absolute right-3 top-3 text-outline">
                    <span className="material-symbols-outlined text-sm">key</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-outline-variant/10">
              <button
                type="button"
                onClick={onPrev}
                className="px-6 py-3 text-primary font-bold text-sm hover:bg-surface-container-high rounded-lg transition-colors"
              >
                Back to System Check
              </button>
              <button
                type="submit"
                className="primary-gradient px-10 py-3 rounded-lg text-white font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Initialize Admin Account
              </button>
            </div>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <span
                className="material-symbols-outlined text-primary mb-4"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
              <h3 className="font-bold text-on-surface mb-2">Security Standard</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Passphrases must contain at least 12 characters, including cryptographic symbols and
                alphanumeric clusters for maximum entropy.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <span className="material-symbols-outlined text-[120px]">security</span>
            </div>
          </div>

          <div className="bg-primary-fixed text-on-surface rounded-xl p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">policy</span>
              Data Sovereignty
            </h3>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              This administrator account will be the sole custodian of encrypted face-prints and
              attendance logs within your local node.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden aspect-video relative bg-on-secondary-fixed">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-on-secondary-fixed/80 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/10 text-8xl">shield</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
                <span className="material-symbols-outlined text-white">visibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 3 - Add Camera                                                */
/* ================================================================== */

function StepAddCamera({
  form,
  onChange,
  testStatus,
  onTest,
  onNext,
  onPrev,
}: {
  form: CameraForm;
  onChange: (f: CameraForm) => void;
  testStatus: "idle" | "testing" | "success" | "fail";
  onTest: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const update = (field: keyof CameraForm, value: string) =>
    onChange({ ...form, [field]: value });

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col min-h-full">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
          Step 3: Vision Integration
        </span>
        <div className="flex justify-center gap-3 my-4">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container">linked_camera</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">hub</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">analytics</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start flex-1">
        {/* Left: Form */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="mb-6">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              Camera Configuration
            </span>
            <h2 className="text-3xl font-black text-on-secondary-fixed tracking-tighter mt-1 mb-2">
              Link your first surveillance node.
            </h2>
            <p className="text-on-surface-variant">
              Connect your IP camera or local stream. Attend.AI supports ultra-low latency RTSP and
              WebSocket protocols for real-time biometric analysis.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 space-y-6">
            {/* Camera name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Identify Component
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Main Entrance North"
                className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
              />
            </div>

            {/* Protocol */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Protocol Architecture
              </label>
              <div className="flex gap-3">
                {(["websocket", "rtsp"] as const).map((proto) => (
                  <button
                    key={proto}
                    onClick={() => update("protocol", proto)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                      form.protocol === proto
                        ? "primary-gradient text-white shadow-lg shadow-primary/20"
                        : "bg-surface-container-high text-secondary hover:bg-surface-container-highest"
                    }`}
                  >
                    {proto === "websocket" ? "WebSocket" : "RTSP"}
                  </button>
                ))}
              </div>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Source Endpoint (URL)
              </label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder={
                  form.protocol === "rtsp"
                    ? "rtsp://192.168.1.80:8080/live/main_gate"
                    : "ws://192.168.1.80:8080/live/main_gate"
                }
                className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all font-mono text-sm"
              />
            </div>

            {/* Test button */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onTest}
                disabled={testStatus === "testing" || !form.url}
                className="flex items-center gap-2 text-primary font-bold text-sm hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">
                  {testStatus === "testing" ? "sync" : "cable"}
                </span>
                Test Connection
              </button>
              {testStatus === "success" && (
                <span className="flex items-center gap-1 text-tertiary text-sm font-bold">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  CONNECTED
                </span>
              )}
              {testStatus === "fail" && (
                <span className="flex items-center gap-1 text-error text-sm font-bold">
                  <span className="material-symbols-outlined text-sm">error</span>
                  FAILED
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Right: Preview + tips */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-on-secondary-fixed">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-on-secondary-fixed/90 flex items-center justify-center">
              <span className="material-symbols-outlined text-white/10 text-8xl">videocam</span>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  testStatus === "success" ? "bg-tertiary-fixed" : "bg-error"
                } ${testStatus === "testing" ? "animate-pulse" : ""}`}
              />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                {testStatus === "success"
                  ? "Stream Active"
                  : testStatus === "testing"
                    ? "Connecting..."
                    : "No Signal"}
              </span>
            </div>
            {testStatus === "success" && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white font-bold text-sm">{form.name || "Camera Feed"}</p>
                    <p className="text-white/60 text-[10px] uppercase">{form.protocol} stream</p>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">LIVE</span>
                </div>
              </div>
            )}
          </div>

          {/* Tip card */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex gap-4">
            <span className="material-symbols-outlined text-primary shrink-0">tune</span>
            <div>
              <p className="text-sm font-semibold text-on-surface mb-1">Optimal Feed Settings</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                For best results, camera is recommended at 1080p with a detection angle straight to
                the entry point.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 flex justify-between items-center border-t border-outline-variant/20">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous Step
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={onNext}
            className="px-6 py-3 text-primary font-bold hover:bg-surface-container transition-colors rounded-lg"
          >
            Skip for now
          </button>
          <button
            onClick={onNext}
            className="px-10 py-3 primary-gradient text-white font-bold rounded-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            Complete Connection & Next
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== */
/*  STEP 4 - Register Person                                           */
/* ================================================================== */

function StepRegisterPerson({
  form,
  onChange,
  dragOver,
  setDragOver,
  uploadedImage,
  onImageDrop,
  onImageSelect,
  onPrev,
}: {
  form: PersonForm;
  onChange: (f: PersonForm) => void;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  uploadedImage: string | null;
  onImageDrop: (e: React.DragEvent) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrev: () => void;
}) {
  const update = (field: keyof PersonForm, value: string) =>
    onChange({ ...form, [field]: value });

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
          Step 04 &mdash; Identity Enrollment
        </span>
        <h1 className="text-4xl font-black text-on-secondary-fixed tracking-tighter mt-2 mb-2">
          Register First Person
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Upload + badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Biometric capture */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface">Biometric Capture</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary-fixed text-primary rounded-full">
                Ready to Scan
              </span>
            </div>

            {/* Dropzone */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onImageDrop}
              className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container"
              }`}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded face"
                  className="w-32 h-32 object-cover rounded-xl"
                />
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-outline/40 mb-3">
                    add_a_photo
                  </span>
                  <p className="text-sm font-medium text-on-surface-variant mb-1">
                    Drop image here or click to browse
                  </p>
                  <p className="text-[11px] text-outline">
                    High-resolution JPG or PNG supported (Max 10MB)
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onImageSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Quality badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "LIGHTING", value: "Optimal" },
              { label: "FACE ANGLE", value: "Frontal" },
              { label: "RESOLUTION", value: "4K Native" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-center"
              >
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  {badge.label}
                </p>
                <p className="text-sm font-bold text-on-surface">{badge.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI preview + form */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Crop Preview */}
          <div className="bg-on-secondary-fixed rounded-xl p-6 text-center">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-4">
              AI Crop Preview
            </p>
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-surface-container-highest/20 mb-4 flex items-center justify-center">
              {uploadedImage ? (
                <img src={uploadedImage} alt="AI crop" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-white/20 text-5xl">face</span>
              )}
            </div>
            <div className="inline-flex items-center gap-2 bg-primary-container/30 rounded-full px-4 py-1.5">
              <span className="text-xs font-bold text-primary-fixed-dim uppercase tracking-wider">
                Confidence Score
              </span>
              <span className="text-lg font-black text-white">
                {uploadedImage ? "98.4%" : "--.--%"}
              </span>
            </div>
          </div>

          {/* Profile details form */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 space-y-5">
            <h3 className="text-lg font-bold text-on-surface">Profile Details</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={form.employeeId}
                  onChange={(e) => update("employeeId", e.target.value)}
                  placeholder="EMP-8021"
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Department
                </label>
                <select
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-container/20 text-on-surface transition-all"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Finish button */}
          <button className="w-full py-4 primary-gradient text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
            Finish Setup
            <span className="material-symbols-outlined">check_circle</span>
          </button>

          <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
            By finishing, you acknowledge that biometric data will be stored securely in compliance
            with the Privacy Shield protocol.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 flex justify-between items-center border-t border-outline-variant/20">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous Step
        </button>
      </footer>
    </div>
  );
}
