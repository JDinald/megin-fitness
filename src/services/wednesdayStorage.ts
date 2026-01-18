import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistedState } from "../types/workout";

const STORAGE_KEY = "wednesday-sustainable-v1";
const OPTION_KEY = "wednesday-sustainable-option";

export type CardioOption = "run" | "swim";

export type WednesdayPersistedState = PersistedState & {
  cardioOption?: CardioOption;
};

export const wednesdayStorage = {
  async load(): Promise<WednesdayPersistedState | null> {
    try {
      const [raw, option] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(OPTION_KEY),
      ]);
      if (raw) {
        const state = JSON.parse(raw) as PersistedState;
        return {
          ...state,
          cardioOption: (option as CardioOption) || "run",
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to load Wednesday storage:", error);
      return null;
    }
  },

  async save(state: PersistedState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save Wednesday storage:", error);
    }
  },

  async saveOption(option: CardioOption): Promise<void> {
    try {
      await AsyncStorage.setItem(OPTION_KEY, option);
    } catch (error) {
      console.error("Failed to save Wednesday cardio option:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear Wednesday storage:", error);
    }
  },
};
