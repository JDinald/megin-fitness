import "./global.css";
import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabNavigator } from "./src/navigation/TabNavigator";
import { COLORS } from "./src/theme";

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.boneWhite,
    background: COLORS.nightBlack,
    card: COLORS.concreteGray,
    text: COLORS.boneWhite,
    border: COLORS.steelGray,
    notification: COLORS.infectedOrange,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
