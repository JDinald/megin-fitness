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
