"use client";

import { Button } from "@/components/ui/Button";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function VisitorBadgePage() {
  const [wifiAccess, setWifiAccess] = useState(true);
  const [ndaRequired, setNdaRequired] = useState(false);
  const [escortRequired, setEscortRequired] = useState(true);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-surface min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="sr-only">Visitor Badge Preview</h1>
          </div>
          <div className="flex gap-3">
            <Button className="bg-surface-container-high text-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container-highest transition-colors active:scale-95">
              <span className="material-symbols-outlined">edit</span>
              Edit Details
            </Button>
            <Button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:brightness-110 transition-all active:scale-95">
              <span className="material-symbols-outlined">print</span>
              Print Badge
            </Button>
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ---- Badge Card ---- */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[380px] bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_-12px_rgba(27,28,29,0.08)] overflow-hidden flex flex-col relative border-t-[10px] border-primary-container">
              {/* Branding header */}
              <div className="p-6 flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">radar</span>
                  </div>
                  <span className="font-black text-on-surface text-sm tracking-tighter">Attend.AI</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Official Credential</p>
                  <p className="text-[10px] text-on-surface-variant/60">ID: V-294021-X</p>
                </div>
              </div>

              {/* VISITOR text */}
              <div className="text-center mt-2">
                <h2 className="text-4xl font-black tracking-[0.25em] text-primary-container font-headline">VISITOR</h2>
                <div className="h-1 w-16 bg-primary-container/20 mx-auto mt-2 rounded-full" />
              </div>

              {/* Photo */}
              <div className="flex justify-center mt-8">
                <div className="relative">
                  <div className="w-44 h-44 rounded-full border-4 border-surface-container-low overflow-hidden shadow-sm bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-7xl">person</span>
                  </div>
                  {/* Verified badge */}
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md border-2 border-surface-container-lowest">
                    <span className="material-symbols-outlined text-sm block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
              </div>

              {/* Person details */}
              <div className="flex-1 px-8 pt-6 pb-4 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black text-on-surface tracking-tight">Marcus Richardson</h3>
                <p className="text-on-surface-variant font-medium text-sm mt-1">Lead Developer, Skybound Systems</p>

                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 w-full text-left">
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Host</p>
                    <p className="text-sm font-bold text-on-surface">Sarah Chen</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Purpose</p>
                    <p className="text-sm font-bold text-on-surface">Technical Audit</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Date</p>
                    <p className="text-sm font-bold text-on-surface">Oct 24, 2023</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Valid Until</p>
                    <p className="text-sm font-bold text-primary">06:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-surface-container-low/50 px-8 py-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[8px] text-on-surface-variant leading-tight max-w-[140px]">This badge must be displayed at all times while on the premises.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant">wifi</span>
                    <span className="material-symbols-outlined text-xs text-on-surface-variant">lock</span>
                  </div>
                </div>
                {/* QR placeholder */}
                <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm border border-outline-variant/10">
                  <div className="w-16 h-16 bg-surface-container-highest rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-2xl">qr_code_2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Right panel ---- */}
          <div className="lg:col-span-5 space-y-8">
            {/* Security Validation */}
            <div className="bg-surface-container-low rounded-xl p-6">
              <h4 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">Security Validation</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">face</span>
                    <span className="text-sm font-medium text-on-surface">Face Match Confidence</span>
                  </div>
                  <span className="text-sm font-black text-primary">98.4%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">fact_check</span>
                    <span className="text-sm font-medium text-on-surface">ID Verification</span>
                  </div>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">PASSED</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-fixed-dim to-primary w-[98%]" />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-2">AI Scan complete. Biological markers aligned with database record.</p>
                </div>
              </div>
            </div>

            {/* Badge Options */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-6">Badge Options</h4>
              <div className="space-y-6">
                {/* Wi-Fi toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Add Wi-Fi Access</p>
                    <p className="text-xs text-on-surface-variant">Include temporary guest credentials</p>
                  </div>
                  <Button
                    onClick={() => setWifiAccess(!wifiAccess)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${wifiAccess ? "bg-primary/20" : "bg-surface-container-high"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${wifiAccess ? "right-1 bg-primary" : "left-1 bg-surface-container-lowest shadow-sm"}`} />
                  </Button>
                </div>

                {/* NDA toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">NDA Required</p>
                    <p className="text-xs text-on-surface-variant">Mark as &quot;Signed&quot; on badge</p>
                  </div>
                  <Button
                    onClick={() => setNdaRequired(!ndaRequired)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${ndaRequired ? "bg-primary/20" : "bg-surface-container-high"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${ndaRequired ? "right-1 bg-primary" : "left-1 bg-surface-container-lowest shadow-sm"}`} />
                  </Button>
                </div>

                {/* Escort toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Escort Required</p>
                    <p className="text-xs text-on-surface-variant">Visual flag for security personnel</p>
                  </div>
                  <Button
                    onClick={() => setEscortRequired(!escortRequired)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${escortRequired ? "bg-primary/20" : "bg-surface-container-high"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${escortRequired ? "right-1 bg-primary" : "left-1 bg-surface-container-lowest shadow-sm"}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-secondary-container/30 border border-secondary-container p-4 rounded-xl flex gap-4">
              <span className="material-symbols-outlined text-secondary shrink-0">info</span>
              <p className="text-xs text-on-secondary-container leading-relaxed">
                <strong>Pro Tip:</strong> Use high-density thermal paper for the best results. Badges are valid for 12 hours from the moment of printing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
