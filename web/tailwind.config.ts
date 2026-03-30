import type { Config } from "tailwindcss";

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
        primary: "#751859",
        "primary-container": "#923272",
        "primary-fixed": "#ffd8eb",
        "primary-fixed-dim": "#ffaedb",
        "on-primary": "#ffffff",
        "on-primary-container": "#ffb9df",
        "on-primary-fixed": "#3c002b",
        "on-primary-fixed-variant": "#7d2060",

        secondary: "#5e5d6c",
        "secondary-container": "#e3e0f2",
        "secondary-fixed": "#e3e0f2",
        "secondary-fixed-dim": "#c7c5d6",
        "on-secondary": "#ffffff",
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

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        surface: "#fbf9fa",
        "surface-dim": "#dbd9da",
        "surface-bright": "#fbf9fa",
        "surface-variant": "#e4e2e3",
        "surface-tint": "#9a3979",
        "surface-container": "#efedee",
        "surface-container-low": "#f5f3f4",
        "surface-container-high": "#e9e8e9",
        "surface-container-highest": "#e4e2e3",
        "surface-container-lowest": "#ffffff",

        "on-surface": "#1b1c1d",
        "on-surface-variant": "#53424a",
        "on-background": "#1b1c1d",
        background: "#fbf9fa",

        outline: "#85727b",
        "outline-variant": "#d8c0ca",

        "inverse-surface": "#303031",
        "inverse-on-surface": "#f2f0f1",
        "inverse-primary": "#ffaedb",

        // Dark mode overrides (used with dark: prefix)
        "dark-surface": "#1A1A2E",
        "dark-surface-variant": "#252540",
        "dark-surface-container": "#252540",
        "dark-surface-container-low": "#1A1A2E",
        "dark-surface-container-high": "#2c2c4d",
        "dark-surface-container-highest": "#333355",
        "dark-surface-container-lowest": "#151526",
        "dark-on-surface": "#E5E7EB",
        "dark-on-surface-variant": "#d8c0ca",
        "dark-outline-variant": "#464553",
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
