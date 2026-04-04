"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/auth/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { Button, buttonClasses } from "@/components/ui/Button";

const PAGE_TITLE_MAP: Record<string, TranslationKey | string> = {
  "/": "nav.dashboard",
  "/live": "nav.liveView",
  "/cameras": "cameras.title",
  "/persons": "nav.persons",
  "/persons/import": "Import Persons",
  "/events": "events.title",
  "/event-center": "Event Center",
  "/settings": "settings.title",
  "/attendance": "nav.attendance",
  "/shifts": "nav.shifts",
  "/analytics": "nav.analytics",
  "/reports": "nav.reports",
  "/reports/department": "Department Report",
  "/reports/exceptions": "Exception Report",
  "/zones": "nav.zones",
  "/zones/map": "Zone Map",
  "/visitors": "nav.visitors",
  "/visitors/badge": "Visitor Badge",
  "/violations": "nav.violations",
  "/api-docs": "API Docs",
  "/api-keys": "API Keys",
  "/backups": "Backups",
  "/cross-site": "Cross Site",
  "/heatmap": "Heatmap",
  "/network": "Network",
  "/people-counting": "Occupancy Intelligence",
  "/permissions": "Permissions",
  "/search": "Search",
  "/sites": "Sites",
  "/system-health": "System Health",
  "/system-logs": "System Logs",
  "/users": "Users",
  "/webhooks": "Webhooks",
};

function normalizePath(pathname: string): string {
  if (pathname.startsWith("/attendance/")) {
    return "/attendance";
  }
  return pathname;
}

function humanizePathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const segment = parts[parts.length - 1] ?? "dashboard";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function resolvePageTitle(pathname: string, t: (key: TranslationKey) => string): string {
  const normalizedPath = normalizePath(pathname);
  const mapped = PAGE_TITLE_MAP[normalizedPath];

  if (!mapped) {
    return humanizePathname(normalizedPath);
  }

  if (mapped.includes(".")) {
    return t(mapped as TranslationKey);
  }

  return mapped;
}

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = resolvePageTitle(pathname, t);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tighter text-on-surface truncate">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant/20">
          <Button
            onClick={() => theme !== "light" && toggleTheme()}
            variant={mounted && theme === "light" ? "primary" : "ghost"}
            size="iconSm"
            shape="full"
            className={`${
              mounted && theme === "light"
                ? "text-on-primary shadow-lg"
                : "text-on-surface-variant"
            }`}
            aria-label="Switch to light mode"
            aria-pressed={theme === "light"}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">light_mode</span>
          </Button>
          <Button
            onClick={() => theme !== "dark" && toggleTheme()}
            variant={mounted && theme === "dark" ? "primary" : "ghost"}
            size="iconSm"
            shape="full"
            className={`${
              mounted && theme === "dark"
                ? "text-on-primary shadow-lg"
                : "text-on-surface-variant"
            }`}
            aria-label="Switch to dark mode"
            aria-pressed={theme === "dark"}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">dark_mode</span>
          </Button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant/20">
          <Button
            onClick={() => locale !== "en" && setLocale("en")}
            variant={locale === "en" ? "primary" : "ghost"}
            size="xs"
            shape="full"
            className={`min-w-9 ${
              locale === "en"
                ? "text-on-primary shadow-lg"
                : "text-on-surface-variant"
            }`}
          >
            EN
          </Button>
          <Button
            onClick={() => locale !== "id" && setLocale("id")}
            variant={locale === "id" ? "primary" : "ghost"}
            size="xs"
            shape="full"
            className={`min-w-9 ${
              locale === "id"
                ? "text-on-primary shadow-lg"
                : "text-on-surface-variant"
            }`}
          >
            ID
          </Button>
        </div>

        <div className="hidden sm:block h-10 w-px bg-outline-variant/20 mx-1" />

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/75">
              search
            </span>
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              className="pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-full text-sm w-48 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            shape="full"
            className="text-on-surface-variant"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </Button>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <Button
              onClick={() => setProfileOpen((v) => !v)}
              variant="outline"
              size="icon"
              shape="full"
              className="border-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
              title={user?.username ?? "Profile"}
              aria-expanded={profileOpen}
              aria-label="Profile menu"
            >
              <span className="material-symbols-outlined">person</span>
            </Button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/10 overflow-hidden z-50 animate-fade-in">
                {user && (
                  <div className="px-4 py-3 border-b border-outline-variant/10">
                    <p className="text-sm font-bold text-on-surface truncate">{user.username}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5">{user.role}</p>
                  </div>
                )}
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className={buttonClasses(
                    { variant: "ghost", size: "sm", fullWidth: true },
                    "justify-start rounded-md px-4",
                  )}
                >
                  <span className="material-symbols-outlined text-base">settings</span>
                  Settings
                </Link>
                <Button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  variant="dangerGhost"
                  size="sm"
                  fullWidth
                  className="justify-start rounded-md px-4"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
