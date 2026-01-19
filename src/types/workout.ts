export type Exercise = {
  id: string;
  section: "warmup" | "main" | "finisher";
  variant?: "default" | "beast" | "pull" | "longevity";
  name: string;
  badge?: { text: string; kind: "beast" | "pull" | "core" };
  detail?: string;
  rightTop: string;
  rightBottom?: string;
  setsCount?: number;
  repsPerSet?: number; // Number of reps per set (parsed from rightTop if possible)
};

export type PersistedState = {
  checked: Record<string, boolean>;
  setsDone: Record<string, boolean[]>;
  weights: Record<string, number[]>; // Weight in kg per set for each exercise
};

export type WorkoutStats = {
  totalVolume: number; // Total weight × reps
  totalSets: number;
  totalReps: number;
  averageWeightPerRep: number;
  exerciseStats: ExerciseStats[];
};

export type ExerciseStats = {
  exerciseId: string;
  exerciseName: string;
  totalVolume: number;
  setsCompleted: number;
  totalReps: number;
  weights: number[];
  averageWeight: number;
};

export type WorkoutHistoryEntry = {
  id: string;
  dayId: "monday" | "wednesday" | "friday";
  completedAt: string; // ISO date string
  duration?: number; // Duration in minutes (optional)
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

export type ExercisePR = {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number; // Heaviest single-set weight
  maxWeightDate: string; // ISO date string
  maxVolume: number; // Best total volume in a single workout
  maxVolumeDate: string; // ISO date string
};

export type PersonalRecords = {
  exercises: Record<string, ExercisePR>; // keyed by exerciseId
  bestWorkoutVolume: number; // Best single-workout total volume
  bestWorkoutVolumeDate: string | null; // ISO date string
  bestWorkoutVolumeDay: "monday" | "wednesday" | "friday" | null;
};
