import { createMMKV } from "react-native-mmkv";
import { createJSONStorage, StateStorage } from "zustand/middleware";

export const storage = createMMKV({
  id: "megin-fitness-storage",
});

const mmkvStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

export const zustandStorage = createJSONStorage(() => mmkvStorage);
