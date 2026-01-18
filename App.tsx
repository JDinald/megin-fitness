import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

type Exercise = {
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

const STORAGE_KEY = "friday-sustainable-v1";

const COLORS = {
  bloodRed: "#8B0000",
  neonRed: "#ff1a1a",
  toxicGreen: "#39FF14",
  beastPurple: "#4a0080",
  nightBlack: "#0a0a0a",
  concreteGray: "#1a1a1a",
  steelGray: "#2d2d2d",
  boneWhite: "#e8e4d9",
  longevityGold: "#D4AF37",
  completeGreen: "#2ecc71",
  muted: "#888",
};

const EXERCISES: Exercise[] = [
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

type PersistedState = {
  checked: Record<string, boolean>;
  setsDone: Record<string, boolean[]>;
};

function getDefaultState(): PersistedState {
  const checked: Record<string, boolean> = {};
  const setsDone: Record<string, boolean[]> = {};
  for (const ex of EXERCISES) {
    checked[ex.id] = false;
    if (ex.setsCount && ex.setsCount > 0) setsDone[ex.id] = Array(ex.setsCount).fill(false);
  }
  return { checked, setsDone };
}

export default function App() {
  return (
    <View style={styles.safe}>
      <FridayScreen />
    </View>
  );
}

function FridayScreen() {
  const totalExercises = EXERCISES.length;
  const [state, setState] = useState<PersistedState>(() => getDefaultState());
  const [hydrated, setHydrated] = useState(false);

  const completedCount = useMemo(() => {
    return EXERCISES.reduce((acc, ex) => acc + (state.checked[ex.id] ? 1 : 0), 0);
  }, [state.checked]);

  const progress = totalExercises === 0 ? 0 : completedCount / totalExercises;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedState;
          const def = getDefaultState();
          setState({
            checked: { ...def.checked, ...parsed.checked },
            setsDone: { ...def.setsDone, ...parsed.setsDone },
          });
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
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

  const resetWorkout = () => {
    const doReset = () => {
      const fresh = getDefaultState();
      setState(fresh);
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    };

    if (Platform.OS === "web") {
      // @ts-ignore
      if (confirm("Reset all progress for this workout?")) doReset();
      return;
    }

    Alert.alert("Reset workout", "Reset all progress for this workout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: doReset },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* Background glow */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(74,0,128,0.12)", "transparent"]}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(139,0,0,0.10)", "transparent"]}
          start={{ x: 0.8, y: 0.8 }}
          end={{ x: 0.2, y: 0.2 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.programTag}>BEAST MODE SUSTAINABLE - 3 DAY PROGRAM</Text>
          <Text style={styles.dayLabel}>Day 3 of 3</Text>
          <Text style={styles.h1}>FRIDAY</Text>
          <Text style={styles.subtitle}>Beast - Heavy Compounds + Upper Pull</Text>
          <View style={styles.phaseTag}>
            <Text style={styles.phaseTagText}>~55-60 MIN</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Workout Progress</Text>
            <Text style={styles.progressCount}>
              {completedCount} / {totalExercises}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[COLORS.beastPurple, COLORS.toxicGreen]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]}
            />
          </View>
        </View>

        {/* Beast banner */}
        <View style={styles.beastBanner}>
          <Text style={styles.beastBannerTitle}>&gt;&gt; UNLEASH THE BEAST &lt;&lt;</Text>
          <Text style={styles.beastBannerText}>
            Heavy compounds, strongman work, controlled aggression. This is the day the transformation happens. Breathe. Brace. Lift.
          </Text>
        </View>

        {/* Daily reminder */}
        <View style={styles.reminder}>
          <Text style={styles.reminderTitle}>DAILY NON-NEGOTIABLES (Do at home every day)</Text>
          <View style={styles.reminderItems}>
            <Text style={styles.reminderItem}>- Dead Hangs 2-3 min</Text>
            <Text style={styles.reminderItem}>- Deep Squat 1-2 min</Text>
            <Text style={styles.reminderItem}>- Thoracic Rot 1 min ea</Text>
          </View>
          <Text style={styles.reminderNote}>Dead hangs after deadlifts = spinal decompression. Critical today.</Text>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Warm-up - 8 min</Text>
          {EXERCISES.filter((x) => x.section === "warmup").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, styles.sectionHeaderBeast]}>Main Work - Beast Mode</Text>
          {EXERCISES.filter((x) => x.section === "main").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Finisher - Empty The Tank</Text>
          {EXERCISES.filter((x) => x.section === "finisher").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
            />
          ))}
        </View>

        {completedCount === totalExercises ? (
          <View style={styles.completeBanner}>
            <Text style={styles.completeTitle}>&gt;&gt; WEEK COMPLETE &lt;&lt;</Text>
            <Text style={styles.completeText}>3/3 training days done. Weekend: Drawing Saturday, rest Sunday. You earned it.</Text>
          </View>
        ) : null}

        <View style={styles.resetContainer}>
          <Pressable onPress={resetWorkout} style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}>
            <Text style={styles.resetBtnText}>RESET WORKOUT</Text>
          </Pressable>
        </View>

        <View style={styles.notes}>
          <Text style={styles.notesTitle}>NOTES</Text>
          <Text style={styles.notesText}>
            Beast day = controlled aggression. Heavy but not maximal in Phase 1. Dead hangs after deadlifts are critical - decompress that spine.
            Pull exercises (rows, leg raises) maintain the 2:1 ratio. Weekend is yours - drawing Saturday, full rest Sunday. See you next Monday.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ExerciseCard({
  ex,
  checked,
  setsDone,
  onToggle,
  onToggleSet,
}: {
  ex: Exercise;
  checked: boolean;
  setsDone?: boolean[];
  onToggle: () => void;
  onToggleSet: (setIndex: number) => void;
}) {
  // 2) Neon animation hook (details below)
  const neon = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!checked) {
      neon.stopAnimation();
      neon.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(neon, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(neon, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [checked, neon]);

  const leftColor =
    checked
      ? COLORS.completeGreen
      : ex.variant === "pull" || ex.variant === "longevity"
      ? COLORS.longevityGold
      : COLORS.beastPurple;

  const checkboxBorder =
    ex.variant === "pull" || ex.variant === "longevity" ? COLORS.longevityGold : COLORS.beastPurple;

  return (
    <View style={[styles.card, checked && styles.cardCompleted]}>
      {/* left accent */}
      <View style={[styles.cardAccent, { backgroundColor: leftColor }]} />

      {/* RED NEON OVERLAY (only visible when checked) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.neonOverlay,
          {
            opacity: neon.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.35] }),
            transform: [
              { scale: neon.interpolate({ inputRange: [0, 1], outputRange: [1, 1.01] }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,26,26,0.0)", "rgba(255,26,26,0.20)", "rgba(255,26,26,0.0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Pressable onPress={onToggle} style={styles.cardMain}>
        {/* Checkbox */}
        <View style={styles.checkboxBox}>
          <View
            style={[
              styles.checkbox,
              { borderColor: checkboxBorder },
              checked && { backgroundColor: COLORS.completeGreen, borderColor: COLORS.completeGreen },
            ]}
          >
            <Text style={[styles.checkboxTick, checked && { color: COLORS.nightBlack }]}> </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.cardName, checked && styles.cardNameCompleted]} numberOfLines={1}>
              {ex.name}
            </Text>

            {!!ex.badge ? (
              <View
                style={[
                  styles.badge,
                  ex.badge.kind === "beast" && { backgroundColor: "rgba(74,0,128,0.30)" },
                  (ex.badge.kind === "pull" || ex.badge.kind === "core") && { backgroundColor: "rgba(212,175,55,0.20)" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    ex.badge.kind === "beast" && { color: COLORS.beastPurple },
                    (ex.badge.kind === "pull" || ex.badge.kind === "core") && { color: COLORS.longevityGold },
                  ]}
                >
                  {ex.badge.text}
                </Text>
              </View>
            ) : null}
          </View>

          {!!ex.detail ? <Text style={styles.cardDetail}>{ex.detail}</Text> : null}
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          <Text style={styles.rightTop}>{ex.rightTop}</Text>
          {!!ex.rightBottom ? <Text style={styles.rightBottom}>{ex.rightBottom}</Text> : null}
        </View>
      </Pressable>

      {/* Set tracker */}
      {ex.setsCount && ex.setsCount > 0 ? (
        <View style={styles.setRow}>
          {Array.from({ length: ex.setsCount }).map((_, i) => {
            const done = !!setsDone?.[i];
            return (
              <Pressable
                key={`${ex.id}-set-${i}`}
                onPress={() => onToggleSet(i)}
                style={({ pressed }) => [
                  styles.setBtn,
                  done && styles.setBtnDone,
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
              >
                <Text style={[styles.setBtnText, done && styles.setBtnTextDone]}>{i + 1}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.nightBlack },
  root: { flex: 1, backgroundColor: COLORS.nightBlack },

  content: { padding: 15, paddingBottom: 0 },

  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.steelGray,
    marginBottom: 20,
  },
  programTag: { fontSize: 10, letterSpacing: 2, color: COLORS.longevityGold, marginBottom: 5 },
  dayLabel: { fontSize: 12, letterSpacing: 4, color: "#666", textTransform: "uppercase" },
  h1: { fontSize: 42, letterSpacing: 4, color: COLORS.beastPurple, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 5 },
  phaseTag: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 12, backgroundColor: "rgba(74,0,128,0.20)" },
  phaseTagText: { fontSize: 11, letterSpacing: 2, color: COLORS.beastPurple, fontWeight: "700" },

  progressContainer: {
    backgroundColor: COLORS.concreteGray,
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    padding: 15,
    marginBottom: 20,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  progressLabel: { fontSize: 12, letterSpacing: 2, color: "#666", textTransform: "uppercase" },
  progressCount: { fontSize: 14, color: COLORS.toxicGreen, fontWeight: "700" },
  progressBar: { height: 8, backgroundColor: COLORS.steelGray, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },

  beastBanner: { borderWidth: 1, borderColor: COLORS.beastPurple, padding: 15, marginBottom: 20, backgroundColor: "rgba(74,0,128,0.08)" },
  beastBannerTitle: { fontSize: 20, letterSpacing: 3, color: COLORS.beastPurple, fontWeight: "800", textAlign: "center" },
  beastBannerText: { fontSize: 12, color: COLORS.muted, marginTop: 8, lineHeight: 18, textAlign: "center" },

  reminder: { backgroundColor: COLORS.concreteGray, borderWidth: 1, borderColor: COLORS.steelGray, padding: 15, marginBottom: 20 },
  reminderTitle: { fontSize: 11, letterSpacing: 2, color: COLORS.longevityGold, marginBottom: 10, fontWeight: "700" },
  reminderItems: { flexDirection: "row", flexWrap: "wrap" },
  reminderItem: { fontSize: 12, color: COLORS.muted, marginRight: 10, marginBottom: 6 },
  reminderNote: { fontSize: 11, color: "#666", marginTop: 8, fontStyle: "italic" },

  section: { marginBottom: 20 },
  sectionHeader: {
    fontSize: 11,
    letterSpacing: 3,
    color: "#555",
    textTransform: "uppercase",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 10,
  },
  sectionHeaderBeast: { color: COLORS.beastPurple, borderBottomColor: "rgba(74,0,128,0.30)" },

  card: { position: "relative", backgroundColor: COLORS.concreteGray, borderWidth: 1, borderColor: COLORS.steelGray, marginBottom: 10, overflow: "hidden" },
  cardCompleted: { opacity: 0.8 },
  cardAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },

  neonOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(255,26,26,0.45)",
  },

  cardMain: { flexDirection: "row", alignItems: "center", padding: 15 },

  checkboxBox: { width: 28, height: 28, alignItems: "center", justifyContent: "center", marginRight: 15 },
  checkbox: { width: 28, height: 28, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  checkboxTick: { fontSize: 16, color: "transparent", fontWeight: "900" },

  cardInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  cardName: { fontSize: 15, fontWeight: "700", color: COLORS.boneWhite, marginRight: 8 },
  cardNameCompleted: { textDecorationLine: "line-through", color: "#666" },
  cardDetail: { fontSize: 12, color: "#666", marginTop: 3 },

  badge: { paddingVertical: 2, paddingHorizontal: 6 },
  badgeText: { fontSize: 9, letterSpacing: 1, fontWeight: "800" },

  cardRight: { alignItems: "flex-end" },
  rightTop: { fontSize: 14, color: COLORS.toxicGreen, fontWeight: "800" },
  rightBottom: { fontSize: 11, color: "#555", marginTop: 2 },

  setRow: { flexDirection: "row", flexWrap: "wrap", paddingLeft: 58, paddingRight: 15, paddingBottom: 15 },
  setBtn: { width: 36, height: 36, backgroundColor: COLORS.steelGray, borderWidth: 1, borderColor: "#444", alignItems: "center", justifyContent: "center", marginRight: 8, marginBottom: 8 },
  setBtnDone: { backgroundColor: COLORS.completeGreen, borderColor: COLORS.completeGreen },
  setBtnText: { fontSize: 14, color: "#666", fontWeight: "800" },
  setBtnTextDone: { color: COLORS.nightBlack },

  completeBanner: { borderWidth: 1, borderColor: COLORS.completeGreen, padding: 20, backgroundColor: "rgba(46,204,113,0.08)", marginTop: 10 },
  completeTitle: { fontSize: 28, letterSpacing: 4, color: COLORS.completeGreen, fontWeight: "900", textAlign: "center" },
  completeText: { fontSize: 14, color: COLORS.muted, marginTop: 5, textAlign: "center" },

  notes: { borderWidth: 1, borderColor: "rgba(212,175,55,0.30)", padding: 15, marginTop: 20, backgroundColor: "rgba(212,175,55,0.06)" },
  notesTitle: { fontSize: 16, letterSpacing: 2, color: COLORS.longevityGold, fontWeight: "900", marginBottom: 8 },
  notesText: { fontSize: 13, color: COLORS.muted, lineHeight: 19 },

  resetContainer: {
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "rgba(10,10,10,0.92)",
    borderWidth: 1,
    borderColor: "#222",
  },
  resetBtn: { width: "100%", paddingVertical: 15, backgroundColor: COLORS.steelGray, borderWidth: 1, borderColor: COLORS.bloodRed, alignItems: "center" },
  resetBtnPressed: { backgroundColor: COLORS.bloodRed },
  resetBtnText: { fontSize: 18, letterSpacing: 3, color: COLORS.boneWhite, fontWeight: "900" },
});
