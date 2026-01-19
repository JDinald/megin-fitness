import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS } from "../theme";

type ProgressBarProps = {
  completedCount: number;
  totalCount: number;
  progress: number;
  variant?: "power" | "survival" | "beast";
};

const VARIANT_CONFIG = {
  power: {
    gradient: GRADIENTS.mondayPower,
    accentColor: COLORS.infectedOrange,
  },
  survival: {
    gradient: GRADIENTS.wednesdaySurvival,
    accentColor: COLORS.toxicGreen,
  },
  beast: {
    gradient: GRADIENTS.xpBar,
    accentColor: COLORS.cyberPurple,
  },
};

export function ProgressBar({
  completedCount,
  totalCount,
  progress,
  variant = "beast",
}: ProgressBarProps) {
  const config = VARIANT_CONFIG[variant];
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  const isComplete = completedCount === totalCount && totalCount > 0;

  useEffect(() => {
    // Animate progress bar width
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Pulse effect when active
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );

    // Scanline effect
    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );

    pulse.start();
    scan.start();

    return () => {
      pulse.stop();
      scan.stop();
    };
  }, [progress, animatedWidth, pulseAnim, scanAnim]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      className="p-4 mb-5 relative overflow-hidden"
      style={{
        backgroundColor: COLORS.concreteGray,
        borderWidth: 1,
        borderColor: isComplete ? COLORS.completeGreen : COLORS.steelGray,
      }}
    >
      {/* Corner accents */}
      <View
        className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
        style={{ borderColor: config.accentColor }}
      />
      <View
        className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
        style={{ borderColor: config.accentColor }}
      />
      <View
        className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
        style={{ borderColor: config.accentColor }}
      />
      <View
        className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
        style={{ borderColor: config.accentColor }}
      />

      {/* Header row */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View
            className="w-1.5 h-1.5 mr-2"
            style={{ backgroundColor: config.accentColor }}
          />
          <Text className="text-xs tracking-widest text-muted uppercase">
            Mission Progress
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text
            className="text-lg font-black"
            style={{ color: isComplete ? COLORS.completeGreen : COLORS.neonBlue }}
          >
            {completedCount}
          </Text>
          <Text className="text-sm text-muted mx-1">/</Text>
          <Text className="text-sm text-muted">{totalCount}</Text>
          {isComplete && (
            <View
              className="ml-2 px-2 py-0.5"
              style={{ backgroundColor: `${COLORS.completeGreen}30` }}
            >
              <Text
                className="text-xs font-black"
                style={{ color: COLORS.completeGreen }}
              >
                COMPLETE
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress bar container */}
      <View
        className="h-4 relative overflow-hidden"
        style={{ backgroundColor: COLORS.steelGray }}
      >
        {/* Animated progress fill */}
        <Animated.View
          style={{
            width: widthInterpolate,
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          <LinearGradient
            colors={isComplete ? [COLORS.completeGreen, COLORS.neonBlue] : [...config.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>

        {/* Glow overlay */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: config.accentColor,
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          }}
        />

        {/* Scanline effect */}
        <Animated.View
          pointerEvents="none"
          className="absolute top-0 bottom-0 w-px"
          style={{
            backgroundColor: COLORS.boneWhite,
            opacity: 0.5,
            transform: [
              {
                translateX: scanAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300],
                }),
              },
            ],
          }}
        />

        {/* Segment markers */}
        {totalCount > 1 &&
          Array.from({ length: totalCount - 1 }).map((_, i) => (
            <View
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${((i + 1) / totalCount) * 100}%`,
                backgroundColor: COLORS.nightBlack,
                opacity: 0.5,
              }}
            />
          ))}
      </View>

      {/* Percentage display */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-muted tracking-wide">
          {Math.round(progress * 100)}% COMPLETE
        </Text>
        <Text className="text-xs text-muted">
          {totalCount - completedCount} remaining
        </Text>
      </View>
    </View>
  );
}
