import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";
import { useWorkoutStats } from "../store/workoutStore";

function StatCard({
  label,
  value,
  unit,
  color = COLORS.boneWhite,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

function DayStatsSection({
  dayName,
  color,
  stats,
}: {
  dayName: string;
  color: string;
  stats: { totalVolume: number; totalSets: number; totalReps: number; averageWeightPerRep: number; exerciseStats: any[] };
}) {
  const hasData = stats.totalSets > 0;

  return (
    <View style={styles.daySection}>
      <View style={[styles.daySectionHeader, { borderBottomColor: color }]}>
        <Text style={[styles.daySectionTitle, { color }]}>{dayName}</Text>
      </View>
      {hasData ? (
        <>
          <View style={styles.dayStatsRow}>
            <View style={styles.dayStatItem}>
              <Text style={styles.dayStatValue}>{stats.totalVolume.toLocaleString()}</Text>
              <Text style={styles.dayStatLabel}>Volume (kg)</Text>
            </View>
            <View style={styles.dayStatItem}>
              <Text style={styles.dayStatValue}>{stats.totalSets}</Text>
              <Text style={styles.dayStatLabel}>Sets</Text>
            </View>
            <View style={styles.dayStatItem}>
              <Text style={styles.dayStatValue}>{stats.totalReps}</Text>
              <Text style={styles.dayStatLabel}>Reps</Text>
            </View>
            <View style={styles.dayStatItem}>
              <Text style={styles.dayStatValue}>{stats.averageWeightPerRep.toFixed(1)}</Text>
              <Text style={styles.dayStatLabel}>Avg kg/rep</Text>
            </View>
          </View>
          {stats.exerciseStats.length > 0 && (
            <View style={styles.exercisesList}>
              {stats.exerciseStats.map((ex) => (
                <View key={ex.exerciseId} style={styles.exerciseItem}>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName} numberOfLines={1}>{ex.exerciseName}</Text>
                    <Text style={styles.exerciseDetail}>
                      {ex.setsCompleted} sets × {ex.totalReps / ex.setsCompleted} reps
                    </Text>
                  </View>
                  <View style={styles.exerciseStats}>
                    <Text style={styles.exerciseVolume}>{ex.totalVolume.toLocaleString()} kg</Text>
                    {ex.averageWeight > 0 && (
                      <Text style={styles.exerciseAvg}>avg {ex.averageWeight.toFixed(1)} kg</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <Text style={styles.noData}>No completed exercises with weights yet</Text>
      )}
    </View>
  );
}

export function StatsScreen() {
  const stats = useWorkoutStats();
  const hasAnyData = stats.total.totalSets > 0;

  return (
    <View style={styles.root}>
      {/* Background glow */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={["rgba(74,0,128,0.08)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(212,175,55,0.06)", "transparent"]}
          start={{ x: 0.8, y: 0.8 }}
          end={{ x: 0.2, y: 0.2 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>STATISTICS</Text>
          <Text style={styles.subtitle}>Training Progress & Volume</Text>
        </View>

        {/* Total Stats Summary */}
        <View style={styles.totalSection}>
          <Text style={styles.totalSectionTitle}>TOTAL TRAINING VOLUME</Text>
          {hasAnyData ? (
            <View style={styles.totalStatsGrid}>
              <StatCard
                label="Total Volume"
                value={stats.total.totalVolume.toLocaleString()}
                unit="kg"
                color={COLORS.completeGreen}
              />
              <StatCard
                label="Total Sets"
                value={stats.total.totalSets}
                color={COLORS.toxicGreen}
              />
              <StatCard
                label="Total Reps"
                value={stats.total.totalReps}
                color={COLORS.infectedOrange}
              />
              <StatCard
                label="Avg Weight/Rep"
                value={stats.total.averageWeightPerRep.toFixed(1)}
                unit="kg"
                color={COLORS.longevityGold}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Data Yet</Text>
              <Text style={styles.emptyStateText}>
                Complete exercises and log your weights to see training statistics here.
              </Text>
            </View>
          )}
        </View>

        {/* Per-Day Stats */}
        <DayStatsSection
          dayName="MONDAY - Power"
          color={COLORS.infectedOrange}
          stats={stats.monday}
        />

        <DayStatsSection
          dayName="WEDNESDAY - Core"
          color={COLORS.toxicGreen}
          stats={stats.wednesday}
        />

        <DayStatsSection
          dayName="FRIDAY - Beast"
          color={COLORS.beastPurple}
          stats={stats.friday}
        />

        {/* Info note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            Volume = Weight × Reps. Track your weights on each set to see your training statistics.
            Higher volume over time indicates progressive overload.
          </Text>
        </View>
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

  totalSection: {
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    backgroundColor: COLORS.concreteGray,
    padding: 15,
    marginBottom: 20,
  },
  totalSectionTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: COLORS.longevityGold,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  totalStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: COLORS.nightBlack,
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.muted,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  statUnit: {
    fontSize: 12,
    color: COLORS.muted,
    marginLeft: 4,
  },

  daySection: {
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    backgroundColor: COLORS.concreteGray,
    marginBottom: 15,
    overflow: "hidden",
  },
  daySectionHeader: {
    borderBottomWidth: 2,
    padding: 12,
  },
  daySectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  dayStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.steelGray,
  },
  dayStatItem: {
    alignItems: "center",
  },
  dayStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.boneWhite,
  },
  dayStatLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  exercisesList: {
    padding: 10,
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
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.completeGreen,
  },
  exerciseAvg: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },

  noData: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },

  emptyState: {
    alignItems: "center",
    padding: 20,
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

  infoNote: {
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.30)",
    padding: 15,
    backgroundColor: "rgba(212,175,55,0.06)",
    marginTop: 10,
  },
  infoNoteText: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 18,
    textAlign: "center",
  },
});
