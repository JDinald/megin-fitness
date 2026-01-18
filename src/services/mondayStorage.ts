import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistedState } from "../types/workout";

const STORAGE_KEY = "monday-sustainable-v1";

export const mondayStorage = {
  async load(): Promise<PersistedState | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as PersistedState;
      }
      return null;
    } catch (error) {
      console.error("Failed to load Monday storage:", error);
      return null;
    }
  },

  async save(state: PersistedState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save Monday storage:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear Monday storage:", error);
    }
  },
};
