"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";
import { requestAccess } from "@/lib/api";

// ── Request Access Modal ─────────────────────────────────────

function RequestAccessModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPw) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await requestAccess({ username: username.trim(), email: email.trim(), password });
      toast.success("Request submitted! An admin will review it shortly.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="w-full max-w-md bg-surface-container-lowest/95 backdrop-blur-xl rounded-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Request Access</h2>
            <p className="text-on-surface-variant text-sm mt-0.5">
              Submit a request for an admin to review.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
              <input
                autoFocus
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPw ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">lock_reset</span>
              </div>
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary-container text-white font-bold rounded-lg shadow-lg shadow-primary-container/30 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting…" : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-surface-container text-on-surface-variant font-bold rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Login Page ───────────────────────────────────────────────

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center p-6 bg-[linear-gradient(135deg,#923272_0%,#2D2D3A_100%)]">
        {/* Ambient decoration */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-container/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-on-secondary-fixed/30 blur-[120px] rounded-full" />
        </div>

        <div className="w-full max-w-md">
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4 p-4 rounded-full bg-white/10 backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-4xl">
                lens_blur
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-white font-headline">
              Attend.AI
            </h1>
            <p className="text-white/70 text-sm mt-2 font-medium tracking-wide uppercase">
              Institutional Intelligence
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-xl p-10 shadow-2xl">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-on-surface tracking-tight">
                Welcome back
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Please enter your details to continue.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary-container/20 text-on-surface placeholder:text-outline transition-all duration-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary-container/20"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-primary hover:text-primary-container transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary-container text-white font-bold rounded-lg shadow-lg shadow-primary-container/30 hover:shadow-primary-container/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </button>
              </div>
            </form>

            {/* Request Access */}
            <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col items-center space-y-4">
              <p className="text-sm text-on-surface-variant">
                Don&apos;t have an account?
              </p>
              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container transition-colors"
              >
                Request Access
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <footer className="mt-12 flex justify-center space-x-6">
            <a href="#" className="text-white/60 text-xs font-medium hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 text-xs font-medium hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 text-xs font-medium hover:text-white transition-colors">
              Contact Support
            </a>
          </footer>
        </div>
      </main>

      {showRequestModal && (
        <RequestAccessModal onClose={() => setShowRequestModal(false)} />
      )}
    </>
  );
}
