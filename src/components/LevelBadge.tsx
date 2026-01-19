import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS, getLevelFromXP } from "../theme";

type LevelBadgeProps = {
  xp: number;
  size?: "sm" | "md" | "lg";
  showXP?: boolean;
};

const SIZES = {
  sm: { container: 40, text: 14, border: 2 },
  md: { container: 56, text: 20, border: 3 },
  lg: { container: 80, text: 28, border: 4 },
};

export function LevelBadge({ xp, size = "md", showXP = false }: LevelBadgeProps) {
  const level = getLevelFromXP(xp);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const sizeConfig = SIZES[size];

  // Get level color based on level
  const getLevelColor = () => {
    if (level >= 10) return COLORS.xpDiamond;
    if (level >= 8) return COLORS.xpPlatinum;
    if (level >= 6) return COLORS.xpGold;
    if (level >= 4) return COLORS.cyberPurple;
    if (level >= 2) return COLORS.neonBlue;
    return COLORS.toxicGreen;
  };

  useEffect(() => {
    // Subtle pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );

    // Glow animation
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim]);

  const levelColor = getLevelColor();

  return (
    <View className="items-center">
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        {/* Outer glow */}
        <Animated.View
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: sizeConfig.container / 2 + 4,
            backgroundColor: levelColor,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.4],
            }),
          }}
        />

        {/* Badge container */}
        <View
          style={{
            width: sizeConfig.container,
            height: sizeConfig.container,
            borderRadius: sizeConfig.container / 2,
            borderWidth: sizeConfig.border,
            borderColor: levelColor,
            backgroundColor: COLORS.nightBlack,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Inner gradient background */}
          <LinearGradient
            colors={[`${levelColor}20`, `${levelColor}05`]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <Text
            style={{
              fontSize: sizeConfig.text,
              fontWeight: "900",
              color: levelColor,
              letterSpacing: 1,
            }}
          >
            {level}
          </Text>
        </View>
      </Animated.View>

      {showXP && (
        <Text className="text-muted text-xs mt-2 tracking-wide">
          {xp.toLocaleString()} XP
        </Text>
      )}
    </View>
  );
}
