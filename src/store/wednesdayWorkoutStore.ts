import { useEffect, useMemo, useState } from "react";
import { PersistedState, Exercise } from "../types/workout";
import { wednesdayStorage, CardioOption } from "../services/wednesdayStorage";
import {
  WEDNESDAY_CARDIO_RUN,
  WEDNESDAY_CARDIO_SWIM,
  WEDNESDAY_CORE_EXERCISES,
  WEDNESDAY_MOBILITY_EXERCISES,
  ALL_WEDNESDAY_IDS,
} from "../utils/wednesdayWorkoutData";

function getDefaultState(): PersistedState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};

  // Initialize all exercise IDs including both cardio options
  for (const id of ALL_WEDNESDAY_IDS) {
    checked[id] = false;
  }

  // Initialize sets for core exercises
  for (const ex of WEDNESDAY_CORE_EXERCISES) {
    if (ex.setsCount && ex.setsCount > 0) {
      setsDone[ex.id] = Array(ex.setsCount).fill(false);
    }
  }

  return { checked, setsDone };
}

export function useWednesdayWorkoutStore() {
  const [state, setState] = useState<PersistedState>(() => getDefaultState());
  const [cardioOption, setCardioOption] = useState<CardioOption>("run");
  const [hydrated, setHydrated] = useState(false);

  // Get all exercises for the current cardio option
  const currentExercises = useMemo(() => {
    const cardioExercise = cardioOption === "run" ? WEDNESDAY_CARDIO_RUN : WEDNESDAY_CARDIO_SWIM;
    return [cardioExercise, ...WEDNESDAY_CORE_EXERCISES, ...WEDNESDAY_MOBILITY_EXERCISES];
  }, [cardioOption]);

  const completedCount = useMemo(() => {
    return currentExercises.reduce((acc, ex) => acc + (state.checked[ex.id] ? 1 : 0), 0);
  }, [state.checked, currentExercises]);

  const totalExercises = currentExercises.length;
  const progress = totalExercises === 0 ? 0 : completedCount / totalExercises;

  useEffect(() => {
    (async () => {
      try {
        const loaded = await wednesdayStorage.load();
        if (loaded) {
          const def = getDefaultState();
          setState({
            checked: { ...def.checked, ...loaded.checked },
            setsDone: { ...def.setsDone, ...loaded.setsDone },
          });
          if (loaded.cardioOption) {
            setCardioOption(loaded.cardioOption);
          }
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    wednesdayStorage.save(state);
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

  const selectCardioOption = (option: CardioOption) => {
    setCardioOption(option);
    wednesdayStorage.saveOption(option);
  };

  const resetWorkout = async () => {
    const fresh = getDefaultState();
    setState(fresh);
    await wednesdayStorage.clear();
  };

  return {
    state,
    cardioOption,
    currentExercises,
    completedCount,
    totalExercises,
    progress,
    toggleExercise,
    toggleSet,
    selectCardioOption,
    resetWorkout,
  };
}
