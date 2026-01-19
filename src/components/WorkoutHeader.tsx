import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS } from "../theme";

type WorkoutHeaderProps = {
  dayLabel: string;
  dayTitle: string;
  subtitle: string;
  duration: string;
  variant?: "power" | "survival" | "beast";
};

const VARIANT_CONFIG = {
  power: {
    titleColor: COLORS.infectedOrange,
    gradient: GRADIENTS.mondayPower,
    glowColor: COLORS.infectedOrange,
  },
  survival: {
    titleColor: COLORS.toxicGreen,
    gradient: GRADIENTS.wednesdaySurvival,
    glowColor: COLORS.toxicGreen,
  },
  beast: {
    titleColor: COLORS.beastPurple,
    gradient: GRADIENTS.fridayBeast,
    glowColor: COLORS.cyberPurple,
  },
};

export function WorkoutHeader({
  dayLabel,
  dayTitle,
  subtitle,
  duration,
  variant = "beast",
}: WorkoutHeaderProps) {
  const config = VARIANT_CONFIG[variant];
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing glow effect
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );

    // Horizontal scan line
    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );

    glow.start();
    scan.start();

    return () => {
      glow.stop();
      scan.stop();
    };
  }, [glowAnim, scanAnim]);

  return (
    <View className="items-center py-6 px-4 mb-5 relative overflow-hidden">
      {/* Background gradient */}
      <LinearGradient
        colors={[COLORS.cyberDark, COLORS.concreteGray]}
        className="absolute top-0 left-0 right-0 bottom-0"
      />

      {/* Grid pattern overlay */}
      <View
        className="absolute top-0 left-0 right-0 bottom-0 opacity-5"
        style={{
          backgroundColor: "transparent",
          borderColor: COLORS.cyberCyan,
          borderWidth: 0.5,
        }}
      />

      {/* Horizontal scan line effect */}
      <Animated.View
        pointerEvents="none"
        className="absolute left-0 right-0 h-px"
        style={{
          backgroundColor: config.glowColor,
          opacity: 0.4,
          transform: [
            {
              translateY: scanAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 180],
              }),
            },
          ],
        }}
      />

      {/* Corner accents */}
      <View className="absolute top-0 left-0 w-6 h-6">
        <View
          className="absolute top-0 left-0 w-full h-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
        <View
          className="absolute top-0 left-0 h-full w-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
      </View>
      <View className="absolute top-0 right-0 w-6 h-6">
        <View
          className="absolute top-0 right-0 w-full h-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
        <View
          className="absolute top-0 right-0 h-full w-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
      </View>
      <View className="absolute bottom-0 left-0 w-6 h-6">
        <View
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
        <View
          className="absolute bottom-0 left-0 h-full w-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
      </View>
      <View className="absolute bottom-0 right-0 w-6 h-6">
        <View
          className="absolute bottom-0 right-0 w-full h-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
        <View
          className="absolute bottom-0 right-0 h-full w-0.5"
          style={{ backgroundColor: config.titleColor }}
        />
      </View>

      {/* Program tag */}
      <View className="flex-row items-center mb-2">
        <View className="w-2 h-2 mr-2" style={{ backgroundColor: COLORS.xpGold }} />
        <Text
          className="text-xs tracking-widest font-bold"
          style={{ color: COLORS.xpGold }}
        >
          BEAST MODE SUSTAINABLE
        </Text>
        <View className="w-2 h-2 ml-2" style={{ backgroundColor: COLORS.xpGold }} />
      </View>

      {/* Day label */}
      <Text className="text-xs tracking-widest text-muted uppercase mb-1">
        {dayLabel}
      </Text>

      {/* Main title with glow effect */}
      <View className="relative">
        <Animated.View
          className="absolute -top-2 -left-4 -right-4 -bottom-2"
          style={{
            backgroundColor: config.glowColor,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.05, 0.15],
            }),
            borderRadius: 4,
          }}
        />
        <Text
          className="text-5xl tracking-widest font-black"
          style={{ color: config.titleColor }}
        >
          {dayTitle}
        </Text>
      </View>

      {/* Subtitle */}
      <Text className="text-sm text-muted mt-2 tracking-wide">{subtitle}</Text>

      {/* Duration badge */}
      <View
        className="mt-4 px-4 py-2 border"
        style={{
          borderColor: config.titleColor,
          backgroundColor: `${config.titleColor}15`,
        }}
      >
        <View className="flex-row items-center">
          <View
            className="w-1.5 h-1.5 mr-2"
            style={{ backgroundColor: config.titleColor }}
          />
          <Text
            className="text-xs tracking-widest font-bold"
            style={{ color: config.titleColor }}
          >
            {duration}
          </Text>
          <View
            className="w-1.5 h-1.5 ml-2"
            style={{ backgroundColor: config.titleColor }}
          />
        </View>
      </View>

      {/* Bottom accent line */}
      <View className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
        <LinearGradient
          colors={[...config.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-full"
        />
      </View>
    </View>
  );
}
