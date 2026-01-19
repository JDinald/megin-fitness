import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar } from "../components/ProgressBar";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { MONDAY_EXERCISES } from "../utils/mondayWorkoutData";
import { COLORS } from "../theme";
import { useMondayWorkoutStore } from "../store/workoutStore";

export function MondayScreen() {
  const { state, completedCount, progress, toggleExercise, toggleSet, setWeight, resetWorkout, completeWorkout } = useMondayWorkoutStore();
  const totalExercises = MONDAY_EXERCISES.length;

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

  const handleCompleteWorkout = () => {
    const doComplete = () => {
      completeWorkout();
    };

    if (Platform.OS === "web") {
      // @ts-ignore
      if (confirm("Complete workout and save to history? This will reset the current progress.")) doComplete();
      return;
    }

    Alert.alert(
      "Complete Workout",
      "Save this workout to history? Your progress will be recorded and the workout will reset.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Complete", style: "default", onPress: doComplete },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* Background glow - Orange theme for Power Day */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(255,69,0,0.08)", "transparent"]}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(212,175,55,0.05)", "transparent"]}
          start={{ x: 0.8, y: 0.8 }}
          end={{ x: 0.2, y: 0.2 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <WorkoutHeader
          dayLabel="Day 1 of 3"
          dayTitle="MONDAY"
          subtitle="Power - Full Body (Lower Emphasis)"
          duration="~50-55 MIN"
        />

        <ProgressBar completedCount={completedCount} totalCount={totalExercises} progress={progress} />

        {/* Sustainable Power banner */}
        <View style={styles.powerBanner}>
          <Text style={styles.powerBannerTitle}>SUSTAINABLE POWER</Text>
          <Text style={styles.powerBannerText}>
            Full body session with lower body emphasis. Hit legs hard, touch upper body, finish explosive. This is your foundation day.
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
          <Text style={styles.reminderNote}>These 5-7 min can be done while watching TV. Non-negotiable for longevity.</Text>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Warm-up - 5 min</Text>
          {MONDAY_EXERCISES.filter((x) => x.section === "warmup").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.infectedOrange}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, styles.sectionHeaderPower]}>Main Work - Power</Text>
          {MONDAY_EXERCISES.filter((x) => x.section === "main").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.infectedOrange}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Finisher - Explosive</Text>
          {MONDAY_EXERCISES.filter((x) => x.section === "finisher").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.infectedOrange}
            />
          ))}
        </View>

        {completedCount === totalExercises ? (
          <View style={styles.completeBanner}>
            <Text style={styles.completeTitle}>MONDAY COMPLETE</Text>
            <Text style={styles.completeText}>Day 1 done. Tomorrow: Drawing. Wednesday: Survival + Sauna.</Text>
          </View>
        ) : null}

        {completedCount > 0 && (
          <Pressable
            onPress={handleCompleteWorkout}
            style={({ pressed }) => [styles.completeBtn, pressed && styles.completeBtnPressed]}
          >
            <Text style={styles.completeBtnText}>COMPLETE WORKOUT</Text>
            <Text style={styles.completeBtnSubtext}>Save to history & reset</Text>
          </Pressable>
        )}

        <View style={styles.resetContainer}>
          <Pressable onPress={handleResetWorkout} style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}>
            <Text style={styles.resetBtnText}>RESET WORKOUT</Text>
          </Pressable>
        </View>

        <View style={styles.notes}>
          <Text style={styles.notesTitle}>NOTES</Text>
          <Text style={styles.notesText}>
            Week 1-4: ~60-65% intensity. Build form. This isn't the 6-day program - it's designed for your life. 3 days done consistently beats 6 days abandoned. Pull exercises highlighted in gold for shoulder health. Don't skip the daily mobility at home.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.nightBlack },
  content: { padding: 15, paddingBottom: 0 },

  powerBanner: { borderWidth: 1, borderColor: COLORS.infectedOrange, padding: 15, marginBottom: 20, backgroundColor: "rgba(255,69,0,0.08)" },
  powerBannerTitle: { fontSize: 20, letterSpacing: 3, color: COLORS.infectedOrange, fontWeight: "800", textAlign: "center" },
  powerBannerText: { fontSize: 12, color: COLORS.muted, marginTop: 8, lineHeight: 18, textAlign: "center" },

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
  sectionHeaderPower: { color: COLORS.infectedOrange, borderBottomColor: "rgba(255,69,0,0.30)" },

  completeBanner: { borderWidth: 1, borderColor: COLORS.completeGreen, padding: 20, backgroundColor: "rgba(46,204,113,0.08)", marginTop: 10 },
  completeTitle: { fontSize: 28, letterSpacing: 4, color: COLORS.completeGreen, fontWeight: "900", textAlign: "center" },
  completeText: { fontSize: 14, color: COLORS.muted, marginTop: 5, textAlign: "center" },

  notes: { borderWidth: 1, borderColor: "rgba(212,175,55,0.30)", padding: 15, marginTop: 20, backgroundColor: "rgba(212,175,55,0.06)" },
  notesTitle: { fontSize: 16, letterSpacing: 2, color: COLORS.longevityGold, fontWeight: "900", marginBottom: 8 },
  notesText: { fontSize: 13, color: COLORS.muted, lineHeight: 19 },

  completeBtn: {
    marginTop: 15,
    paddingVertical: 18,
    backgroundColor: COLORS.concreteGray,
    borderWidth: 2,
    borderColor: COLORS.completeGreen,
    alignItems: "center",
  },
  completeBtnPressed: { backgroundColor: "rgba(46,204,113,0.15)" },
  completeBtnText: { fontSize: 18, letterSpacing: 3, color: COLORS.completeGreen, fontWeight: "900" },
  completeBtnSubtext: { fontSize: 11, color: COLORS.muted, marginTop: 4, letterSpacing: 1 },

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
