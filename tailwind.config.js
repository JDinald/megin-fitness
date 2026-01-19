/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original theme colors
        bloodRed: "#8B0000",
        neonRed: "#ff1a1a",
        toxicGreen: "#39FF14",
        beastPurple: "#4a0080",
        infectedOrange: "#FF4500",
        nightBlack: "#0a0a0a",
        concreteGray: "#1a1a1a",
        steelGray: "#2d2d2d",
        boneWhite: "#e8e4d9",
        longevityGold: "#D4AF37",
        completeGreen: "#2ecc71",
        muted: "#888888",

        // Futuristic/Gamified colors
        cyber: {
          cyan: "#00FFFF",
          magenta: "#FF00FF",
          pink: "#FF1493",
          blue: "#0080FF",
          purple: "#8B5CF6",
          dark: "#0D0D1A",
        },
        neon: {
          green: "#39FF14",
          blue: "#00D4FF",
          pink: "#FF00E5",
          orange: "#FF6600",
          yellow: "#FFFF00",
        },
        xp: {
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          gold: "#FFD700",
          platinum: "#E5E4E2",
          diamond: "#B9F2FF",
        },
      },
    },
  },
  plugins: [],
};
