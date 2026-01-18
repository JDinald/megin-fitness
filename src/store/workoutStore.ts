import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PersistedState, Exercise } from "../types/workout";
import { zustandStorage } from "../services/mmkv";
import { EXERCISES } from "../utils/workoutData";

function getDefaultState(): PersistedState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};
  for (const ex of EXERCISES) {
    checked[ex.id] = false;
    if (ex.setsCount && ex.setsCount > 0) {
      setsDone[ex.id] = Array(ex.setsCount).fill(false);
    }
  }
  return { checked, setsDone };
}

interface WorkoutActions {
  toggleExercise: (id: string) => void;
  toggleSet: (ex: Exercise, setIndex: number) => void;
  resetWorkout: () => void;
}

type WorkoutState = PersistedState & WorkoutActions;

const useWorkoutStoreInternal = create<WorkoutState>()(
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
      resetWorkout: () => set(getDefaultState()),
    }),
    {
      name: "friday-sustainable-v1",
      storage: zustandStorage,
      partialize: (state): PersistedState => ({
        checked: state.checked,
        setsDone: state.setsDone,
      }),
      merge: (persisted, current) => {
        const def = getDefaultState();
        const stored = persisted as PersistedState | undefined;
        return {
          ...current,
          checked: { ...def.checked, ...stored?.checked },
          setsDone: { ...def.setsDone, ...stored?.setsDone },
        };
      },
    }
  )
);

export function useWorkoutStore() {
  const state = useWorkoutStoreInternal();

  const completedCount = EXERCISES.reduce(
    (acc, ex) => acc + (state.checked[ex.id] ? 1 : 0),
    0
  );
  const progress = EXERCISES.length === 0 ? 0 : completedCount / EXERCISES.length;

  return {
    state: { checked: state.checked, setsDone: state.setsDone },
    completedCount,
    progress,
    toggleExercise: state.toggleExercise,
    toggleSet: state.toggleSet,
    resetWorkout: state.resetWorkout,
  };
}
