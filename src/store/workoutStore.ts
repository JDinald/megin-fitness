import { useEffect, useMemo, useState } from "react";
import { PersistedState, Exercise } from "../types/workout";
import { storage } from "../services/storage";
import { EXERCISES } from "../utils/workoutData";

function getDefaultState(): PersistedState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};
  for (const ex of EXERCISES) {
    checked[ex.id] = false;
    if (ex.setsCount && ex.setsCount > 0) setsDone[ex.id] = Array(ex.setsCount).fill(false);
  }
  return { checked, setsDone };
}

export function useWorkoutStore() {
  const [state, setState] = useState<PersistedState>(() => getDefaultState());
  const [hydrated, setHydrated] = useState(false);

  const completedCount = useMemo(() => {
    return EXERCISES.reduce((acc, ex) => acc + (state.checked[ex.id] ? 1 : 0), 0);
  }, [state.checked]);

  const progress = EXERCISES.length === 0 ? 0 : completedCount / EXERCISES.length;

  useEffect(() => {
    (async () => {
      try {
        const loaded = await storage.load();
        if (loaded) {
          const def = getDefaultState();
          setState({
            checked: { ...def.checked, ...loaded.checked },
            setsDone: { ...def.setsDone, ...loaded.setsDone },
          });
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    storage.save(state);
  }, [state, hydrated]);

  const toggleExercise = (id: string) => {
    setState((prev) => ({
      ...prev,
      checked: { ...prev.checked, [id]: !prev.checked[id] },
    }));
  };

  const toggleSet = (ex: Exercise, setIndex: number) => {
    if (!ex.setsCount || ex.setsCount <= 0) return;

    setState((prev) => {
      const current = prev.setsDone[ex.id] ?? Array(ex.setsCount!).fill(false);
      const nextSets = current.slice();
      nextSets[setIndex] = !nextSets[setIndex];

      const allDone = nextSets.every(Boolean);

      return {
        checked: { ...prev.checked, [ex.id]: allDone },
        setsDone: { ...prev.setsDone, [ex.id]: nextSets },
      };
    });
  };

  const resetWorkout = async () => {
    const fresh = getDefaultState();
    setState(fresh);
    await storage.clear();
  };

  return {
    state,
    completedCount,
    progress,
    toggleExercise,
    toggleSet,
    resetWorkout,
  };
}
