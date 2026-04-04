"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle password reset
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-surface overflow-hidden">
      {/* Gradient background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-[#751859]/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[#923272]/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card */}
        <div className="rounded-2xl bg-surface-container-lowest/80 backdrop-blur-sm border border-[#85727b]/10 shadow-sm px-8 py-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">
              Attend.AI
            </h1>
            <p className="mt-1 text-[10px] font-medium tracking-[0.25em] uppercase text-outline">
              Security Protocol Verification
            </p>
          </div>

          {/* Heading */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px] text-on-surface">
                lock
              </span>
              <h2 className="text-lg font-semibold text-on-surface">
                Password Recovery
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Enter the administrative email associated with your identity
              profile. A cryptographically secure reset link will be dispatched
              shortly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@enterprise.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-outline/20 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface placeholder:text-outline/70 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl primary-gradient text-white font-semibold text-sm py-3 transition-colors flex items-center justify-center gap-2 hover:opacity-90"
            >
              Send Reset Link
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Button>
          </form>

          {/* Return link */}
          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                chevron_left
              </span>
              Return to Access Portal
            </Link>
          </div>
        </div>

        {/* Footer badges */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {["ENCRYPTED", "ISO 27001", "GDPR COMPLIANT"].map((badge) => (
            <span
              key={badge}
              className="text-[9px] font-medium tracking-[0.15em] uppercase text-outline/80"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-3 text-center text-[10px] text-outline/75">
          &copy; 2024 Attend.AI Global Surveillance Systems. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
}
