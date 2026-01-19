import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";
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
      return "WEDNESDAY - Core";
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
    <View style={styles.entryCard}>
      <TouchableOpacity
        style={styles.entryHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={[styles.dayIndicator, { backgroundColor: dayColor }]} />
        <View style={styles.entryInfo}>
          <Text style={[styles.dayLabel, { color: dayColor }]}>
            {getDayLabel(entry.dayId)}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(entry.completedAt)} at {formatTime(entry.completedAt)}
          </Text>
        </View>
        <View style={styles.entrySummary}>
          <Text style={styles.volumeText}>
            {entry.stats.totalVolume.toLocaleString()} kg
          </Text>
          <Text style={styles.setsText}>{entry.stats.totalSets} sets</Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? "-" : "+"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.entryDetails}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{entry.stats.totalVolume.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Volume (kg)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{entry.stats.totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{entry.stats.totalReps}</Text>
              <Text style={styles.statLabel}>Reps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {entry.stats.averageWeightPerRep.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Avg kg/rep</Text>
            </View>
          </View>

          {entry.exerciseData.length > 0 && (
            <View style={styles.exercisesList}>
              <Text style={styles.exercisesTitle}>Exercises</Text>
              {entry.exerciseData.map((ex, index) => (
                <View key={`${ex.exerciseId}-${index}`} style={styles.exerciseItem}>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName} numberOfLines={1}>
                      {ex.exerciseName}
                    </Text>
                    <Text style={styles.exerciseDetail}>
                      {ex.setsCompleted} sets x{" "}
                      {ex.setsCompleted > 0
                        ? Math.round(ex.totalReps / ex.setsCompleted)
                        : 0}{" "}
                      reps
                    </Text>
                  </View>
                  <View style={styles.exerciseStats}>
                    <Text style={styles.exerciseVolume}>
                      {ex.totalVolume.toLocaleString()} kg
                    </Text>
                    {ex.weights.length > 0 && (
                      <Text style={styles.exerciseWeights}>
                        {ex.weights.join(" / ")} kg
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete Entry</Text>
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
          <Text style={styles.title}>HISTORY</Text>
          <Text style={styles.subtitle}>Workout Log</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>ALL TIME TOTALS</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: COLORS.longevityGold }]}>
                {totalWorkouts}
              </Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: COLORS.completeGreen }]}>
                {totalVolume.toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Total Volume (kg)</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: COLORS.infectedOrange }]}>
                {totalSets}
              </Text>
              <Text style={styles.summaryLabel}>Total Sets</Text>
            </View>
          </View>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Workouts Yet</Text>
            <Text style={styles.emptyStateText}>
              Complete a workout and tap "Complete Workout" to save it to your
              history.
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            <Text style={styles.historyListTitle}>RECENT WORKOUTS</Text>
            {history.map((entry) => (
              <HistoryEntryCard
                key={entry.id}
                entry={entry}
                onDelete={() => deleteEntry(entry.id)}
              />
            ))}
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

  summarySection: {
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    backgroundColor: COLORS.concreteGray,
    padding: 15,
    marginBottom: 20,
  },
  summarySectionTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.longevityGold,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
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

  historyList: {
    marginBottom: 20,
  },
  historyListTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 12,
  },

  entryCard: {
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    backgroundColor: COLORS.concreteGray,
    marginBottom: 10,
    overflow: "hidden",
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  dayIndicator: {
    width: 4,
    height: 40,
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  entrySummary: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  volumeText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.completeGreen,
  },
  setsText: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.muted,
    width: 20,
    textAlign: "center",
  },

  entryDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.steelGray,
    padding: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.steelGray,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.boneWhite,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  exercisesList: {
    paddingTop: 12,
  },
  exercisesTitle: {
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(45,45,45,0.5)",
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.boneWhite,
  },
  exerciseDetail: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  exerciseStats: {
    alignItems: "flex-end",
  },
  exerciseVolume: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.completeGreen,
  },
  exerciseWeights: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },

  deleteButton: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.neonRed,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.neonRed,
    letterSpacing: 1,
  },
});
