# Megin Fitness

A React Native (Expo) fitness tracking app for a 3-day sustainable workout program with a futuristic, gamified UI design.

## Tech Stack

### Current
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand with persist middleware
- **Storage:** react-native-mmkv
- **Styling:** NativeWind (Tailwind CSS for React Native) + expo-linear-gradient
- **Design:** Futuristic/Cyber gamified theme with neon effects and animations

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ExerciseCard.tsx    # Individual exercise with cyber styling, neon glow effects
│   ├── ProgressBar.tsx     # XP-style mission progress bar with animations
│   ├── WorkoutHeader.tsx   # Cyber-styled day header with scan line effects
│   ├── CyberCard.tsx       # Futuristic card wrapper with corner accents
│   ├── XPBar.tsx           # Gamified experience/level bar
│   ├── LevelBadge.tsx      # Player level display with glow
│   └── AchievementBadge.tsx # Achievement/milestone display

├── screens/             # Full-screen page components
│   ├── MondayScreen.tsx       # Day 1: Power (orange theme)
│   ├── WednesdayScreen.tsx    # Day 2: Survival (green theme)
│   ├── FridayScreen.tsx       # Day 3: Beast (purple theme)
│   ├── HistoryScreen.tsx      # Mission log with cyber styling
│   └── PRScreen.tsx           # Personal records with gold accents

├── store/               # State management (Zustand)
│   └── workoutStore.ts      # Unified store keyed by day + history hooks

├── services/            # External integrations
│   └── mmkv.ts             # MMKV storage for Zustand persist

├── utils/               # Data & utilities
│   ├── mondayWorkoutData.ts      # Monday exercise definitions
│   ├── wednesdayWorkoutData.ts   # Wednesday exercise definitions
│   └── fridayWorkoutData.ts      # Friday exercise definitions

├── types/               # TypeScript definitions
│   └── workout.ts          # Exercise, PersistedState, WorkoutHistoryEntry types

├── theme/               # Design system
│   └── index.ts            # Colors, gradients, level utilities

└── navigation/          # Navigation setup
    └── TabNavigator.tsx    # Mon/Wed/Fri + History tabs
```

## NativeWind / Tailwind CSS Setup

The app uses NativeWind v4 for Tailwind CSS styling in React Native.

### Configuration Files

- `tailwind.config.js` - Extended theme with futuristic colors
- `global.css` - Tailwind directives
- `metro.config.js` - Metro bundler with NativeWind
- `babel.config.js` - Babel preset with NativeWind
- `nativewind-env.d.ts` - TypeScript support

### Using Tailwind Classes

```tsx
// Use className for styling
<View className="flex-1 bg-nightBlack p-4">
  <Text className="text-lg font-bold text-boneWhite tracking-widest">
    Hello World
  </Text>
</View>

// Combine with style prop for dynamic values
<View
  className="p-4 border"
  style={{ borderColor: COLORS.cyberPurple }}
/>
```

### Custom Theme Colors

The Tailwind config extends the theme with custom colors:

```javascript
// Futuristic/Cyber colors
cyberCyan: "#00FFFF"
cyberMagenta: "#FF00FF"
cyberPink: "#FF1493"
cyberBlue: "#0080FF"
cyberPurple: "#8B5CF6"
cyberDark: "#0D0D1A"

// Neon variants
neonGreen: "#39FF14"
neonBlue: "#00D4FF"
neonPink: "#FF00E5"
neonOrange: "#FF6600"
neonYellow: "#FFFF00"

// XP/Level colors
xpBronze: "#CD7F32"
xpSilver: "#C0C0C0"
xpGold: "#FFD700"
xpPlatinum: "#E5E4E2"
xpDiamond: "#B9F2FF"
```

## Gamified Components

### CyberCard

A futuristic card wrapper with corner accents, glow effects, and optional animations.

```tsx
<CyberCard variant="power" glowIntensity="subtle" animated>
  <View className="p-4">
    <Text>Content here</Text>
  </View>
</CyberCard>
```

**Props:**
```typescript
{
  children: React.ReactNode;
  variant?: "default" | "power" | "survival" | "beast" | "gold" | "holo";
  glowIntensity?: "none" | "subtle" | "medium" | "strong";
  animated?: boolean;  // Enable pulse and scanline effects
  style?: ViewStyle;
}
```

### XPBar

Gamified experience bar with level display.

```tsx
<XPBar currentXP={1500} showLevel={true} />
```

**Props:**
```typescript
{
  currentXP: number;
  showLevel?: boolean;
}
```

### LevelBadge

Circular level indicator with pulsing glow.

```tsx
<LevelBadge xp={1500} size="md" showXP />
```

**Props:**
```typescript
{
  xp: number;
  size?: "sm" | "md" | "lg";
  showXP?: boolean;
}
```

### AchievementBadge

Achievement display with shimmer effect.

```tsx
<AchievementBadge
  type="pr"
  title="New Personal Record"
  subtitle="Deadlift"
  value="120kg"
  unlocked={true}
/>
```

**Props:**
```typescript
{
  type: "workout" | "streak" | "pr" | "volume" | "level";
  title: string;
  subtitle?: string;
  value?: string | number;
  unlocked?: boolean;
}
```

## Component Props (Updated)

### WorkoutHeader

```typescript
{
  dayLabel: string;    // e.g., "Day 1 of 3"
  dayTitle: string;    // e.g., "MONDAY"
  subtitle: string;    // e.g., "Power - Full Body"
  duration: string;    // e.g., "~50-55 MIN"
  variant?: "power" | "survival" | "beast";  // NEW: Theme variant
}
```

### ProgressBar

```typescript
{
  completedCount: number;
  totalCount: number;
  progress: number;    // 0-1
  variant?: "power" | "survival" | "beast";  // NEW: Theme variant
}
```

### ExerciseCard

```typescript
{
  ex: Exercise;
  checked: boolean;
  setsDone?: boolean[];
  weights?: number[];
  onToggle: () => void;
  onToggleSet: (setIndex: number) => void;
  onSetWeight?: (setIndex: number, weight: number) => void;
  primaryColor?: string;
}
```

## Theme Utilities

The theme exports utility functions for gamification:

```typescript
import { getLevelFromXP, getXPProgress, LEVEL_THRESHOLDS } from "../theme";

// Get level from XP
const level = getLevelFromXP(1500);  // Returns 5

// Get progress to next level
const { current, next, progress } = getXPProgress(1500);
// current: 1000 (current level threshold)
// next: 1500 (next level threshold)
// progress: 1.0 (100% to next level)
```

## Gradient Definitions

Predefined gradients for consistent styling:

```typescript
import { GRADIENTS } from "../theme";

// Available gradients:
GRADIENTS.xpBar         // Purple to green (XP bar)
GRADIENTS.holoCard      // Holographic effect
GRADIENTS.cyberHeader   // Dark cyber background
GRADIENTS.achievement   // Gold achievement
GRADIENTS.levelUp       // Level up celebration
GRADIENTS.mondayPower   // Orange power theme
GRADIENTS.wednesdaySurvival  // Green survival theme
GRADIENTS.fridayBeast   // Purple beast theme
```

## Visual Design System

### Corner Accents

All cards use corner accent decorations for the futuristic feel:

```tsx
{/* Corner accents */}
<View
  className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
  style={{ borderColor: accentColor }}
/>
```

### Neon Glow Effects

Animated glow overlays on completion:

```tsx
<Animated.View
  style={{
    backgroundColor: glowColor,
    opacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.3],
    }),
  }}
/>
```

### Scanline Animations

Futuristic scanline sweep effect:

```tsx
<Animated.View
  className="absolute left-0 right-0 h-px"
  style={{
    backgroundColor: COLORS.cyberCyan,
    transform: [{ translateY: scanlineAnim }],
  }}
/>
```

## Color Themes by Day

| Day       | Primary Color    | Hex       | Variant    |
|-----------|------------------|-----------|------------|
| Monday    | infectedOrange   | #FF4500   | power      |
| Wednesday | toxicGreen       | #39FF14   | survival   |
| Friday    | beastPurple      | #4a0080   | beast      |
| History   | neonBlue         | #00D4FF   | default    |
| PRs       | xpGold           | #FFD700   | gold       |

## Available Colors (COLORS)

```typescript
// Original colors
bloodRed: "#8B0000"
neonRed: "#ff1a1a"
toxicGreen: "#39FF14"
beastPurple: "#4a0080"
infectedOrange: "#FF4500"
nightBlack: "#0a0a0a"
concreteGray: "#1a1a1a"
steelGray: "#2d2d2d"
boneWhite: "#e8e4d9"
longevityGold: "#D4AF37"
completeGreen: "#2ecc71"
muted: "#888"

// Futuristic/Cyber colors
cyberCyan: "#00FFFF"
cyberMagenta: "#FF00FF"
cyberPink: "#FF1493"
cyberBlue: "#0080FF"
cyberPurple: "#8B5CF6"
cyberDark: "#0D0D1A"

// Neon variants
neonGreen: "#39FF14"
neonBlue: "#00D4FF"
neonPink: "#FF00E5"
neonOrange: "#FF6600"
neonYellow: "#FFFF00"

// XP/Level colors
xpBronze: "#CD7F32"
xpSilver: "#C0C0C0"
xpGold: "#FFD700"
xpPlatinum: "#E5E4E2"
xpDiamond: "#B9F2FF"
```

## Running the App

```bash
npm install
npx expo start
```

## Current Status

- [x] Monday - Power Day (Lower Emphasis)
- [x] Wednesday - Survival Day (Zone 2 + Core + Mobility)
- [x] Friday - Beast Day (Heavy Compounds)
- [x] Tab Navigation between days
- [x] Weight tracking per set
- [x] Historical data / workout history
- [x] Personal records (PRs) tracking
- [x] NativeWind (Tailwind CSS) integration
- [x] Futuristic/Cyber gamified UI design
- [x] Animated neon glow effects
- [x] Scanline and pulse animations
- [x] XP/Level system components
- [x] CyberCard component with variants
- [x] Achievement badge system
