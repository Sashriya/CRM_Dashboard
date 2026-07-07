/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        paper: "#F7F7F4",
        surface: "#FFFFFF",
        line: "#E5E2DB",
        indigo: {
          DEFAULT: "#332E91",
          dark: "#211D5F",
          light: "#4A44B8",
        },
        signal: {
          DEFAULT: "#FF6A39",
          soft: "#FFE4D6",
        },
        mint: {
          DEFAULT: "#1F9D77",
          soft: "#DCF3EA",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,23,31,0.04), 0 8px 24px -12px rgba(20,23,31,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
