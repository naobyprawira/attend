"use client";

import Link from "next/link";

export default function SetupSuccessPage() {
  const statusChips = [
    { label: "Network", value: "Secure Node" },
    { label: "AI Engine", value: "Vision v4.2" },
    { label: "Database", value: "Encrypted" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#ffffff] dark:bg-[#1b1c1d] overflow-hidden">
      {/* Gradient background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-[#751859]/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[#923272]/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 flex flex-col items-center">
        {/* Card */}
        <div className="w-full rounded-2xl bg-white/80 dark:bg-[#2a2a2b]/80 backdrop-blur-sm border border-[#85727b]/10 shadow-sm px-8 py-10 text-center">
          {/* Checkmark icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#923272]">
            <span className="material-symbols-outlined text-[32px] text-white">
              check_circle
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-[#1b1c1d] dark:text-[#e0e0e0] mb-3">
            System Fully Initialized
          </h1>
          <p className="text-sm text-[#53424a] dark:text-[#a09098] leading-relaxed max-w-sm mx-auto">
            Attend.AI is now ready to monitor your workspace. All systems are
            operational.
          </p>

          {/* Status chips */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {statusChips.map((chip) => (
              <div
                key={chip.label}
                className="rounded-lg border border-[#85727b]/15 dark:border-[#85727b]/25 bg-[#f8f5f7] dark:bg-[#1b1c1d] px-4 py-2.5 text-left min-w-[120px]"
              >
                <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#85727b] dark:text-[#85727b]">
                  {chip.label}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  <p className="text-xs font-medium text-[#1b1c1d] dark:text-[#e0e0e0]">
                    {chip.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Enter Dashboard button */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#923272] hover:bg-[#751859] text-white font-semibold text-sm py-3 px-12 transition-colors"
          >
            Enter Dashboard
          </Link>

          {/* View Setup Log */}
          <div className="mt-4">
            <button className="inline-flex items-center gap-1.5 text-sm text-[#53424a] dark:text-[#a09098] hover:text-[#751859] dark:hover:text-[#d4a0c4] transition-colors">
              <span className="material-symbols-outlined text-[16px]">
                description
              </span>
              View Setup Log
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 w-full">
          <p className="text-center text-sm font-medium text-[#85727b]/60 dark:text-[#85727b]/40">
            Attend.AI
          </p>
          <div className="mt-4 flex items-center justify-between px-2">
            <span className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#85727b]/50 dark:text-[#85727b]/30">
              Encryption: AES-256
            </span>
            <span className="text-[9px] font-medium tracking-[0.1em] uppercase text-[#85727b]/50 dark:text-[#85727b]/30">
              Latency: 12ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
