import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MondayScreen } from "../screens/MondayScreen";
import { WorkoutScreen } from "../screens/WorkoutScreen";
import { COLORS } from "../theme";

// Placeholder for Wednesday screen
function WednesdayScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>WEDNESDAY</Text>
      <Text style={styles.placeholderSubtitle}>Survival Day</Text>
      <Text style={styles.placeholderText}>Coming Soon</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.concreteGray,
          borderTopWidth: 1,
          borderTopColor: COLORS.steelGray,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.boneWhite,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Monday"
        component={MondayScreen}
        options={{
          tabBarLabel: "MON",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.dayIndicator, focused && styles.dayIndicatorMondayActive]}>
              <Text style={[styles.dayNumber, focused && styles.dayNumberActive]}>1</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wednesday"
        component={WednesdayScreen}
        options={{
          tabBarLabel: "WED",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.dayIndicator, focused && styles.dayIndicatorWednesdayActive]}>
              <Text style={[styles.dayNumber, focused && styles.dayNumberActive]}>2</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Friday"
        component={WorkoutScreen}
        options={{
          tabBarLabel: "FRI",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.dayIndicator, focused && styles.dayIndicatorFridayActive]}>
              <Text style={[styles.dayNumber, focused && styles.dayNumberActive]}>3</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
    marginTop: 4,
  },
  dayIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.steelGray,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dayIndicatorMondayActive: {
    borderColor: COLORS.infectedOrange,
    backgroundColor: "rgba(255,69,0,0.15)",
  },
  dayIndicatorWednesdayActive: {
    borderColor: COLORS.toxicGreen,
    backgroundColor: "rgba(57,255,20,0.15)",
  },
  dayIndicatorFridayActive: {
    borderColor: COLORS.beastPurple,
    backgroundColor: "rgba(74,0,128,0.15)",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.muted,
  },
  dayNumberActive: {
    color: COLORS.boneWhite,
  },
  placeholder: {
    flex: 1,
    backgroundColor: COLORS.nightBlack,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 32,
    letterSpacing: 4,
    color: COLORS.toxicGreen,
    fontWeight: "900",
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 16,
    letterSpacing: 2,
    color: COLORS.muted,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.steelGray,
    fontStyle: "italic",
  },
});
