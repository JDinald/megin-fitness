import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TabNavigator } from "./src/navigation/TabNavigator";
import { COLORS } from "./src/theme";

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.boneWhite,
          background: COLORS.nightBlack,
          card: COLORS.concreteGray,
          text: COLORS.boneWhite,
          border: COLORS.steelGray,
          notification: COLORS.infectedOrange,
        },
        fonts: {
          regular: { fontFamily: "System", fontWeight: "400" },
          medium: { fontFamily: "System", fontWeight: "500" },
          bold: { fontFamily: "System", fontWeight: "700" },
          heavy: { fontFamily: "System", fontWeight: "900" },
        },
      }}
    >
      <TabNavigator />
    </NavigationContainer>
  );
}
