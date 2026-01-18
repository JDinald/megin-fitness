import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import { PersistedState, Exercise } from "../types/workout";
import { zustandStorage } from "../services/mmkv";
import {
  WEDNESDAY_CARDIO_RUN,
  WEDNESDAY_CARDIO_SWIM,
  WEDNESDAY_CORE_EXERCISES,
  WEDNESDAY_MOBILITY_EXERCISES,
  ALL_WEDNESDAY_IDS,
} from "../utils/wednesdayWorkoutData";

export type CardioOption = "run" | "swim";

type WednesdayPersistedState = PersistedState & {
  cardioOption: CardioOption;
};

function getDefaultState(): WednesdayPersistedState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};

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

interface WednesdayWorkoutActions {
  toggleExercise: (id: string) => void;
  toggleSet: (ex: Exercise, setIndex: number) => void;
  selectCardioOption: (option: CardioOption) => void;
  resetWorkout: () => void;
}

type WednesdayWorkoutState = WednesdayPersistedState & WednesdayWorkoutActions;

const useWednesdayWorkoutStoreInternal = create<WednesdayWorkoutState>()(
  persist(
    (set) => ({
      ...getDefaultState(),
      toggleExercise: (id: string) =>
        set((state) => ({
          checked: { ...state.checked, [id]: !state.checked[id] },
        })),
      toggleSet: (ex: Exercise, setIndex: number) =>
        set((state) => {
          if (!ex.setsCount || ex.setsCount <= 0) return state;

          const current = state.setsDone[ex.id] ?? Array(ex.setsCount).fill(false);
          const nextSets = current.slice();
          nextSets[setIndex] = !nextSets[setIndex];

          const allDone = nextSets.every(Boolean);

          return {
            checked: { ...state.checked, [ex.id]: allDone },
            setsDone: { ...state.setsDone, [ex.id]: nextSets },
          };
        }),
      selectCardioOption: (option: CardioOption) =>
        set({ cardioOption: option }),
      resetWorkout: () => set(getDefaultState()),
    }),
    {
      name: "wednesday-sustainable-v1",
      storage: zustandStorage,
      partialize: (state): WednesdayPersistedState => ({
        checked: state.checked,
        setsDone: state.setsDone,
        cardioOption: state.cardioOption,
      }),
      merge: (persisted, current) => {
        const def = getDefaultState();
        const stored = persisted as WednesdayPersistedState | undefined;
        return {
          ...current,
          checked: { ...def.checked, ...stored?.checked },
          setsDone: { ...def.setsDone, ...stored?.setsDone },
          cardioOption: stored?.cardioOption ?? def.cardioOption,
        };
      },
    }
  )
);

export function useWednesdayWorkoutStore() {
  const state = useWednesdayWorkoutStoreInternal();

  const currentExercises = useMemo(() => {
    const cardioExercise =
      state.cardioOption === "run" ? WEDNESDAY_CARDIO_RUN : WEDNESDAY_CARDIO_SWIM;
    return [cardioExercise, ...WEDNESDAY_CORE_EXERCISES, ...WEDNESDAY_MOBILITY_EXERCISES];
  }, [state.cardioOption]);

  const completedCount = useMemo(() => {
    return currentExercises.reduce((acc, ex) => acc + (state.checked[ex.id] ? 1 : 0), 0);
  }, [state.checked, currentExercises]);

  const totalExercises = currentExercises.length;
  const progress = totalExercises === 0 ? 0 : completedCount / totalExercises;

  return {
    state: { checked: state.checked, setsDone: state.setsDone },
    cardioOption: state.cardioOption,
    currentExercises,
    completedCount,
    totalExercises,
    progress,
    toggleExercise: state.toggleExercise,
    toggleSet: state.toggleSet,
    selectCardioOption: state.selectCardioOption,
    resetWorkout: state.resetWorkout,
  };
}
