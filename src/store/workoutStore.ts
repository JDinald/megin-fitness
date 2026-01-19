import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import { PersistedState, Exercise, WorkoutStats, ExerciseStats } from "../types/workout";
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
  toggleExercise: (day: DayId, id: string) => void;
  toggleSet: (day: DayId, ex: Exercise, setIndex: number) => void;
  setWeight: (day: DayId, exerciseId: string, setIndex: number, weight: number) => void;
  setCardioOption: (option: CardioOption) => void;
  resetDay: (day: DayId) => void;
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

type PersistedWorkoutState = { days: Record<DayId, DayState> };

const useWorkoutStoreInternal = create<WorkoutStoreState>()(
  persist(
    (set) => ({
      days: getDefaultState(),

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
    }),
    {
      name: "workouts-v1",
      storage: zustandStorage,
      partialize: (state): PersistedWorkoutState => ({ days: state.days }),
      merge: (persisted, current) => {
        const def = getDefaultState();
        const stored = persisted as PersistedWorkoutState | undefined;
        return {
          ...current,
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

// Hook to get stats for all days
export function useWorkoutStats() {
  const store = useWorkoutStoreInternal();

  const mondayStats = useMemo(() =>
    calculateWorkoutStats(
      MONDAY_EXERCISES,
      store.days.monday.setsDone,
      store.days.monday.weights
    ), [store.days.monday.setsDone, store.days.monday.weights]
  );

  const wednesdayStats = useMemo(() =>
    calculateWorkoutStats(
      WEDNESDAY_CORE_EXERCISES,
      store.days.wednesday.setsDone,
      store.days.wednesday.weights
    ), [store.days.wednesday.setsDone, store.days.wednesday.weights]
  );

  const fridayStats = useMemo(() =>
    calculateWorkoutStats(
      FRIDAY_EXERCISES,
      store.days.friday.setsDone,
      store.days.friday.weights
    ), [store.days.friday.setsDone, store.days.friday.weights]
  );

  const totalStats = useMemo(() => ({
    totalVolume: mondayStats.totalVolume + wednesdayStats.totalVolume + fridayStats.totalVolume,
    totalSets: mondayStats.totalSets + wednesdayStats.totalSets + fridayStats.totalSets,
    totalReps: mondayStats.totalReps + wednesdayStats.totalReps + fridayStats.totalReps,
    averageWeightPerRep:
      (mondayStats.totalReps + wednesdayStats.totalReps + fridayStats.totalReps) > 0
        ? (mondayStats.totalVolume + wednesdayStats.totalVolume + fridayStats.totalVolume) /
          (mondayStats.totalReps + wednesdayStats.totalReps + fridayStats.totalReps)
        : 0,
  }), [mondayStats, wednesdayStats, fridayStats]);

  return {
    monday: mondayStats,
    wednesday: wednesdayStats,
    friday: fridayStats,
    total: totalStats,
  };
}
