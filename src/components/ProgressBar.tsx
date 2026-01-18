import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";

type ProgressBarProps = {
  completedCount: number;
  totalCount: number;
  progress: number;
};

export function ProgressBar({ completedCount, totalCount, progress }: ProgressBarProps) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Workout Progress</Text>
        <Text style={styles.progressCount}>
          {completedCount} / {totalCount}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[COLORS.beastPurple, COLORS.toxicGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: COLORS.concreteGray,
    borderWidth: 1,
    borderColor: COLORS.steelGray,
    padding: 15,
    marginBottom: 20,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  progressLabel: { fontSize: 12, letterSpacing: 2, color: "#666", textTransform: "uppercase" },
  progressCount: { fontSize: 14, color: COLORS.toxicGreen, fontWeight: "700" },
  progressBar: { height: 8, backgroundColor: COLORS.steelGray, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
});
