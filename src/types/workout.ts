export type Exercise = {
  id: string;
  section: "warmup" | "main" | "finisher";
  variant?: "default" | "beast" | "pull" | "longevity";
  name: string;
  badge?: { text: string; kind: "beast" | "pull" | "core" };
  detail?: string;
  rightTop: string;
  rightBottom?: string;
  setsCount?: number;
};

export type PersistedState = {
  checked: Record<string, boolean>;
  setsDone: Record<string, boolean[]>;
};
