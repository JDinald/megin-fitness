import { Exercise } from "../types/workout";

// Cardio options - only one is active at a time
export const WEDNESDAY_CARDIO_RUN: Exercise = {
  id: "wed-run",
  section: "main",
  name: "Zone 2 Cardio",
  detail: "Run, bike, or row — conversational pace, HR 120-140",
  rightTop: "30-35 min",
  setsCount: 0,
};

export const WEDNESDAY_CARDIO_SWIM: Exercise = {
  id: "wed-swim",
  section: "main",
  name: "Swimming",
  detail: "Continuous laps, mixed strokes — build to 1km",
  rightTop: "20-30 min",
  setsCount: 0,
};

// Core circuit exercises
export const WEDNESDAY_CORE_EXERCISES: Exercise[] = [
  {
    id: "wed-ex1",
    section: "main",
    name: "Dead Bug",
    detail: "Opposite arm/leg, lower back flat",
    rightTop: "3 × 10 each",
    rightBottom: "30s rest",
    setsCount: 3,
    repsPerSet: 10,
  },
  {
    id: "wed-ex2",
    section: "main",
    name: "Plank",
    detail: "Squeeze glutes, don't sag",
    rightTop: "3 × 40 sec",
    rightBottom: "30s rest",
    setsCount: 3,
  },
  {
    id: "wed-ex3",
    section: "main",
    name: "Side Plank",
    detail: "Each side",
    rightTop: "2 × 25 sec ea",
    rightBottom: "30s rest",
    setsCount: 4, // L, R, L, R
  },
];

// Mobility exercises
export const WEDNESDAY_MOBILITY_EXERCISES: Exercise[] = [
  {
    id: "wed-ex4",
    section: "finisher",
    variant: "longevity",
    name: "Hip 90/90 Stretch",
    rightTop: "2 min each",
    setsCount: 0,
  },
  {
    id: "wed-ex5",
    section: "finisher",
    variant: "longevity",
    name: "Cat-Cow",
    rightTop: "10 slow reps",
    setsCount: 0,
  },
];

// All exercises combined (using run as default cardio)
export const WEDNESDAY_EXERCISES: Exercise[] = [
  WEDNESDAY_CARDIO_RUN,
  ...WEDNESDAY_CORE_EXERCISES,
  ...WEDNESDAY_MOBILITY_EXERCISES,
];

// All unique exercise IDs for state initialization
export const ALL_WEDNESDAY_IDS = [
  "wed-run",
  "wed-swim",
  ...WEDNESDAY_CORE_EXERCISES.map((e) => e.id),
  ...WEDNESDAY_MOBILITY_EXERCISES.map((e) => e.id),
];
