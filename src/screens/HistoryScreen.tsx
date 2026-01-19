import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";
import { CyberCard } from "../components/CyberCard";
import { useWorkoutHistory } from "../store/workoutStore";
import { WorkoutHistoryEntry } from "../types/workout";

function getDayColor(dayId: string): string {
  switch (dayId) {
    case "monday":
      return COLORS.infectedOrange;
    case "wednesday":
      return COLORS.toxicGreen;
    case "friday":
      return COLORS.beastPurple;
    default:
      return COLORS.muted;
  }
}

function getDayLabel(dayId: string): string {
  switch (dayId) {
    case "monday":
      return "MONDAY - Power";
    case "wednesday":
      return "WEDNESDAY - Survival";
    case "friday":
      return "FRIDAY - Beast";
    default:
      return dayId.toUpperCase();
  }
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function HistoryEntryCard({
  entry,
  onDelete,
}: {
  entry: WorkoutHistoryEntry;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dayColor = getDayColor(entry.dayId);

  const handleDelete = () => {
    if (Platform.OS === "web") {
      // @ts-ignore
      if (confirm("Delete this workout from history?")) onDelete();
      return;
    }
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this workout from history?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <View
      className="mb-3 overflow-hidden border"
      style={{
        backgroundColor: COLORS.concreteGray,
        borderColor: expanded ? dayColor : COLORS.steelGray,
      }}
    >
      {/* Corner accents */}
      <View
        className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2"
        style={{ borderColor: dayColor }}
      />
      <View
        className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2"
        style={{ borderColor: dayColor }}
      />

      <TouchableOpacity
        className="flex-row items-center p-3"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View className="w-1 h-10 mr-3" style={{ backgroundColor: dayColor }} />
        <View className="flex-1">
          <Text className="text-xs font-black tracking-wide" style={{ color: dayColor }}>
            {getDayLabel(entry.dayId)}
          </Text>
          <Text className="text-xs text-muted mt-1">
            {formatDate(entry.completedAt)} at {formatTime(entry.completedAt)}
          </Text>
        </View>
        <View className="items-end mr-2">
          <Text className="text-sm font-bold text-completeGreen">
            {entry.stats.totalVolume.toLocaleString()} kg
          </Text>
          <Text className="text-xs text-muted mt-0.5">{entry.stats.totalSets} sets</Text>
        </View>
        <Text className="text-lg font-bold text-muted w-5 text-center">
          {expanded ? "-" : "+"}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View className="border-t p-3" style={{ borderColor: COLORS.steelGray }}>
          {/* Stats row */}
          <View className="flex-row justify-around pb-3 border-b" style={{ borderColor: COLORS.steelGray }}>
            <View className="items-center">
              <Text className="text-base font-black text-boneWhite">
                {entry.stats.totalVolume.toLocaleString()}
              </Text>
              <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Volume (kg)</Text>
            </View>
            <View className="items-center">
              <Text className="text-base font-black text-boneWhite">{entry.stats.totalSets}</Text>
              <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Sets</Text>
            </View>
            <View className="items-center">
              <Text className="text-base font-black text-boneWhite">{entry.stats.totalReps}</Text>
              <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Reps</Text>
            </View>
            <View className="items-center">
              <Text className="text-base font-black text-boneWhite">
                {entry.stats.averageWeightPerRep.toFixed(1)}
              </Text>
              <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Avg kg/rep</Text>
            </View>
          </View>

          {/* Exercises list */}
          {entry.exerciseData.length > 0 && (
            <View className="pt-3">
              <Text className="text-xs text-muted font-bold uppercase tracking-wide mb-2">
                Exercises
              </Text>
              {entry.exerciseData.map((ex, index) => (
                <View
                  key={`${ex.exerciseId}-${index}`}
                  className="flex-row justify-between items-center py-2 border-b"
                  style={{ borderColor: `${COLORS.steelGray}50` }}
                >
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-semibold text-boneWhite" numberOfLines={1}>
                      {ex.exerciseName}
                    </Text>
                    <Text className="text-xs text-muted mt-0.5">
                      {ex.setsCompleted} sets x{" "}
                      {ex.setsCompleted > 0 ? Math.round(ex.totalReps / ex.setsCompleted) : 0} reps
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-completeGreen">
                      {ex.totalVolume.toLocaleString()} kg
                    </Text>
                    {ex.weights.length > 0 && (
                      <Text className="text-xs text-muted mt-0.5">
                        {ex.weights.join(" / ")} kg
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Delete button */}
          <TouchableOpacity
            className="mt-4 py-2 items-center border"
            style={{ borderColor: COLORS.neonRed }}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text className="text-xs font-bold tracking-wide" style={{ color: COLORS.neonRed }}>
              Delete Entry
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function HistoryScreen() {
  const { history, deleteEntry } = useWorkoutHistory();

  const totalWorkouts = history.length;
  const totalVolume = history.reduce((sum, e) => sum + e.stats.totalVolume, 0);
  const totalSets = history.reduce((sum, e) => sum + e.stats.totalSets, 0);

  return (
    <View className="flex-1 bg-nightBlack">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(0,212,255,0.06)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(139,92,246,0.04)", "transparent"]}
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
            <View className="w-2 h-2 mr-2" style={{ backgroundColor: COLORS.neonBlue }} />
            <Text className="text-3xl tracking-widest font-black text-boneWhite">HISTORY</Text>
            <View className="w-2 h-2 ml-2" style={{ backgroundColor: COLORS.neonBlue }} />
          </View>
          <Text className="text-sm text-muted tracking-wide">Mission Log</Text>
        </View>

        {/* Summary section */}
        <CyberCard variant="default" glowIntensity="subtle">
          <View className="p-4">
            <Text className="text-xs tracking-widest font-bold text-center mb-4" style={{ color: COLORS.neonBlue }}>
              ALL TIME STATS
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-1 items-center py-2">
                <Text className="text-2xl font-black text-xpGold">{totalWorkouts}</Text>
                <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Workouts</Text>
              </View>
              <View className="flex-1 items-center py-2">
                <Text className="text-2xl font-black text-completeGreen">
                  {totalVolume.toLocaleString()}
                </Text>
                <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Volume (kg)</Text>
              </View>
              <View className="flex-1 items-center py-2">
                <Text className="text-2xl font-black text-infectedOrange">{totalSets}</Text>
                <Text className="text-xs text-muted mt-1 uppercase tracking-wide">Sets</Text>
              </View>
            </View>
          </View>
        </CyberCard>

        {/* History list */}
        <View className="mt-5">
          {history.length === 0 ? (
            <CyberCard variant="default" glowIntensity="none">
              <View className="items-center p-10">
                <Text className="text-lg font-bold text-muted mb-2">No Missions Logged</Text>
                <Text className="text-sm text-muted text-center opacity-60 leading-5">
                  Complete a workout and tap "Complete Workout" to save it to your mission log.
                </Text>
              </View>
            </CyberCard>
          ) : (
            <>
              <View className="flex-row items-center mb-3">
                <View className="w-1 h-4 bg-muted mr-2" />
                <Text className="text-xs tracking-widest text-muted uppercase">
                  Recent Missions
                </Text>
              </View>
              {history.map((entry) => (
                <HistoryEntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => deleteEntry(entry.id)}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
