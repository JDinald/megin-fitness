import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS, getLevelFromXP, getXPProgress } from "../theme";

type XPBarProps = {
  currentXP: number;
  showLevel?: boolean;
};

export function XPBar({ currentXP, showLevel = true }: XPBarProps) {
  const level = getLevelFromXP(currentXP);
  const { current, next, progress } = getXPProgress(currentXP);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Pulsing glow effect
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, [progress, animatedWidth, glowAnim]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="bg-concreteGray border border-steelGray p-4 mb-5">
      {/* Header row with level and XP */}
      <View className="flex-row justify-between items-center mb-3">
        {showLevel && (
          <View className="flex-row items-center">
            <View className="bg-cyber-purple/20 border border-cyber-purple px-3 py-1">
              <Text className="text-cyber-purple text-xs font-bold tracking-widest">
                LVL {level}
              </Text>
            </View>
          </View>
        )}
        <Text className="text-neon-blue text-sm font-bold">
          {currentXP.toLocaleString()} / {next.toLocaleString()} XP
        </Text>
      </View>

      {/* XP Bar container */}
      <View className="h-3 bg-steelGray rounded-sm overflow-hidden relative">
        {/* Animated fill */}
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
            colors={GRADIENTS.xpBar}
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
            backgroundColor: COLORS.cyberCyan,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
          }}
        />

        {/* Scan line effect */}
        <View
          className="absolute top-0 bottom-0 w-px bg-white/30"
          style={{ left: "50%" }}
        />
      </View>

      {/* XP to next level */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-muted text-xs tracking-wide">EXPERIENCE</Text>
        <Text className="text-muted text-xs">
          {(next - currentXP).toLocaleString()} XP to next level
        </Text>
      </View>
    </View>
  );
}
