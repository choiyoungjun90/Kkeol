/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* =========================
         Font
      ========================= */
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },

      /* =========================
         Radius System (통일)
      ========================= */
      borderRadius: {
        card: "1rem", // 16px (rounded-2xl)
        button: "0.75rem", // 12px
        chip: "0.5rem", // 8px
        modal: "1.5rem", // 24px
      },

      /* =========================
         Shadow / Elevation
      ========================= */
      boxShadow: {
        /* Light mode */
        "elev-1": "0 1px 2px rgba(16,24,40,0.06)",
        "elev-2": "0 4px 12px rgba(16,24,40,0.12)",
        "elev-3": "0 20px 40px rgba(16,24,40,0.25)",

        /* Dark mode (빛 테두리 개념) */
        "dark-elev-1": "0 0 0 1px rgba(255,255,255,0.04)",
        "dark-elev-2": "0 4px 12px rgba(0,0,0,0.45)",
        "dark-elev-3": "0 20px 40px rgba(0,0,0,0.6)",
      },

      /* =========================
         Transition Presets
      ========================= */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
      },
    },
  },
  plugins: [],
};
