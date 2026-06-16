/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070816",
        panel: "#101326",
        violetSeal: "#8b5cf6",
        ember: "#fb923c",
        roseSeal: "#ec4899",
      },
      boxShadow: {
        glow: "0 0 80px rgba(139, 92, 246, 0.22)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
