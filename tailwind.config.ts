import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: [
          "var(--font-geist-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      colors: {
        accent: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          100: "#E0E7FF",
          600: "#4F46E5",
          700: "#4338CA",
        },
        surface: {
          primary: "#FFFFFF",
          secondary: "#FAFAFA",
        },
        border: {
          DEFAULT: "#E5E5E5",
          emphasis: "#D4D4D4",
        },
      },
      textColor: {
        primary: "#0A0A0A",
        secondary: "#525252",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
