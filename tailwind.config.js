/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
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
        holo: {
          start: "#FF00FF",
          mid: "#00FFFF",
          end: "#FF00FF",
        },
        xp: {
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          gold: "#FFD700",
          platinum: "#E5E4E2",
          diamond: "#B9F2FF",
        },
        level: {
          1: "#39FF14",
          2: "#00D4FF",
          3: "#8B5CF6",
          4: "#FF00E5",
          5: "#FFD700",
        },
      },
      fontFamily: {
        cyber: ["System"],
      },
      borderRadius: {
        cyber: "2px",
        hex: "4px",
      },
      boxShadow: {
        neon: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
        "neon-sm": "0 0 5px currentColor, 0 0 10px currentColor",
        cyber: "0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)",
        "cyber-purple": "0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)",
        "cyber-green": "0 0 15px rgba(57, 255, 20, 0.5), 0 0 30px rgba(57, 255, 20, 0.3)",
        "cyber-orange": "0 0 15px rgba(255, 69, 0, 0.5), 0 0 30px rgba(255, 69, 0, 0.3)",
        "cyber-gold": "0 0 15px rgba(212, 175, 55, 0.5), 0 0 30px rgba(212, 175, 55, 0.3)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "scan-line": "scanLine 3s linear infinite",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
        "holo-gradient": "linear-gradient(135deg, #FF00FF 0%, #00FFFF 50%, #FF00FF 100%)",
        "xp-gradient": "linear-gradient(90deg, #4a0080 0%, #39FF14 100%)",
        "cyber-gradient": "linear-gradient(180deg, #0D0D1A 0%, #1a1a2e 100%)",
      },
    },
  },
  plugins: [],
};
