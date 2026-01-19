import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import { PersistedState, Exercise, WorkoutStats, ExerciseStats, WorkoutHistoryEntry } from "../types/workout";
import { zustandStorage } from "../services/mmkv";
import { MONDAY_EXERCISES } from "../utils/mondayWorkoutData";
import {
  WEDNESDAY_CARDIO_RUN,
  WEDNESDAY_CARDIO_SWIM,
  WEDNESDAY_CORE_EXERCISES,
  WEDNESDAY_MOBILITY_EXERCISES,
  ALL_WEDNESDAY_IDS,
} from "../utils/wednesdayWorkoutData";
import { FRIDAY_EXERCISES } from "../utils/fridayWorkoutData";

export type DayId = "monday" | "wednesday" | "friday";
export type CardioOption = "run" | "swim";

interface DayState extends PersistedState {
  cardioOption?: CardioOption;
}

interface WorkoutStoreState {
  days: Record<DayId, DayState>;
  history: WorkoutHistoryEntry[];
  toggleExercise: (day: DayId, id: string) => void;
  toggleSet: (day: DayId, ex: Exercise, setIndex: number) => void;
  setWeight: (day: DayId, exerciseId: string, setIndex: number, weight: number) => void;
  setCardioOption: (option: CardioOption) => void;
  resetDay: (day: DayId) => void;
  saveWorkoutToHistory: (day: DayId) => void;
  deleteHistoryEntry: (entryId: string) => void;
}

function getDefaultDayState(day: DayId): DayState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};
  const weights: Record<string, number[]> = {};

  if (day === "monday") {
    for (const ex of MONDAY_EXERCISES) {
      checked[ex.id] = false;
      if (ex.setsCount && ex.setsCount > 0) {
        setsDone[ex.id] = Array(ex.setsCount).fill(false);
        weights[ex.id] = Array(ex.setsCount).fill(0);
      }
    }
    return { checked, setsDone, weights };
  }

  if (day === "wednesday") {
    for (const id of ALL_WEDNESDAY_IDS) {
      checked[id] = false;
    }
    for (const ex of WEDNESDAY_CORE_EXERCISES) {
      if (ex.setsCount && ex.setsCount > 0) {
        setsDone[ex.id] = Array(ex.setsCount).fill(false);
        weights[ex.id] = Array(ex.setsCount).fill(0);
      }
    }
    return { checked, setsDone, weights, cardioOption: "run" };
  }

  // friday
  for (const ex of FRIDAY_EXERCISES) {
    checked[ex.id] = false;
    if (ex.setsCount && ex.setsCount > 0) {
      setsDone[ex.id] = Array(ex.setsCount).fill(false);
      weights[ex.id] = Array(ex.setsCount).fill(0);
    }
  }
  return { checked, setsDone, weights };
}

function getDefaultState(): Record<DayId, DayState> {
  return {
    monday: getDefaultDayState("monday"),
    wednesday: getDefaultDayState("wednesday"),
    friday: getDefaultDayState("friday"),
  };
}

type PersistedWorkoutState = { days: Record<DayId, DayState>; history: WorkoutHistoryEntry[] };

function getExercisesForDay(day: DayId): Exercise[] {
  switch (day) {
    case "monday":
      return MONDAY_EXERCISES;
    case "wednesday":
      return WEDNESDAY_CORE_EXERCISES;
    case "friday":
      return FRIDAY_EXERCISES;
  }
}

function getDayLabel(day: DayId): string {
  switch (day) {
    case "monday":
      return "Monday - Power";
    case "wednesday":
      return "Wednesday - Core";
    case "friday":
      return "Friday - Beast";
  }
}

const useWorkoutStoreInternal = create<WorkoutStoreState>()(
  persist(
    (set, get) => ({
      days: getDefaultState(),
      history: [],

      toggleExercise: (day, id) =>
        set((state) => ({
          days: {
            ...state.days,
            [day]: {
              ...state.days[day],
              checked: {
                ...state.days[day].checked,
                [id]: !state.days[day].checked[id],
              },
            },
          },
        })),

      toggleSet: (day, ex, setIndex) =>
        set((state) => {
          if (!ex.setsCount || ex.setsCount <= 0) return state;

          const dayState = state.days[day];
          const current = dayState.setsDone[ex.id] ?? Array(ex.setsCount).fill(false);
          const nextSets = current.slice();
          nextSets[setIndex] = !nextSets[setIndex];
          const allDone = nextSets.every(Boolean);

          return {
            days: {
              ...state.days,
              [day]: {
                ...dayState,
                checked: { ...dayState.checked, [ex.id]: allDone },
                setsDone: { ...dayState.setsDone, [ex.id]: nextSets },
              },
            },
          };
        }),

      setWeight: (day, exerciseId, setIndex, weight) =>
        set((state) => {
          const dayState = state.days[day];
          const currentWeights = dayState.weights[exerciseId] ?? [];
          const newWeights = [...currentWeights];
          newWeights[setIndex] = weight;

          return {
            days: {
              ...state.days,
              [day]: {
                ...dayState,
                weights: { ...dayState.weights, [exerciseId]: newWeights },
              },
            },
          };
        }),

      setCardioOption: (option) =>
        set((state) => ({
          days: {
            ...state.days,
            wednesday: { ...state.days.wednesday, cardioOption: option },
          },
        })),

      resetDay: (day) =>
        set((state) => ({
          days: { ...state.days, [day]: getDefaultDayState(day) },
        })),

      saveWorkoutToHistory: (day) => {
        const state = get();
        const dayState = state.days[day];
        const exercises = getExercisesForDay(day);
        const stats = calculateWorkoutStats(exercises, dayState.setsDone, dayState.weights);

        if (stats.totalSets === 0) return;

        const exerciseData = stats.exerciseStats.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          setsCompleted: ex.setsCompleted,
          totalReps: ex.totalReps,
          weights: ex.weights,
          totalVolume: ex.totalVolume,
        }));

        const entry: WorkoutHistoryEntry = {
          id: `${day}-${Date.now()}`,
          dayId: day,
          completedAt: new Date().toISOString(),
          stats: {
            totalVolume: stats.totalVolume,
            totalSets: stats.totalSets,
            totalReps: stats.totalReps,
            averageWeightPerRep: stats.averageWeightPerRep,
          },
          exerciseData,
        };

        set((state) => ({
          history: [entry, ...state.history],
          days: { ...state.days, [day]: getDefaultDayState(day) },
        }));
      },

      deleteHistoryEntry: (entryId) =>
        set((state) => ({
          history: state.history.filter((entry) => entry.id !== entryId),
        })),
    }),
    {
      name: "workouts-v1",
      storage: zustandStorage,
      partialize: (state): PersistedWorkoutState => ({ days: state.days, history: state.history }),
      merge: (persisted, current) => {
        const def = getDefaultState();
        const stored = persisted as PersistedWorkoutState | undefined;
        return {
          ...current,
          history: stored?.history ?? [],
          days: {
            monday: {
              checked: { ...def.monday.checked, ...stored?.days?.monday?.checked },
              setsDone: { ...def.monday.setsDone, ...stored?.days?.monday?.setsDone },
              weights: { ...def.monday.weights, ...stored?.days?.monday?.weights },
            },
            wednesday: {
              checked: { ...def.wednesday.checked, ...stored?.days?.wednesday?.checked },
              setsDone: { ...def.wednesday.setsDone, ...stored?.days?.wednesday?.setsDone },
              weights: { ...def.wednesday.weights, ...stored?.days?.wednesday?.weights },
              cardioOption: stored?.days?.wednesday?.cardioOption ?? def.wednesday.cardioOption,
            },
            friday: {
              checked: { ...def.friday.checked, ...stored?.days?.friday?.checked },
              setsDone: { ...def.friday.setsDone, ...stored?.days?.friday?.setsDone },
              weights: { ...def.friday.weights, ...stored?.days?.friday?.weights },
            },
          },
        };
      },
    }
  )
);

// Day-specific hooks for backward compatibility

export function useMondayWorkoutStore() {
  const store = useWorkoutStoreInternal();
  const dayState = store.days.monday;

  const completedCount = MONDAY_EXERCISES.reduce(
    (acc, ex) => acc + (dayState.checked[ex.id] ? 1 : 0),
    0
  );
  const progress = MONDAY_EXERCISES.length === 0 ? 0 : completedCount / MONDAY_EXERCISES.length;

  return {
    state: { checked: dayState.checked, setsDone: dayState.setsDone, weights: dayState.weights },
    completedCount,
    progress,
    toggleExercise: (id: string) => store.toggleExercise("monday", id),
    toggleSet: (ex: Exercise, setIndex: number) => store.toggleSet("monday", ex, setIndex),
    setWeight: (exerciseId: string, setIndex: number, weight: number) =>
      store.setWeight("monday", exerciseId, setIndex, weight),
    resetWorkout: () => store.resetDay("monday"),
    completeWorkout: () => store.saveWorkoutToHistory("monday"),
  };
}

export function useWednesdayWorkoutStore() {
  const store = useWorkoutStoreInternal();
  const dayState = store.days.wednesday;
  const cardioOption = dayState.cardioOption ?? "run";

  const currentExercises = useMemo(() => {
    const cardioExercise = cardioOption === "run" ? WEDNESDAY_CARDIO_RUN : WEDNESDAY_CARDIO_SWIM;
    return [cardioExercise, ...WEDNESDAY_CORE_EXERCISES, ...WEDNESDAY_MOBILITY_EXERCISES];
  }, [cardioOption]);

  const completedCount = useMemo(() => {
    return currentExercises.reduce((acc, ex) => acc + (dayState.checked[ex.id] ? 1 : 0), 0);
  }, [dayState.checked, currentExercises]);

  const totalExercises = currentExercises.length;
  const progress = totalExercises === 0 ? 0 : completedCount / totalExercises;

  return {
    state: { checked: dayState.checked, setsDone: dayState.setsDone, weights: dayState.weights },
    cardioOption,
    currentExercises,
    completedCount,
    totalExercises,
    progress,
    toggleExercise: (id: string) => store.toggleExercise("wednesday", id),
    toggleSet: (ex: Exercise, setIndex: number) => store.toggleSet("wednesday", ex, setIndex),
    setWeight: (exerciseId: string, setIndex: number, weight: number) =>
      store.setWeight("wednesday", exerciseId, setIndex, weight),
    selectCardioOption: store.setCardioOption,
    resetWorkout: () => store.resetDay("wednesday"),
    completeWorkout: () => store.saveWorkoutToHistory("wednesday"),
  };
}

export function useFridayWorkoutStore() {
  const store = useWorkoutStoreInternal();
  const dayState = store.days.friday;

  const completedCount = FRIDAY_EXERCISES.reduce(
    (acc, ex) => acc + (dayState.checked[ex.id] ? 1 : 0),
    0
  );
  const progress = FRIDAY_EXERCISES.length === 0 ? 0 : completedCount / FRIDAY_EXERCISES.length;

  return {
    state: { checked: dayState.checked, setsDone: dayState.setsDone, weights: dayState.weights },
    completedCount,
    progress,
    toggleExercise: (id: string) => store.toggleExercise("friday", id),
    toggleSet: (ex: Exercise, setIndex: number) => store.toggleSet("friday", ex, setIndex),
    setWeight: (exerciseId: string, setIndex: number, weight: number) =>
      store.setWeight("friday", exerciseId, setIndex, weight),
    resetWorkout: () => store.resetDay("friday"),
    completeWorkout: () => store.saveWorkoutToHistory("friday"),
  };
}

// Stats calculation helper
export function calculateWorkoutStats(
  exercises: Exercise[],
  setsDone: Record<string, boolean[]>,
  weights: Record<string, number[]>
): WorkoutStats {
  const exerciseStats: ExerciseStats[] = [];
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;

  for (const ex of exercises) {
    if (!ex.setsCount || ex.setsCount <= 0 || !ex.repsPerSet) continue;

    const exSetsDone = setsDone[ex.id] ?? [];
    const exWeights = weights[ex.id] ?? [];
    const completedSets = exSetsDone.filter(Boolean).length;

    if (completedSets === 0) continue;

    let exVolume = 0;
    let exTotalReps = 0;
    const usedWeights: number[] = [];

    for (let i = 0; i < exSetsDone.length; i++) {
      if (exSetsDone[i]) {
        const weight = exWeights[i] ?? 0;
        const reps = ex.repsPerSet;
        exVolume += weight * reps;
        exTotalReps += reps;
        if (weight > 0) usedWeights.push(weight);
      }
    }

    const avgWeight = usedWeights.length > 0
      ? usedWeights.reduce((a, b) => a + b, 0) / usedWeights.length
      : 0;

    exerciseStats.push({
      exerciseId: ex.id,
      exerciseName: ex.name,
      totalVolume: exVolume,
      setsCompleted: completedSets,
      totalReps: exTotalReps,
      weights: usedWeights,
      averageWeight: avgWeight,
    });

    totalVolume += exVolume;
    totalSets += completedSets;
    totalReps += exTotalReps;
  }

  return {
    totalVolume,
    totalSets,
    totalReps,
    averageWeightPerRep: totalReps > 0 ? totalVolume / totalReps : 0,
    exerciseStats,
  };
}

// Hook to access workout history
export function useWorkoutHistory() {
  const store = useWorkoutStoreInternal();

  return {
    history: store.history,
    deleteEntry: store.deleteHistoryEntry,
  };
}
