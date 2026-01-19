import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";
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
      return COLORS.beastPurple;
    default:
      return COLORS.muted;
  }
}

function getDayLabel(dayId: string | null): string {
  switch (dayId) {
    case "monday":
      return "Monday";
    case "wednesday":
      return "Wednesday";
    case "friday":
      return "Friday";
    default:
      return "N/A";
  }
}

function PRCard({ pr }: { pr: ExercisePR }) {
  return (
    <View style={styles.prCard}>
      <Text style={styles.exerciseName} numberOfLines={1}>
        {pr.exerciseName}
      </Text>
      <View style={styles.prStatsRow}>
        <View style={styles.prStat}>
          <Text style={[styles.prValue, { color: COLORS.longevityGold }]}>
            {pr.maxWeight > 0 ? `${pr.maxWeight} kg` : "-"}
          </Text>
          <Text style={styles.prLabel}>Max Weight</Text>
          {pr.maxWeight > 0 && (
            <Text style={styles.prDate}>{formatDate(pr.maxWeightDate)}</Text>
          )}
        </View>
        <View style={styles.prDivider} />
        <View style={styles.prStat}>
          <Text style={[styles.prValue, { color: COLORS.completeGreen }]}>
            {pr.maxVolume > 0 ? `${pr.maxVolume.toLocaleString()} kg` : "-"}
          </Text>
          <Text style={styles.prLabel}>Best Volume</Text>
          {pr.maxVolume > 0 && (
            <Text style={styles.prDate}>{formatDate(pr.maxVolumeDate)}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function PRScreen() {
  const { personalRecords, exercisePRs } = usePersonalRecords();

  const sortedPRs = [...exercisePRs].sort((a, b) => {
    // Sort by max weight descending
    if (b.maxWeight !== a.maxWeight) {
      return b.maxWeight - a.maxWeight;
    }
    return b.maxVolume - a.maxVolume;
  });

  const hasPRs = sortedPRs.length > 0;
  const hasBestWorkout = personalRecords.bestWorkoutVolume > 0;

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(212,175,55,0.08)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>RECORDS</Text>
          <Text style={styles.subtitle}>Personal Bests</Text>
        </View>

        {hasBestWorkout && (
          <View style={styles.bestWorkoutSection}>
            <Text style={styles.sectionTitle}>BEST WORKOUT</Text>
            <View style={styles.bestWorkoutCard}>
              <View style={styles.bestWorkoutMain}>
                <Text style={[styles.bestWorkoutValue, { color: COLORS.longevityGold }]}>
                  {personalRecords.bestWorkoutVolume.toLocaleString()} kg
                </Text>
                <Text style={styles.bestWorkoutLabel}>Total Volume</Text>
              </View>
              <View style={styles.bestWorkoutMeta}>
                <View style={[
                  styles.dayBadge,
                  { backgroundColor: getDayColor(personalRecords.bestWorkoutVolumeDay) }
                ]}>
                  <Text style={styles.dayBadgeText}>
                    {getDayLabel(personalRecords.bestWorkoutVolumeDay)}
                  </Text>
                </View>
                <Text style={styles.bestWorkoutDate}>
                  {formatDate(personalRecords.bestWorkoutVolumeDate)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {hasPRs ? (
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>EXERCISE PRs</Text>
            {sortedPRs.map((pr) => (
              <PRCard key={pr.exerciseId} pr={pr} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Records Yet</Text>
            <Text style={styles.emptyStateText}>
              Complete workouts with weight tracking to start recording your personal bests.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.nightBlack },
  content: { padding: 15, paddingBottom: 40 },

  header: { marginBottom: 20, alignItems: "center" },
  title: {
    fontSize: 32,
    letterSpacing: 4,
    color: COLORS.boneWhite,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 5,
    letterSpacing: 1,
  },

  sectionTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.longevityGold,
    fontWeight: "700",
    marginBottom: 12,
  },

  bestWorkoutSection: {
    marginBottom: 24,
  },
  bestWorkoutCard: {
    borderWidth: 1,
    borderColor: COLORS.longevityGold,
    backgroundColor: COLORS.concreteGray,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bestWorkoutMain: {
    flex: 1,
  },
  bestWorkoutValue: {
    fontSize: 28,
    fontWeight: "900",
  },
  bestWorkoutLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bestWorkoutMeta: {
    alignItems: "flex-end",
  },
  dayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.boneWhite,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bestWorkoutDate: {
    fontSize: 11,
    color: COLORS.muted,
  },

  exercisesSection: {
    marginBottom: 20,
  },

  prCard: {
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    backgroundColor: COLORS.concreteGray,
    padding: 15,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.boneWhite,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  prStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  prStat: {
    flex: 1,
    alignItems: "center",
  },
  prDivider: {
    width: 1,
    backgroundColor: COLORS.steelGray,
    marginHorizontal: 15,
  },
  prValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  prLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  prDate: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
  },

  emptyState: {
    alignItems: "center",
    padding: 40,
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    backgroundColor: COLORS.concreteGray,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.muted,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
});
