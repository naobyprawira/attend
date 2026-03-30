"use client";

import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface dark:bg-dark-surface min-h-full p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-variant dark:bg-dark-surface-variant mb-8">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant dark:text-dark-on-surface-variant opacity-40">
            broken_image
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-black text-on-surface dark:text-dark-on-surface tracking-tight mb-3">
          No cameras connected
        </h2>

        {/* Description */}
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed mb-8">
          Add your first camera to start monitoring your workspace.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/cameras"
            className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Camera
          </Link>
          <button className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-outline-variant/30 dark:border-dark-outline-variant/30 text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-variant dark:hover:bg-dark-surface-variant transition-colors">
            View Tutorial
          </button>
        </div>

        {/* Footer */}
        <p className="mt-16 text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant opacity-40 uppercase tracking-[0.3em] font-mono">
          Surveillance Engine v4.3.6 &bull; Standby Mode
        </p>
      </div>
    </div>
  );
}
