import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import { PersistedState, Exercise } from "../types/workout";
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
  setCardioOption: (option: CardioOption) => void;
  resetDay: (day: DayId) => void;
}

function getDefaultDayState(day: DayId): DayState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};

  if (day === "monday") {
    for (const ex of MONDAY_EXERCISES) {
      checked[ex.id] = false;
      if (ex.setsCount && ex.setsCount > 0) {
        setsDone[ex.id] = Array(ex.setsCount).fill(false);
      }
    }
    return { checked, setsDone };
  }

  if (day === "wednesday") {
    for (const id of ALL_WEDNESDAY_IDS) {
      checked[id] = false;
    }
    for (const ex of WEDNESDAY_CORE_EXERCISES) {
      if (ex.setsCount && ex.setsCount > 0) {
        setsDone[ex.id] = Array(ex.setsCount).fill(false);
      }
    }
    return { checked, setsDone, cardioOption: "run" };
  }

  // friday
  for (const ex of FRIDAY_EXERCISES) {
    checked[ex.id] = false;
    if (ex.setsCount && ex.setsCount > 0) {
      setsDone[ex.id] = Array(ex.setsCount).fill(false);
    }
  }
  return { checked, setsDone };
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
            },
            wednesday: {
              checked: { ...def.wednesday.checked, ...stored?.days?.wednesday?.checked },
              setsDone: { ...def.wednesday.setsDone, ...stored?.days?.wednesday?.setsDone },
              cardioOption: stored?.days?.wednesday?.cardioOption ?? def.wednesday.cardioOption,
            },
            friday: {
              checked: { ...def.friday.checked, ...stored?.days?.friday?.checked },
              setsDone: { ...def.friday.setsDone, ...stored?.days?.friday?.setsDone },
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
    state: { checked: dayState.checked, setsDone: dayState.setsDone },
    completedCount,
    progress,
    toggleExercise: (id: string) => store.toggleExercise("monday", id),
    toggleSet: (ex: Exercise, setIndex: number) => store.toggleSet("monday", ex, setIndex),
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
    state: { checked: dayState.checked, setsDone: dayState.setsDone },
    cardioOption,
    currentExercises,
    completedCount,
    totalExercises,
    progress,
    toggleExercise: (id: string) => store.toggleExercise("wednesday", id),
    toggleSet: (ex: Exercise, setIndex: number) => store.toggleSet("wednesday", ex, setIndex),
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
    state: { checked: dayState.checked, setsDone: dayState.setsDone },
    completedCount,
    progress,
    toggleExercise: (id: string) => store.toggleExercise("friday", id),
    toggleSet: (ex: Exercise, setIndex: number) => store.toggleSet("friday", ex, setIndex),
    resetWorkout: () => store.resetDay("friday"),
  };
}
