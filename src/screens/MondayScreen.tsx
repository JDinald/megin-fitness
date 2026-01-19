import React from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ExerciseCard } from "../components/ExerciseCard";
import { ProgressBar } from "../components/ProgressBar";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { CyberCard } from "../components/CyberCard";
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
    <View className="flex-1 bg-nightBlack">
      {/* Background glow - Orange theme for Power Day */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(255,69,0,0.1)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(255,102,0,0.05)", "transparent"]}
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
          dayLabel="Day 1 of 3"
          dayTitle="MONDAY"
          subtitle="Power - Full Body (Lower Emphasis)"
          duration="~50-55 MIN"
          variant="power"
        />

        <ProgressBar
          completedCount={completedCount}
          totalCount={totalExercises}
          progress={progress}
          variant="power"
        />

        {/* Sustainable Power banner */}
        <CyberCard variant="power" glowIntensity="subtle" animated>
          <View className="p-4">
            <View className="flex-row items-center justify-center mb-2">
              <View className="w-2 h-2 bg-infectedOrange mr-2" />
              <Text className="text-xl tracking-widest font-black text-infectedOrange">
                SUSTAINABLE POWER
              </Text>
              <View className="w-2 h-2 bg-infectedOrange ml-2" />
            </View>
            <Text className="text-xs text-muted text-center leading-5">
              Full body session with lower body emphasis. Hit legs hard, touch upper body, finish explosive. This is your foundation day.
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
              These 5-7 min can be done while watching TV. Non-negotiable for longevity.
            </Text>
          </View>
        </CyberCard>

        {/* Sections */}
        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b border-steelGray pb-2">
            <View className="w-1 h-4 bg-muted mr-2" />
            <Text className="text-xs tracking-widest text-muted uppercase">
              Warm-up - 5 min
            </Text>
          </View>
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

        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b pb-2" style={{ borderColor: `${COLORS.infectedOrange}40` }}>
            <View className="w-1 h-4 mr-2" style={{ backgroundColor: COLORS.infectedOrange }} />
            <Text className="text-xs tracking-widest uppercase" style={{ color: COLORS.infectedOrange }}>
              Main Work - Power
            </Text>
          </View>
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

        <View className="mt-5">
          <View className="flex-row items-center mb-3 border-b border-steelGray pb-2">
            <View className="w-1 h-4 bg-muted mr-2" />
            <Text className="text-xs tracking-widest text-muted uppercase">
              Finisher - Explosive
            </Text>
          </View>
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

        {completedCount === totalExercises && (
          <CyberCard variant="default" glowIntensity="medium" animated style={{ marginTop: 16 }}>
            <View className="p-5">
              <Text className="text-3xl tracking-widest font-black text-completeGreen text-center">
                MONDAY COMPLETE
              </Text>
              <Text className="text-sm text-muted text-center mt-2">
                Day 1 done. Tomorrow: Drawing. Wednesday: Survival + Sauna.
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
              Week 1-4: ~60-65% intensity. Build form. This isn't the 6-day program - it's designed for your life. 3 days done consistently beats 6 days abandoned. Pull exercises highlighted in gold for shoulder health. Don't skip the daily mobility at home.
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
