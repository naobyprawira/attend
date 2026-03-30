"use client";

import Link from "next/link";

export default function PasswordResetSentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#1b1c1d]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5">
        <span className="text-lg font-bold text-[#751859] dark:text-[#d4a0c4]">
          Attend.AI
        </span>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#85727b] dark:text-[#85727b]">
          Security Portal
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Email icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#923272]">
            <span className="material-symbols-outlined text-[32px] text-white">
              mail
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-[#1b1c1d] dark:text-[#e0e0e0] mb-3">
            Check your email
          </h1>
          <p className="text-sm text-[#53424a] dark:text-[#a09098] leading-relaxed max-w-xs mx-auto">
            We&apos;ve sent a password reset link to your email address. Please
            follow the instructions to secure your account.
          </p>

          {/* Back to Login button */}
          <Link
            href="/login"
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-[#923272] hover:bg-[#751859] text-white font-semibold text-sm py-3 transition-colors"
          >
            Back to Login
          </Link>

          {/* Resend link */}
          <p className="mt-5 text-sm text-[#53424a] dark:text-[#a09098]">
            Didn&apos;t receive the email?{" "}
            <button className="font-semibold text-[#751859] dark:text-[#d4a0c4] hover:underline">
              Resend link
            </button>
          </p>
        </div>

        {/* Status chips */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-[#85727b]/15 dark:border-[#85727b]/25 bg-white dark:bg-[#2a2a2b] px-5 py-2.5">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#85727b] dark:text-[#85727b]">
                Status
              </p>
              <p className="text-xs font-medium text-[#1b1c1d] dark:text-[#e0e0e0]">
                Secure Link Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[#85727b]/15 dark:border-[#85727b]/25 bg-white dark:bg-[#2a2a2b] px-5 py-2.5">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#85727b] dark:text-[#85727b]">
                Expiry
              </p>
              <p className="text-xs font-medium text-[#1b1c1d] dark:text-[#e0e0e0]">
                Valid for 24 Hours
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#85727b]/50 dark:text-[#85727b]/30">
          &copy; 2024 Attend.AI Surveillance Systems. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
