"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/auth/context";
import type { TranslationKey } from "@/lib/i18n/translations";

type NavEntry =
  | { type: "section"; labelKey: TranslationKey }
  | { type: "link"; href: string; labelKey: TranslationKey; icon: string };

const NAV_ITEMS: NavEntry[] = [
  { type: "section", labelKey: "nav.monitor" },
  { type: "link", href: "/", labelKey: "nav.dashboard", icon: "dashboard" },
  { type: "link", href: "/live", labelKey: "nav.liveView", icon: "videocam" },
  { type: "link", href: "/cameras", labelKey: "nav.cameras", icon: "settings_video_camera" },

  { type: "section", labelKey: "nav.intelligence" },
  { type: "link", href: "/people-counting", labelKey: "nav.peopleCounting", icon: "counter_1" },
  { type: "link", href: "/heatmap", labelKey: "nav.heatmap", icon: "thermostat" },
  { type: "link", href: "/search", labelKey: "nav.smartSearch", icon: "person_search" },
  { type: "link", href: "/anomaly", labelKey: "nav.anomaly", icon: "report" },

  { type: "section", labelKey: "nav.manage" },
  { type: "link", href: "/persons", labelKey: "nav.persons", icon: "group" },
  { type: "link", href: "/attendance", labelKey: "nav.attendance", icon: "event_available" },
  { type: "link", href: "/shifts", labelKey: "nav.shifts", icon: "schedule" },
  { type: "link", href: "/visitors", labelKey: "nav.visitors", icon: "badge" },

  { type: "section", labelKey: "nav.analyze" },
  { type: "link", href: "/event-center", labelKey: "nav.eventCenter", icon: "notification_important" },
  { type: "link", href: "/analytics", labelKey: "nav.analytics", icon: "insights" },
  { type: "link", href: "/reports", labelKey: "nav.reports", icon: "assessment" },
  { type: "link", href: "/violations", labelKey: "nav.violations", icon: "gpp_bad" },

  { type: "section", labelKey: "nav.infrastructure" },
  { type: "link", href: "/zones", labelKey: "nav.zones", icon: "map" },
  { type: "link", href: "/sites", labelKey: "nav.sites", icon: "domain" },
  { type: "link", href: "/cross-site", labelKey: "nav.crossSite", icon: "hub" },
  { type: "link", href: "/network", labelKey: "nav.network", icon: "lan" },

  { type: "section", labelKey: "nav.admin" },
  { type: "link", href: "/users", labelKey: "nav.users", icon: "manage_accounts" },
  { type: "link", href: "/permissions", labelKey: "nav.permissions", icon: "admin_panel_settings" },
  { type: "link", href: "/system-logs", labelKey: "nav.systemLogs", icon: "terminal" },
  { type: "link", href: "/backups", labelKey: "nav.backups", icon: "backup" },
  { type: "link", href: "/api-docs", labelKey: "nav.apiDocs", icon: "menu_book" },
  { type: "link", href: "/webhooks", labelKey: "nav.webhooks", icon: "webhook" },
  { type: "link", href: "/api-keys", labelKey: "nav.apiKeys", icon: "vpn_key" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();
  const { logout } = useAuth();

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-black/80 text-white rounded-lg backdrop-blur-md"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[55] bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`h-screen w-64 fixed left-0 top-0 z-[56] bg-black flex flex-col py-6 overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-rose-500 font-black text-xl tracking-tighter">{t("brand.title")}</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
              {t("brand.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map((item, idx) => {
            if (item.type === "section") {
              return (
                <div
                  key={`section-${item.labelKey}`}
                  className={`px-6 pt-5 pb-2 text-[9px] font-black tracking-[0.25em] uppercase text-slate-500 ${
                    idx === 0 ? "pt-0" : ""
                  }`}
                >
                  {t(item.labelKey)}
                </div>
              );
            }
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-6 py-2.5 flex items-center gap-3 transition-all duration-200 text-sm font-medium tracking-wide uppercase ${
                  active
                    ? "bg-rose-900/40 text-rose-100 border-r-4 border-rose-600"
                    : "text-slate-400 opacity-70 hover:opacity-100 hover:bg-slate-800/50"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${active ? "text-rose-500" : ""}`}>
                  {item.icon}
                </span>
                <span className="text-xs">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 tracking-widest uppercase hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            {t("nav.newScan")}
          </button>
          <div className="mt-6 pt-6 border-t border-slate-800/50 space-y-1">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className="text-slate-400 opacity-70 hover:opacity-100 px-2 py-3 flex items-center gap-3 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t("nav.settings")}</span>
            </Link>
            <button
              onClick={() => logout()}
              className="text-slate-400 opacity-70 hover:opacity-100 px-2 py-3 flex items-center gap-3 transition-all duration-200 w-full text-left"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t("nav.logout")}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
