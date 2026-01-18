import { Exercise } from "../types/workout";

export const EXERCISES: Exercise[] = [
  { id: "ex1", section: "warmup", name: "Rowing / Bike", detail: "Get blood flowing", rightTop: "4 min", setsCount: 0 },
  { id: "ex2", section: "warmup", name: "Hip Hinges + Goblet Squat", detail: "10 hinges + 8 squats light", rightTop: "2 min", setsCount: 0 },
  { id: "ex3", section: "warmup", name: "Band Pull-Aparts", rightTop: "15 reps", setsCount: 0 },

  { id: "ex4", section: "main", variant: "beast", name: "Deadlift", badge: { text: "BEAST", kind: "beast" }, detail: "THE lift. Conventional or sumo - own it.", rightTop: "4 x 5", rightBottom: "2-3 min rest", setsCount: 4 },
  { id: "ex5", section: "main", variant: "pull", name: "Barbell Row", badge: { text: "PULL", kind: "pull" }, detail: "Heavy pulling - squeeze the back", rightTop: "4 x 8", rightBottom: "90s rest", setsCount: 4 },
  { id: "ex6", section: "main", name: "Overhead Press", badge: { text: "BEAST", kind: "beast" }, detail: "Standing, strict form", rightTop: "3 x 6", rightBottom: "90s rest", setsCount: 3 },
  { id: "ex7", section: "main", variant: "beast", name: "Farmer's Walks", badge: { text: "BEAST", kind: "beast" }, detail: "Heavy as possible, good posture", rightTop: "3 x 30m", rightBottom: "90s rest", setsCount: 3 },
  { id: "ex8", section: "main", name: "Dips / Close-Grip Bench", detail: "Triceps finisher", rightTop: "3 x 8", rightBottom: "90s rest", setsCount: 3 },
  { id: "ex9", section: "main", variant: "pull", name: "Hanging Leg Raises", badge: { text: "CORE", kind: "core" }, detail: "Or lying leg raises if needed", rightTop: "3 x 10", rightBottom: "60s rest", setsCount: 3 },

  { id: "ex10", section: "finisher", name: "Burpees OR Battle Ropes", detail: "Maximum effort. Leave nothing.", rightTop: "3 x 30 sec", rightBottom: "30s rest", setsCount: 3 },
  { id: "ex11", section: "finisher", name: "Cooldown Walk + Breathing", detail: "2 min nasal breathing", rightTop: "2 min", setsCount: 0 },
];
