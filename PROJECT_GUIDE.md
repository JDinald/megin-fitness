# Megin Fitness

A React Native (Expo) fitness tracking app for a 3-day sustainable workout program.

## Tech Stack

### Current
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand with persist middleware
- **Storage:** react-native-mmkv
- **Styling:** React Native StyleSheet + expo-linear-gradient

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ExerciseCard.tsx    # Individual exercise with checkbox, sets tracker, weight input
│   ├── ProgressBar.tsx     # Workout completion progress
│   └── WorkoutHeader.tsx   # Day label, title, duration header
│
├── screens/             # Full-screen page components
│   ├── MondayScreen.tsx       # Day 1: Power (orange theme)
│   ├── WednesdayScreen.tsx    # Day 2: Survival (green theme)
│   ├── FridayScreen.tsx       # Day 3: Beast (purple theme)
│   ├── HistoryScreen.tsx      # Workout history log
│   └── PRScreen.tsx           # Personal records display
│
├── store/               # State management (Zustand)
│   └── workoutStore.ts      # Unified store keyed by day + history hooks
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
│   └── workout.ts          # Exercise, PersistedState, WorkoutHistoryEntry types
│
├── theme/               # Design system
│   └── index.ts            # Color palette (COLORS)
│
└── navigation/          # Navigation setup
    └── TabNavigator.tsx    # Mon/Wed/Fri + History tabs
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
  repsPerSet?: number;           // Reps per set (for volume calculation)
};
```

### Color Themes by Day

| Day       | Primary Color    | Hex       |
|-----------|------------------|-----------|
| Monday    | infectedOrange   | #FF4500   |
| Wednesday | toxicGreen       | #39FF14   |
| Friday    | beastPurple      | #4a0080   |
| History   | completeGreen    | #2ecc71   |
| PRs       | longevityGold    | #D4AF37   |

Pull/longevity exercises always use `longevityGold` (#D4AF37).

### Storage Key (MMKV)

All workout state is stored in a single key: `"workouts-v1"`

State structure:
```typescript
{
  days: {
    monday: { checked, setsDone, weights },
    wednesday: { checked, setsDone, weights, cardioOption },
    friday: { checked, setsDone, weights }
  },
  history: WorkoutHistoryEntry[],  // Completed workout log
  personalRecords: PersonalRecords  // PRs for each exercise
}
```

## Component Props

### ExerciseCard
```typescript
{
  ex: Exercise;
  checked: boolean;
  setsDone?: boolean[];
  weights?: number[];              // Weight in kg per set
  onToggle: () => void;
  onToggleSet: (setIndex: number) => void;
  onSetWeight?: (setIndex: number, weight: number) => void;
  primaryColor?: string;           // Day-specific accent color
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

## Weight Tracking

Each exercise with `repsPerSet` defined displays a weight input field (in kg) below each set button. Weights are:
- Persisted per set in the store
- Used for calculating training volume (weight × reps)
- Saved to workout history when completing a workout

### Adding Weight Tracking to an Exercise

Add `repsPerSet` to the exercise definition:
```typescript
{
  id: "mon-ex5",
  name: "Barbell Back Squat",
  rightTop: "4 × 5",
  setsCount: 4,
  repsPerSet: 5  // Enables weight input
}
```

## Workout History

The app tracks completed workouts in a history log. When you complete a workout, it gets saved with all stats and exercise data.

### Completing a Workout

Each day screen has a "Complete Workout" button that appears when at least one exercise is started. Completing a workout:
1. Saves the workout data to history
2. Resets the day's progress to start fresh

### Using History in Code

```typescript
import { useWorkoutHistory } from "../store/workoutStore";

function MyComponent() {
  const { history, deleteEntry } = useWorkoutHistory();

  // history: WorkoutHistoryEntry[] - array of completed workouts
  // deleteEntry: (id: string) => void - remove an entry
}
```

### History Types

```typescript
type WorkoutHistoryEntry = {
  id: string;                    // Unique ID (e.g., "monday-1704067200000")
  dayId: "monday" | "wednesday" | "friday";
  completedAt: string;           // ISO date string
  duration?: number;             // Duration in minutes (optional)
  stats: {
    totalVolume: number;
    totalSets: number;
    totalReps: number;
    averageWeightPerRep: number;
  };
  exerciseData: {
    exerciseId: string;
    exerciseName: string;
    setsCompleted: number;
    totalReps: number;
    weights: number[];
    totalVolume: number;
  }[];
};
```

### History Screen Features

- **All Time Totals**: Total workouts, volume, and sets across all history
- **Expandable Entries**: Tap to expand and see full workout details
- **Delete Entries**: Remove individual history entries
- **Per-Exercise Breakdown**: See weights and reps for each exercise

## Personal Records (PRs)

The app automatically tracks personal records when completing workouts. PRs are calculated and updated when you save a workout to history.

### What Gets Tracked

- **Max Weight**: Heaviest single-set weight for each exercise
- **Max Volume**: Best total volume for each exercise in a single workout
- **Best Workout**: Highest total volume achieved in any single workout session

### Using PRs in Code

```typescript
import { usePersonalRecords } from "../store/workoutStore";

function MyComponent() {
  const { personalRecords, exercisePRs } = usePersonalRecords();

  // personalRecords: PersonalRecords - full PR data structure
  // exercisePRs: ExercisePR[] - array of per-exercise PRs
}
```

### PR Types

```typescript
type ExercisePR = {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;       // Heaviest single-set weight
  maxWeightDate: string;   // ISO date string
  maxVolume: number;       // Best total volume in a single workout
  maxVolumeDate: string;   // ISO date string
};

type PersonalRecords = {
  exercises: Record<string, ExercisePR>;  // keyed by exerciseId
  bestWorkoutVolume: number;              // Best single-workout total volume
  bestWorkoutVolumeDate: string | null;   // ISO date string
  bestWorkoutVolumeDay: "monday" | "wednesday" | "friday" | null;
};
```

### PR Screen Features

- **Best Workout**: Highlights the best single-workout volume with day and date
- **Exercise PRs**: Lists all exercises with recorded PRs, sorted by max weight
- **Max Weight**: Shows heaviest weight used for each exercise
- **Max Volume**: Shows best volume per exercise in a single workout

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
- [x] Weight tracking per set
- [x] Historical data / workout history
- [x] Personal records (PRs) tracking
