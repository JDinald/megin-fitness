import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar } from "../components/ProgressBar";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { FRIDAY_EXERCISES } from "../utils/fridayWorkoutData";
import { COLORS } from "../theme";
import { useFridayWorkoutStore } from "../store/workoutStore";

export function FridayScreen() {
  const { state, completedCount, progress, toggleExercise, toggleSet, resetWorkout } = useFridayWorkoutStore();
  const totalExercises = FRIDAY_EXERCISES.length;

  const handleResetWorkout = () => {
    const doReset = async () => {
      await resetWorkout();
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
        <WorkoutHeader
          dayLabel="Day 3 of 3"
          dayTitle="FRIDAY"
          subtitle="Beast - Heavy Compounds + Upper Pull"
          duration="~55-60 MIN"
        />

        <ProgressBar completedCount={completedCount} totalCount={totalExercises} progress={progress} />

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
          {FRIDAY_EXERCISES.filter((x) => x.section === "warmup").map((ex) => (
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
          {FRIDAY_EXERCISES.filter((x) => x.section === "main").map((ex) => (
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
          {FRIDAY_EXERCISES.filter((x) => x.section === "finisher").map((ex) => (
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
          <Pressable onPress={handleResetWorkout} style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.nightBlack },
  content: { padding: 15, paddingBottom: 0 },

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
