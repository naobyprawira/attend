"use client";

import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/Button";

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface min-h-full p-4 sm:p-6 lg:p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-variant mb-8">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-40">
            broken_image
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-black text-on-surface tracking-tight mb-3">
          No cameras connected
        </h2>

        {/* Description */}
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
          Add your first camera to start monitoring your workspace.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/cameras"
            className={buttonClasses(
              { variant: "primary", size: "md", uppercase: true },
              "w-full sm:w-auto",
            )}
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Camera
          </Link>
          <Button
            variant="outline"
            size="md"
            uppercase
            className="w-full sm:w-auto"
          >
            View Tutorial
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-16 text-[10px] text-on-surface-variant opacity-40 uppercase tracking-[0.3em] font-mono">
          Surveillance Engine v4.3.6 &bull; Standby Mode
        </p>
      </div>
    </div>
  );
}
