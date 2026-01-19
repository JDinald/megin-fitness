import React, { useEffect, useRef } from "react";
import { View, Animated, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme";

type CyberCardVariant = "default" | "power" | "survival" | "beast" | "gold" | "holo";

type CyberCardProps = {
  children: React.ReactNode;
  variant?: CyberCardVariant;
  glowIntensity?: "none" | "subtle" | "medium" | "strong";
  animated?: boolean;
  style?: ViewStyle;
};

const VARIANT_COLORS: Record<CyberCardVariant, { border: string; glow: string; accent: string }> = {
  default: { border: COLORS.steelGray, glow: COLORS.cyberCyan, accent: COLORS.cyberCyan },
  power: { border: COLORS.infectedOrange, glow: COLORS.infectedOrange, accent: COLORS.infectedOrange },
  survival: { border: COLORS.toxicGreen, glow: COLORS.toxicGreen, accent: COLORS.toxicGreen },
  beast: { border: COLORS.beastPurple, glow: COLORS.cyberPurple, accent: COLORS.beastPurple },
  gold: { border: COLORS.longevityGold, glow: COLORS.xpGold, accent: COLORS.longevityGold },
  holo: { border: COLORS.cyberMagenta, glow: COLORS.cyberCyan, accent: COLORS.cyberMagenta },
};

const GLOW_OPACITY = {
  none: 0,
  subtle: 0.1,
  medium: 0.2,
  strong: 0.35,
};

export function CyberCard({
  children,
  variant = "default",
  glowIntensity = "subtle",
  animated = false,
  style,
}: CyberCardProps) {
  const colors = VARIANT_COLORS[variant];
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // Pulsing glow
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );

    // Scanline sweep
    const scanline = Animated.loop(
      Animated.sequence([
        Animated.timing(scanlineAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(scanlineAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );

    glow.start();
    scanline.start();

    return () => {
      glow.stop();
      scanline.stop();
    };
  }, [animated, glowAnim, scanlineAnim]);

  const baseGlowOpacity = GLOW_OPACITY[glowIntensity];

  return (
    <View
      className="relative overflow-hidden"
      style={[
        {
          backgroundColor: COLORS.concreteGray,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* Top accent line */}
      <View
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: colors.accent }}
      />

      {/* Corner accents */}
      <View
        className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2"
        style={{ borderColor: colors.accent }}
      />
      <View
        className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2"
        style={{ borderColor: colors.accent }}
      />
      <View
        className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2"
        style={{ borderColor: colors.accent }}
      />
      <View
        className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2"
        style={{ borderColor: colors.accent }}
      />

      {/* Animated glow overlay */}
      {animated && glowIntensity !== "none" && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.glow,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [baseGlowOpacity * 0.5, baseGlowOpacity],
            }),
          }}
        />
      )}

      {/* Static glow */}
      {!animated && glowIntensity !== "none" && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.glow,
            opacity: baseGlowOpacity,
          }}
        />
      )}

      {/* Scanline effect */}
      {animated && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: colors.accent,
            opacity: 0.1,
            transform: [
              {
                translateY: scanlineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 200],
                }),
              },
            ],
          }}
        />
      )}

      {/* Content */}
      {children}
    </View>
  );
}
