# Megin Fitness

A React Native (Expo) fitness tracking app for a 3-day sustainable workout program.

## Tech Stack

### Current
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand with persist middleware
- **Storage:** react-native-mmkv
- **Styling:** React Native StyleSheet + expo-linear-gradient

### Completed
- [x] Expo SDK 54 (managed workflow)
- [x] Zustand (state)
- [x] MMKV (storage)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ExerciseCard.tsx    # Individual exercise with checkbox, sets tracker
│   ├── ProgressBar.tsx     # Workout completion progress
│   └── WorkoutHeader.tsx   # Day label, title, duration header
│
├── screens/             # Full-screen page components
│   ├── MondayScreen.tsx       # Day 1: Power (orange theme)
│   ├── WednesdayScreen.tsx    # Day 2: Survival (green theme)
│   ├── FridayScreen.tsx       # Day 3: Beast (purple theme)
│   └── StatsScreen.tsx        # Placeholder for future stats
│
├── store/               # State management (Zustand)
│   └── workoutStore.ts      # Unified store keyed by day
│
├── services/            # External integrations
│   └── mmkv.ts             # MMKV storage for Zustand persist
│
├── utils/               # Data & utilities
│   ├── mondayWorkoutData.ts      # Monday exercise definitions
│   ├── wednesdayWorkoutData.ts   # Wednesday exercise definitions
│   └── fridayWorkoutData.ts      # Friday exercise definitions
│
├── types/               # TypeScript definitions
│   └── workout.ts          # Exercise, PersistedState types
│
├── theme/               # Design system
│   └── index.ts            # Color palette (COLORS)
│
└── navigation/          # Navigation setup
    └── TabNavigator.tsx    # Placeholder for Mon/Wed/Fri tabs
```

## Key Patterns

### Adding a New Workout Day

1. **Create workout data** in `src/utils/{day}WorkoutData.ts`:
   ```typescript
   import { Exercise } from "../types/workout";
   export const {DAY}_EXERCISES: Exercise[] = [...];
   ```

2. **Add day to unified store** in `src/store/workoutStore.ts`:
   - Add day ID to `DayId` type
   - Add default state in `getDefaultDayState()`
   - Export `use{Day}WorkoutStore()` hook

3. **Create screen** in `src/screens/{Day}Screen.tsx`:
   - Import day-specific hook from `../store/workoutStore`
   - Set `primaryColor` prop on ExerciseCard for day theme

### Exercise Data Structure

```typescript
type Exercise = {
  id: string;                    // Unique ID, prefix with day (e.g., "mon-ex1")
  section: "warmup" | "main" | "finisher";
  variant?: "default" | "beast" | "pull" | "longevity";  // Affects styling
  name: string;
  badge?: { text: string; kind: "beast" | "pull" | "core" };
  detail?: string;               // Subtitle/instruction
  rightTop: string;              // Sets x reps or duration
  rightBottom?: string;          // Rest period
  setsCount?: number;            // 0 = no set tracker, >0 = show buttons
};
```

### Color Themes by Day

| Day       | Primary Color    | Hex       |
|-----------|------------------|-----------|
| Monday    | infectedOrange   | #FF4500   |
| Wednesday | toxicGreen       | #39FF14   |
| Friday    | beastPurple      | #4a0080   |

Pull/longevity exercises always use `longevityGold` (#D4AF37).

### Storage Key (MMKV)

All workout state is stored in a single key: `"workouts-v1"`

State structure: `{ days: { monday: {...}, wednesday: {...}, friday: {...} } }`

## Component Props

### ExerciseCard
```typescript
{
  ex: Exercise;
  checked: boolean;
  setsDone?: boolean[];
  onToggle: () => void;
  onToggleSet: (setIndex: number) => void;
  primaryColor?: string;  // Day-specific accent color
}
```

### WorkoutHeader
```typescript
{
  dayLabel: string;    // e.g., "Day 1 of 3"
  dayTitle: string;    // e.g., "MONDAY"
  subtitle: string;    // e.g., "Power - Full Body"
  duration: string;    // e.g., "~50-55 MIN"
}
```

### ProgressBar
```typescript
{
  completedCount: number;
  totalCount: number;
  progress: number;    // 0-1
}
```

## Available Colors (COLORS)

```typescript
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
- [ ] Stats/History screen
