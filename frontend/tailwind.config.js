/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        display: ['"Cherry Bomb One"', "cursive"],
      },
      colors: {
        neo: {
          // soft blue-gray background/surfaces (dominant in your UI image)
          bg: {
            50: "#faf9f6",
            100: "#f5f2e8",
            200: "#ede9d8",
            300: "#e5dfc8",
            400: "#ddd9c8",
            500: "#d1ccb8",
            600: "#b5b09c",
            700: "#999480",
            800: "#7d7964",
            900: "#605c48",
          },

          // lavender/indigo primary (matches the “NEUMORPHIS” + buttons vibe)
          primary: {
            50: "#f1f0fa",
            100: "#e3e1f5",
            200: "#c7c4eb",
            300: "#aba6de",
            400: "#9f9bc6",
            500: "#8c97c9",
            600: "#6b7ab5",
            700: "#555094",
            800: "#3f3a76",
            900: "#2b2758",
          },

          // muted pink accent (from the pastel/pink tones)
          accent: {
            50: "#fbf3f7",
            100: "#f5e2ea",
            200: "#eac3d3",
            300: "#dca7be",
            400: "#cfa0b7",
            500: "#bb88a7",
            600: "#a56f91",
            700: "#865774",
            800: "#614050",
            900: "#3f2a35",
          },
        },
      },

      // neumorphism shadows tuned for neo.bg.100 surfaces
      boxShadow: {
        "neo-sm": "4px 4px 10px #ddd9c8, -4px -4px 10px #ffffff",
        neo: "8px 8px 16px #ddd9c8, -8px -8px 16px #ffffff",
        "neo-lg": "14px 14px 28px #ddd9c8, -14px -14px 28px #ffffff",
        "neo-inset": "inset 6px 6px 12px #ddd9c8, inset -6px -6px 12px #ffffff",
      },
    },
  },
  plugins: [],
};
