import { Exercise } from "../types/workout";

export const MONDAY_EXERCISES: Exercise[] = [
  // Warm-up
  { id: "mon-ex1", section: "warmup", name: "Jump Rope / Light Jog", rightTop: "2 min", setsCount: 0 },
  { id: "mon-ex2", section: "warmup", name: "Leg Swings + Arm Circles", detail: "10 each direction", rightTop: "2 min", setsCount: 0 },
  { id: "mon-ex3", section: "warmup", name: "Bodyweight Squats", rightTop: "10 reps", setsCount: 0 },

  // Main Work - Power
  { id: "mon-ex4", section: "main", name: "Box Jumps", detail: "Explosive up, step down. Start the engine.", rightTop: "3 × 6", rightBottom: "90s rest", setsCount: 3 },
  { id: "mon-ex5", section: "main", name: "Barbell Back Squat", detail: "THE lower body lift. Depth matters.", rightTop: "4 × 5", rightBottom: "2 min rest", setsCount: 4 },
  { id: "mon-ex6", section: "main", name: "Romanian Deadlift", detail: "Feel the hamstring stretch", rightTop: "3 × 8", rightBottom: "90s rest", setsCount: 3 },
  { id: "mon-ex7", section: "main", variant: "pull", name: "Pull-ups / Lat Pulldown", badge: { text: "PULL", kind: "pull" }, detail: "Full range of motion", rightTop: "3 × 8", rightBottom: "90s rest", setsCount: 3 },
  { id: "mon-ex8", section: "main", name: "Dumbbell Bench Press", detail: "Control down, explosive up", rightTop: "3 × 8", rightBottom: "90s rest", setsCount: 3 },
  { id: "mon-ex9", section: "main", variant: "pull", name: "Face Pulls", badge: { text: "PULL", kind: "pull" }, detail: "Shoulder health — external rotation at top", rightTop: "2 × 15", rightBottom: "45s rest", setsCount: 2 },

  // Finisher
  { id: "mon-ex10", section: "finisher", name: "Kettlebell Swings", detail: "Hip SNAP. Leave nothing.", rightTop: "3 × 15", rightBottom: "60s rest", setsCount: 3 },
];
