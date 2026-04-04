"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/auth/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { Button, buttonClasses } from "@/components/ui/Button";

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
      <Button
        onClick={() => setMobileOpen(true)}
        variant="secondary"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-[60] bg-surface-container/80 backdrop-blur-md"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </Button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[55] bg-on-surface/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`h-screen w-64 fixed left-0 top-0 z-[56] bg-sidebar border-r border-sidebar-border flex flex-col py-6 overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-primary font-black text-xl tracking-tighter">{t("brand.title")}</h1>
            <p className="text-sidebar-muted text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
              {t("brand.subtitle")}
            </p>
          </div>
          <Button
            onClick={() => setMobileOpen(false)}
            variant="ghost"
            size="iconSm"
            className="lg:hidden text-sidebar-muted hover:text-sidebar-on"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map((item, idx) => {
            if (item.type === "section") {
              return (
                <div
                  key={`section-${item.labelKey}`}
                  className={`px-6 pt-5 pb-2 text-[9px] font-black tracking-[0.25em] uppercase text-sidebar-muted ${
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
                className={`px-6 py-2.5 flex items-center gap-3 transition-all duration-200 text-sm font-medium tracking-wide ${
                  active
                    ? "bg-primary/10 text-primary border-r-4 border-primary"
                    : "text-sidebar-muted hover:text-sidebar-on hover:bg-surface-container/50"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${active ? "text-primary" : ""}`}>
                  {item.icon}
                </span>
                <span className="text-xs">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <Button
            variant="primary"
            size="md"
            fullWidth
            uppercase
            className="justify-center"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            {t("nav.newScan")}
          </Button>
          <div className="mt-6 pt-6 border-t border-sidebar-border space-y-1">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={buttonClasses(
                { variant: "ghost", size: "sm", fullWidth: true },
                "justify-start px-2 text-sidebar-muted hover:text-sidebar-on",
              )}
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t("nav.settings")}</span>
            </Link>
            <Button
              onClick={() => logout()}
              variant="ghost"
              size="sm"
              fullWidth
              className="justify-start px-2 text-sidebar-muted hover:text-sidebar-on"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
