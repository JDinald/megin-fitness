import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";
import { CyberCard } from "../components/CyberCard";
import { usePersonalRecords } from "../store/workoutStore";
import { ExercisePR } from "../types/workout";

function formatDate(isoString: string | null): string {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDayColor(dayId: string | null): string {
  switch (dayId) {
    case "monday":
      return COLORS.infectedOrange;
    case "wednesday":
      return COLORS.toxicGreen;
    case "friday":
      return COLORS.cyberPurple;
    default:
      return COLORS.muted;
  }
}

function getDayLabel(dayId: string | null): string {
  switch (dayId) {
    case "monday":
      return "MONDAY";
    case "wednesday":
      return "WEDNESDAY";
    case "friday":
      return "FRIDAY";
    default:
      return "N/A";
  }
}

function PRCard({ pr }: { pr: ExercisePR }) {
  return (
    <View
      className="mb-3 p-4 border overflow-hidden"
      style={{
        backgroundColor: COLORS.concreteGray,
        borderColor: COLORS.steelGray,
      }}
    >
      {/* Corner accents */}
      <View
        className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2"
        style={{ borderColor: COLORS.xpGold }}
      />
      <View
        className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2"
        style={{ borderColor: COLORS.xpGold }}
      />
      <View
        className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2"
        style={{ borderColor: COLORS.xpGold }}
      />
      <View
        className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2"
        style={{ borderColor: COLORS.xpGold }}
      />

      <Text className="text-sm font-bold text-boneWhite mb-3 tracking-wide" numberOfLines={1}>
        {pr.exerciseName}
      </Text>

      <View className="flex-row justify-around">
        <View className="flex-1 items-center">
          <Text className="text-lg font-black" style={{ color: COLORS.xpGold }}>
            {pr.maxWeight > 0 ? `${pr.maxWeight} kg` : "-"}
          </Text>
          <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Max Weight</Text>
          {pr.maxWeight > 0 && (
            <Text className="text-xs mt-1" style={{ color: "#555" }}>
              {formatDate(pr.maxWeightDate)}
            </Text>
          )}
        </View>
        <View className="w-px mx-4" style={{ backgroundColor: COLORS.steelGray }} />
        <View className="flex-1 items-center">
          <Text className="text-lg font-black text-completeGreen">
            {pr.maxVolume > 0 ? `${pr.maxVolume.toLocaleString()} kg` : "-"}
          </Text>
          <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Best Volume</Text>
          {pr.maxVolume > 0 && (
            <Text className="text-xs mt-1" style={{ color: "#555" }}>
              {formatDate(pr.maxVolumeDate)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function PRScreen() {
  const { personalRecords, exercisePRs } = usePersonalRecords();

  const sortedPRs = [...exercisePRs].sort((a, b) => {
    if (b.maxWeight !== a.maxWeight) {
      return b.maxWeight - a.maxWeight;
    }
    return b.maxVolume - a.maxVolume;
  });

  const hasPRs = sortedPRs.length > 0;
  const hasBestWorkout = personalRecords.bestWorkoutVolume > 0;

  return (
    <View className="flex-1 bg-nightBlack">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(212,175,55,0.1)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(255,215,0,0.05)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-5 items-center py-4">
          <View className="flex-row items-center mb-1">
            <View className="w-2 h-2 mr-2" style={{ backgroundColor: COLORS.xpGold }} />
            <Text className="text-3xl tracking-widest font-black text-boneWhite">RECORDS</Text>
            <View className="w-2 h-2 ml-2" style={{ backgroundColor: COLORS.xpGold }} />
          </View>
          <Text className="text-sm text-muted tracking-wide">Personal Bests</Text>
        </View>

        {/* Best workout section */}
        {hasBestWorkout && (
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <View className="w-1 h-4 mr-2" style={{ backgroundColor: COLORS.xpGold }} />
              <Text className="text-xs tracking-widest uppercase" style={{ color: COLORS.xpGold }}>
                Best Workout
              </Text>
            </View>

            <CyberCard variant="gold" glowIntensity="medium" animated>
              <View className="p-5 flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-3xl font-black" style={{ color: COLORS.xpGold }}>
                    {personalRecords.bestWorkoutVolume.toLocaleString()} kg
                  </Text>
                  <Text className="text-xs text-muted mt-1 uppercase tracking-wide">
                    Total Volume
                  </Text>
                </View>
                <View className="items-end">
                  <View
                    className="px-3 py-1 mb-2"
                    style={{ backgroundColor: getDayColor(personalRecords.bestWorkoutVolumeDay) }}
                  >
                    <Text className="text-xs font-black text-boneWhite tracking-wide">
                      {getDayLabel(personalRecords.bestWorkoutVolumeDay)}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    {formatDate(personalRecords.bestWorkoutVolumeDate)}
                  </Text>
                </View>
              </View>
            </CyberCard>
          </View>
        )}

        {/* Exercise PRs */}
        {hasPRs ? (
          <View>
            <View className="flex-row items-center mb-3">
              <View className="w-1 h-4 mr-2" style={{ backgroundColor: COLORS.xpGold }} />
              <Text className="text-xs tracking-widest uppercase" style={{ color: COLORS.xpGold }}>
                Exercise PRs
              </Text>
            </View>

            {sortedPRs.map((pr) => (
              <PRCard key={pr.exerciseId} pr={pr} />
            ))}
          </View>
        ) : (
          <CyberCard variant="default" glowIntensity="none">
            <View className="items-center p-10">
              <Text className="text-lg font-bold text-muted mb-2">No Records Yet</Text>
              <Text className="text-sm text-muted text-center opacity-60 leading-5">
                Complete workouts with weight tracking to start recording your personal bests.
              </Text>
            </View>
          </CyberCard>
        )}
      </ScrollView>
    </View>
  );
}
