import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme";

// Placeholder for future statistics, PRs, and history
export function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics & PRs</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.nightBlack,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    letterSpacing: 3,
    color: COLORS.beastPurple,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
  },
});
