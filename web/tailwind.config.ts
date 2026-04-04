import type { Config } from "tailwindcss";

/**
 * Color tokens use CSS custom properties defined in globals.css.
 * They auto-switch between light/dark — no `dark:` prefix needed
 * for surface, on-surface, or outline colors.
 */
function cv(name: string) {
  return `rgb(var(--color-${name}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        headline: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        /* ── Brand ───────────────────────────────────────── */
        primary: cv("primary"),
        "primary-container": cv("primary-container"),
        "primary-fixed": "#ffd8eb",
        "primary-fixed-dim": "#ffaedb",
        "on-primary": cv("on-primary"),
        "on-primary-container": cv("on-primary-container"),
        "on-primary-fixed": "#3c002b",
        "on-primary-fixed-variant": "#7d2060",

        secondary: cv("secondary"),
        "secondary-container": cv("secondary-container"),
        "secondary-fixed": "#e3e0f2",
        "secondary-fixed-dim": "#c7c5d6",
        "on-secondary": cv("on-secondary"),
        "on-secondary-container": "#646372",
        "on-secondary-fixed": "#1a1a27",
        "on-secondary-fixed-variant": "#464553",

        tertiary: "#204a00",
        "tertiary-container": "#2e6400",
        "tertiary-fixed": "#b4f485",
        "tertiary-fixed-dim": "#99d76c",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#a1e074",
        "on-tertiary-fixed": "#0b2000",
        "on-tertiary-fixed-variant": "#245100",

        error: cv("error"),
        "error-container": "#ffdad6",
        "on-error": cv("on-error"),
        "on-error-container": "#93000a",

        /* ── Surfaces (token-driven, auto-switch) ───────── */
        surface: cv("surface"),
        "surface-dim": cv("surface-dim"),
        "surface-bright": cv("surface-bright"),
        "surface-variant": cv("surface-variant"),
        "surface-tint": cv("surface-tint"),
        "surface-container": cv("surface-container"),
        "surface-container-low": cv("surface-container-low"),
        "surface-container-high": cv("surface-container-high"),
        "surface-container-highest": cv("surface-container-highest"),
        "surface-container-lowest": cv("surface-container-lowest"),

        /* ── Content ─────────────────────────────────────── */
        "on-surface": cv("on-surface"),
        "on-surface-variant": cv("on-surface-variant"),
        "on-background": cv("on-surface"),
        background: cv("surface"),

        /* ── Outlines ────────────────────────────────────── */
        outline: cv("outline"),
        "outline-variant": cv("outline-variant"),

        /* ── Inverse ─────────────────────────────────────── */
        "inverse-surface": "#303031",
        "inverse-on-surface": "#f2f0f1",
        "inverse-primary": "#ffaedb",

        /* ── Legacy dark aliases (compat) ───────────────── */
        "dark-surface": cv("surface"),
        "dark-surface-variant": cv("surface-variant"),
        "dark-surface-container": cv("surface-container"),
        "dark-surface-container-low": cv("surface-container-low"),
        "dark-surface-container-high": cv("surface-container-high"),
        "dark-surface-container-highest": cv("surface-container-highest"),
        "dark-surface-container-lowest": cv("surface-container-lowest"),
        "dark-on-surface": cv("on-surface"),
        "dark-on-surface-variant": cv("on-surface-variant"),
        "dark-outline-variant": cv("outline-variant"),

        /* ── Sidebar (auto-switch) ───────────────────────── */
        sidebar: cv("sidebar"),
        "sidebar-on": cv("sidebar-on"),
        "sidebar-muted": cv("sidebar-muted"),
        "sidebar-border": cv("sidebar-border"),
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(100%)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "pulse-live": "pulse-live 1.5s infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "slide-out-right": "slide-out-right 0.3s ease-in forwards",
        "fade-in": "fade-in 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
