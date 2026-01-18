import React from "react";
import { View, StyleSheet } from "react-native";
import { TabNavigator } from "./src/navigation/TabNavigator";
import { COLORS } from "./src/theme";

export default function App() {
  return (
    <View style={styles.safe}>
      <TabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.nightBlack },
});
