import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: "var(--primary)",
      "primary-hover": "var(--primary-hover)",
      "primary-light": "var(--primary-light)",
      surface: "var(--surface)",
      "surface-secondary": "var(--surface-secondary)",
      "surface-dim": "var(--surface-dim)",
      "error-light": "var(--error-light)",
      "success-light": "var(--success-light)",
      "warning-light": "var(--warning-light)",
      "info-light": "var(--info-light)",
      muted: "var(--muted)",
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      display: ["Inter", "system-ui", "sans-serif"],
    },
  },
  plugins: [],
}
export default config