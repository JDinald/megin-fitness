import React from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar } from "../components/ProgressBar";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { CyberCard } from "../components/CyberCard";
import {
  WEDNESDAY_CARDIO_RUN,
  WEDNESDAY_CARDIO_SWIM,
  WEDNESDAY_CORE_EXERCISES,
  WEDNESDAY_MOBILITY_EXERCISES,
} from "../utils/wednesdayWorkoutData";
import { COLORS } from "../theme";
import { useWednesdayWorkoutStore } from "../store/workoutStore";

export function WednesdayScreen() {
  const {
    state,
    cardioOption,
    completedCount,
    totalExercises,
    progress,
    toggleExercise,
    toggleSet,
    setWeight,
    selectCardioOption,
    resetWorkout,
    completeWorkout,
  } = useWednesdayWorkoutStore();

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

  const currentCardioExercise = cardioOption === "run" ? WEDNESDAY_CARDIO_RUN : WEDNESDAY_CARDIO_SWIM;

  return (
    <View className="flex-1 bg-nightBlack">
      {/* Background glow - Green theme for Survival Day */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(57,255,20,0.08)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(0,212,255,0.05)", "transparent"]}
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
          dayLabel="Day 2 of 3"
          dayTitle="WEDNESDAY"
          subtitle="Survival - Zone 2 + Core + Mobility"
          duration="~40-45 MIN"
          variant="survival"
        />

        <ProgressBar
          completedCount={completedCount}
          totalCount={totalExercises}
          progress={progress}
          variant="survival"
        />

        {/* Recovery banner */}
        <CyberCard variant="survival" glowIntensity="subtle" animated>
          <View className="p-4">
            <View className="flex-row items-center justify-center mb-2">
              <View className="w-2 h-2 bg-toxicGreen mr-2" />
              <Text className="text-xl tracking-widest font-black text-toxicGreen">
                RECOVERY + ENGINE
              </Text>
              <View className="w-2 h-2 bg-toxicGreen ml-2" />
            </View>
            <Text className="text-xs text-muted text-center leading-5">
              Low intensity cardio builds your aerobic base. This is the day your body adapts. Zone 2 means EASY - if you can't hold a conversation, slow down.
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
              Today: mobility is included in workout. Still do dead hangs at home if not doing at gym.
            </Text>
          </View>
        </CyberCard>

        {/* Main Work - Zone 2 Cardio */}
        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b pb-2" style={{ borderColor: `${COLORS.toxicGreen}40` }}>
            <View className="w-1 h-4 mr-2" style={{ backgroundColor: COLORS.toxicGreen }} />
            <Text className="text-xs tracking-widest uppercase" style={{ color: COLORS.toxicGreen }}>
              Main Work - Choose Your Zone 2
            </Text>
          </View>

          {/* Cardio option selector */}
          <View className="flex-row mb-4" style={{ gap: 10 }}>
            <Pressable
              className="flex-1 py-3 items-center border"
              style={{
                backgroundColor: cardioOption === "run" ? `${COLORS.toxicGreen}20` : COLORS.steelGray,
                borderColor: cardioOption === "run" ? COLORS.toxicGreen : "#444",
              }}
              onPress={() => selectCardioOption("run")}
            >
              <Text
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: cardioOption === "run" ? COLORS.toxicGreen : COLORS.muted }}
              >
                Run/Bike/Row
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 py-3 items-center border"
              style={{
                backgroundColor: cardioOption === "swim" ? `${COLORS.toxicGreen}20` : COLORS.steelGray,
                borderColor: cardioOption === "swim" ? COLORS.toxicGreen : "#444",
              }}
              onPress={() => selectCardioOption("swim")}
            >
              <Text
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: cardioOption === "swim" ? COLORS.toxicGreen : COLORS.muted }}
              >
                Swim
              </Text>
            </Pressable>
          </View>

          <ExerciseCard
            key={currentCardioExercise.id}
            ex={currentCardioExercise}
            checked={!!state.checked[currentCardioExercise.id]}
            setsDone={state.setsDone[currentCardioExercise.id]}
            weights={state.weights[currentCardioExercise.id]}
            onToggle={() => toggleExercise(currentCardioExercise.id)}
            onToggleSet={() => {}}
            onSetWeight={(i, w) => setWeight(currentCardioExercise.id, i, w)}
            primaryColor={COLORS.toxicGreen}
          />
        </View>

        {/* Core Circuit */}
        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b border-steelGray pb-2">
            <View className="w-1 h-4 bg-muted mr-2" />
            <Text className="text-xs tracking-widest text-muted uppercase">
              Core Circuit
            </Text>
          </View>
          {WEDNESDAY_CORE_EXERCISES.map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.toxicGreen}
            />
          ))}
        </View>

        {/* Mobility */}
        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b pb-2" style={{ borderColor: `${COLORS.longevityGold}40` }}>
            <View className="w-1 h-4 mr-2" style={{ backgroundColor: COLORS.longevityGold }} />
            <Text className="text-xs tracking-widest uppercase" style={{ color: COLORS.longevityGold }}>
              Mobility - 5 min
            </Text>
          </View>
          {WEDNESDAY_MOBILITY_EXERCISES.map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              checked={!!state.checked[ex.id]}
              setsDone={state.setsDone[ex.id]}
              weights={state.weights[ex.id]}
              onToggle={() => toggleExercise(ex.id)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onSetWeight={(i, w) => setWeight(ex.id, i, w)}
              primaryColor={COLORS.longevityGold}
            />
          ))}
        </View>

        {completedCount === totalExercises && (
          <CyberCard variant="default" glowIntensity="medium" animated style={{ marginTop: 16 }}>
            <View className="p-5">
              <Text className="text-3xl tracking-widest font-black text-completeGreen text-center">
                WEDNESDAY COMPLETE
              </Text>
              <Text className="text-sm text-muted text-center mt-2">
                Recovery optimized. Tomorrow: YT focus. Friday: BEAST day.
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
              Zone 2 means EASY. If you can't hold a conversation, slow down. This is active recovery - build your aerobic engine while letting Monday's work settle.
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
