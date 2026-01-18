import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme";

type WorkoutHeaderProps = {
  dayLabel: string;
  dayTitle: string;
  subtitle: string;
  duration: string;
};

export function WorkoutHeader({ dayLabel, dayTitle, subtitle, duration }: WorkoutHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.programTag}>BEAST MODE SUSTAINABLE - 3 DAY PROGRAM</Text>
      <Text style={styles.dayLabel}>{dayLabel}</Text>
      <Text style={styles.h1}>{dayTitle}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.phaseTag}>
        <Text style={styles.phaseTagText}>{duration}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.steelGray,
    marginBottom: 20,
  },
  programTag: { fontSize: 10, letterSpacing: 2, color: COLORS.longevityGold, marginBottom: 5 },
  dayLabel: { fontSize: 12, letterSpacing: 4, color: "#666", textTransform: "uppercase" },
  h1: { fontSize: 42, letterSpacing: 4, color: COLORS.beastPurple, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 5 },
  phaseTag: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 12, backgroundColor: "rgba(74,0,128,0.20)" },
  phaseTagText: { fontSize: 11, letterSpacing: 2, color: COLORS.beastPurple, fontWeight: "700" },
});
