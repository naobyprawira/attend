"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/translations";

const HEADER_TABS: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.dashboard" },
  { href: "/live", labelKey: "nav.liveView" },
  { href: "/analytics", labelKey: "nav.analytics" },
];

const PAGE_TITLE_MAP: Record<string, TranslationKey> = {
  "/": "nav.dashboard",
  "/live": "nav.liveView",
  "/cameras": "cameras.title",
  "/persons": "nav.persons",
  "/events": "events.title",
  "/settings": "settings.title",
  "/attendance": "nav.attendance",
  "/shifts": "nav.shifts",
  "/analytics": "nav.analytics",
  "/reports": "nav.reports",
  "/zones": "nav.zones",
  "/visitors": "nav.visitors",
  "/violations": "nav.violations",
};

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const titleKey = PAGE_TITLE_MAP[pathname] ?? "nav.dashboard";
  const pageTitle = t(titleKey);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(27,28,29,0.08)] flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-bold tracking-tighter text-rose-900 dark:text-rose-100">
          {pageTitle}
        </h2>
        <nav className="hidden md:flex items-center gap-6 tracking-tight">
          {HEADER_TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`transition-all ${
                  active
                    ? "text-rose-900 dark:text-rose-400 border-b-2 border-rose-800 font-semibold"
                    : "text-slate-500 dark:text-slate-500 hover:text-rose-700"
                }`}
              >
                {t(tab.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center bg-surface-container-high dark:bg-dark-surface-container-high rounded-full p-1 border border-outline-variant/20 dark:border-dark-outline-variant/20">
          <button
            onClick={() => theme !== "light" && toggleTheme()}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              mounted && theme === "light"
                ? "bg-primary text-white shadow-lg"
                : "text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">light_mode</span>
          </button>
          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              mounted && theme === "dark"
                ? "bg-primary text-white shadow-lg"
                : "text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">dark_mode</span>
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-surface-container-high dark:bg-dark-surface-container-high rounded-full p-1 border border-outline-variant/20 dark:border-dark-outline-variant/20">
          <button
            onClick={() => locale !== "en" && setLocale("en")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              locale === "en"
                ? "bg-primary text-white shadow-lg"
                : "text-slate-500"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => locale !== "id" && setLocale("id")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              locale === "id"
                ? "bg-primary text-white shadow-lg"
                : "text-slate-500"
            }`}
          >
            ID
          </button>
        </div>

        <div className="h-10 w-px bg-outline-variant/20 mx-2" />

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-dark-surface-container border-none rounded-full text-sm w-48 focus:ring-2 focus:ring-primary/20 transition-all dark:text-dark-on-surface"
            />
          </div>

          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface-container rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Profile */}
          <div className="h-10 w-10 rounded-full border-2 border-primary/30 overflow-hidden bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
