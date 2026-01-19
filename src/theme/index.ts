export const COLORS = {
  // Original colors
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
  muted: "#888",

  // Futuristic/Cyber colors
  cyberCyan: "#00FFFF",
  cyberMagenta: "#FF00FF",
  cyberPink: "#FF1493",
  cyberBlue: "#0080FF",
  cyberPurple: "#8B5CF6",
  cyberDark: "#0D0D1A",

  // Neon variants
  neonGreen: "#39FF14",
  neonBlue: "#00D4FF",
  neonPink: "#FF00E5",
  neonOrange: "#FF6600",
  neonYellow: "#FFFF00",

  // XP/Level colors
  xpBronze: "#CD7F32",
  xpSilver: "#C0C0C0",
  xpGold: "#FFD700",
  xpPlatinum: "#E5E4E2",
  xpDiamond: "#B9F2FF",
};

// Gradient definitions for components
export const GRADIENTS = {
  xpBar: ["#4a0080", "#39FF14"] as const,
  holoCard: ["#FF00FF", "#00FFFF", "#FF00FF"] as const,
  cyberHeader: ["#0D0D1A", "#1a1a2e"] as const,
  achievement: ["#FFD700", "#FF6600"] as const,
  levelUp: ["#8B5CF6", "#FF00E5"] as const,
  mondayPower: ["#FF4500", "#FF6600"] as const,
  wednesdaySurvival: ["#39FF14", "#00D4FF"] as const,
  fridayBeast: ["#4a0080", "#8B5CF6"] as const,
};

// Level thresholds for gamification
export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPProgress(xp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 1000;
  const progress = (xp - currentThreshold) / (nextThreshold - currentThreshold);
  return { current: currentThreshold, next: nextThreshold, progress: Math.min(progress, 1) };
}
