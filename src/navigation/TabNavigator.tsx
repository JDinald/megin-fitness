import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MondayScreen } from "../screens/MondayScreen";
import { WednesdayScreen } from "../screens/WednesdayScreen";
import { FridayScreen } from "../screens/FridayScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { COLORS } from "../theme";

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
        component={FridayScreen}
        options={{
          tabBarLabel: "FRI",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.dayIndicator, focused && styles.dayIndicatorFridayActive]}>
              <Text style={[styles.dayNumber, focused && styles.dayNumberActive]}>3</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: "STATS",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.dayIndicator, focused && styles.dayIndicatorStatsActive]}>
              <Text style={[styles.statsIcon, focused && styles.statsIconActive]}>%</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "LOG",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.dayIndicator, focused && styles.dayIndicatorHistoryActive]}>
              <Text style={[styles.historyIcon, focused && styles.historyIconActive]}>H</Text>
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
  dayIndicatorStatsActive: {
    borderColor: COLORS.longevityGold,
    backgroundColor: "rgba(212,175,55,0.15)",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.muted,
  },
  dayNumberActive: {
    color: COLORS.boneWhite,
  },
  statsIcon: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.muted,
  },
  statsIconActive: {
    color: COLORS.longevityGold,
  },
  dayIndicatorHistoryActive: {
    borderColor: COLORS.completeGreen,
    backgroundColor: "rgba(46,204,113,0.15)",
  },
  historyIcon: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.muted,
  },
  historyIconActive: {
    color: COLORS.completeGreen,
  },
});
