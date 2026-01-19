import React from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar } from "../components/ProgressBar";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { CyberCard } from "../components/CyberCard";
import { FRIDAY_EXERCISES } from "../utils/fridayWorkoutData";
import { COLORS } from "../theme";
import { useFridayWorkoutStore } from "../store/workoutStore";

export function FridayScreen() {
  const { state, completedCount, progress, toggleExercise, toggleSet, setWeight, resetWorkout, completeWorkout } = useFridayWorkoutStore();
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
    <View className="flex-1 bg-nightBlack">
      {/* Background glow - Purple theme for Beast Day */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(74,0,128,0.15)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(139,92,246,0.08)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutHeader
          dayLabel="Day 3 of 3"
          dayTitle="FRIDAY"
          subtitle="Beast - Heavy Compounds + Upper Pull"
          duration="~55-60 MIN"
          variant="beast"
        />

        <ProgressBar
          completedCount={completedCount}
          totalCount={totalExercises}
          progress={progress}
          variant="beast"
        />

        {/* Beast banner */}
        <CyberCard variant="beast" glowIntensity="medium" animated>
          <View className="p-4">
            <View className="flex-row items-center justify-center mb-2">
              <Text className="text-xl tracking-widest font-black" style={{ color: COLORS.cyberPurple }}>
                {">> UNLEASH THE BEAST <<"}
              </Text>
            </View>
            <Text className="text-xs text-muted text-center leading-5">
              Heavy compounds, strongman work, controlled aggression. This is the day the transformation happens. Breathe. Brace. Lift.
            </Text>
          </View>
        </CyberCard>

        {/* Daily reminder */}
        <CyberCard variant="gold" glowIntensity="subtle" style={{ marginTop: 16 }}>
          <View className="p-4">
            <Text className="text-xs tracking-widest font-bold text-longevityGold mb-3">
              DAILY NON-NEGOTIABLES
            </Text>
            <View className="flex-row flex-wrap">
              <Text className="text-xs text-muted mr-3 mb-1">- Dead Hangs 2-3 min</Text>
              <Text className="text-xs text-muted mr-3 mb-1">- Deep Squat 1-2 min</Text>
              <Text className="text-xs text-muted mb-1">- Thoracic Rot 1 min ea</Text>
            </View>
            <Text className="text-xs text-muted mt-2 italic opacity-60">
              Dead hangs after deadlifts = spinal decompression. Critical today.
            </Text>
          </View>
        </CyberCard>

        {/* Sections */}
        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b border-steelGray pb-2">
            <View className="w-1 h-4 bg-muted mr-2" />
            <Text className="text-xs tracking-widest text-muted uppercase">
              Warm-up - 8 min
            </Text>
          </View>
          {FRIDAY_EXERCISES.filter((x) => x.section === "warmup").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.beastPurple}
            />
          ))}
        </View>

        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b pb-2" style={{ borderColor: `${COLORS.beastPurple}40` }}>
            <View className="w-1 h-4 mr-2" style={{ backgroundColor: COLORS.cyberPurple }} />
            <Text className="text-xs tracking-widest uppercase" style={{ color: COLORS.cyberPurple }}>
              Main Work - Beast Mode
            </Text>
          </View>
          {FRIDAY_EXERCISES.filter((x) => x.section === "main").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.beastPurple}
            />
          ))}
        </View>

        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b border-steelGray pb-2">
            <View className="w-1 h-4 bg-muted mr-2" />
            <Text className="text-xs tracking-widest text-muted uppercase">
              Finisher - Empty The Tank
            </Text>
          </View>
          {FRIDAY_EXERCISES.filter((x) => x.section === "finisher").map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.beastPurple}
            />
          ))}
        </View>

        {completedCount === totalExercises && (
          <CyberCard variant="holo" glowIntensity="strong" animated style={{ marginTop: 16 }}>
            <View className="p-5">
              <Text className="text-3xl tracking-widest font-black text-completeGreen text-center">
                {">> WEEK COMPLETE <<"}
              </Text>
              <Text className="text-sm text-muted text-center mt-2">
                3/3 training days done. Weekend: Drawing Saturday, rest Sunday. You earned it.
              </Text>
            </View>
          </CyberCard>
        )}

        {completedCount > 0 && (
          <Pressable
            onPress={handleCompleteWorkout}
            className="mt-4 py-5 items-center border-2 border-completeGreen"
            style={({ pressed }) => ({
              backgroundColor: pressed ? `${COLORS.completeGreen}20` : COLORS.concreteGray,
            })}
          >
            <Text className="text-lg tracking-widest font-black text-completeGreen">
              COMPLETE WORKOUT
            </Text>
            <Text className="text-xs text-muted mt-1 tracking-wide">
              Save to history & reset
            </Text>
          </Pressable>
        )}

        <CyberCard variant="gold" glowIntensity="subtle" style={{ marginTop: 20 }}>
          <View className="p-4">
            <Text className="text-base tracking-widest font-black text-longevityGold mb-2">
              NOTES
            </Text>
            <Text className="text-sm text-muted leading-5">
              Beast day = controlled aggression. Heavy but not maximal in Phase 1. Dead hangs after deadlifts are critical - decompress that spine. Pull exercises (rows, leg raises) maintain the 2:1 ratio. Weekend is yours - drawing Saturday, full rest Sunday. See you next Monday.
            </Text>
          </View>
        </CyberCard>

        <View className="mt-4 p-4 border border-steelGray bg-nightBlack/90">
          <Pressable
            onPress={handleResetWorkout}
            className="w-full py-4 items-center border border-bloodRed"
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLORS.bloodRed : COLORS.steelGray,
            })}
          >
            <Text className="text-lg tracking-widest font-black text-boneWhite">
              RESET WORKOUT
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
