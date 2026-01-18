import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistedState } from "../types/workout";

const STORAGE_KEY = "friday-sustainable-v1";

export const storage = {
  async load(): Promise<PersistedState | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as PersistedState;
      }
      return null;
    } catch (error) {
      console.error("Failed to load from storage:", error);
      return null;
    }
  },

  async save(state: PersistedState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save to storage:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};
