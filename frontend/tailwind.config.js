/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                neo: {
                    // soft blue-gray background/surfaces (dominant in your UI image)
                    bg: {
                        50: "#f7f8fb",
                        100: "#ebedf3",
                        200: "#dce0ed",
                        300: "#ced1e3",
                        400: "#bec0d6",
                        500: "#aeb2c8",
                        600: "#8f93aa",
                        700: "#72737f",
                        800: "#4c4e5c",
                        900: "#2c2e38",
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
                "neo-sm": "4px 4px 10px #bec0d6, -4px -4px 10px #ffffff",
                neo: "8px 8px 16px #bec0d6, -8px -8px 16px #ffffff",
                "neo-lg": "14px 14px 28px #bec0d6, -14px -14px 28px #ffffff",
                "neo-inset": "inset 6px 6px 12px #bec0d6, inset -6px -6px 12px #ffffff",
            },
        },
    },
    plugins: [],
};
