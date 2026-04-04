"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function PasswordResetSentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5">
        <span className="text-lg font-bold text-primary">
          Attend.AI
        </span>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-outline">
          Security Portal
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Email icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <span className="material-symbols-outlined text-[32px] text-white">
              mail
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-on-surface mb-3">
            Check your email
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
            We&apos;ve sent a password reset link to your email address. Please
            follow the instructions to secure your account.
          </p>

          {/* Back to Login button */}
          <Link
            href="/login"
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-xl primary-gradient text-white font-semibold text-sm py-3 transition-colors hover:opacity-90"
          >
            Back to Login
          </Link>

          {/* Resend link */}
          <p className="mt-5 text-sm text-on-surface-variant">
            Didn&apos;t receive the email?{" "}
            <Button className="font-semibold text-primary hover:underline">
              Resend link
            </Button>
          </p>
        </div>

        {/* Status chips */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-outline/20 bg-surface-container-lowest px-5 py-2.5">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-outline">
                Status
              </p>
              <p className="text-xs font-medium text-on-surface">
                Secure Link Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-outline/20 bg-surface-container-lowest px-5 py-2.5">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-outline">
                Expiry
              </p>
              <p className="text-xs font-medium text-on-surface">
                Valid for 24 Hours
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-outline/75">
          &copy; 2024 Attend.AI Surveillance Systems. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
