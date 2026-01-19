import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, TextInput, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Exercise } from "../types/workout";
import { COLORS } from "../theme";

type ExerciseCardProps = {
  ex: Exercise;
  checked: boolean;
  setsDone?: boolean[];
  weights?: number[];
  onToggle: () => void;
  onToggleSet: (setIndex: number) => void;
  onSetWeight?: (setIndex: number, weight: number) => void;
  primaryColor?: string;
};

export function ExerciseCard({
  ex,
  checked,
  setsDone,
  weights,
  onToggle,
  onToggleSet,
  onSetWeight,
  primaryColor = COLORS.beastPurple,
}: ExerciseCardProps) {
  const neonPulse = useRef(new Animated.Value(0)).current;
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!checked) {
      neonPulse.stopAnimation();
      neonPulse.setValue(0);
      scanLine.stopAnimation();
      return;
    }

    // Neon pulse effect when completed
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(neonPulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(neonPulse, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );

    // Scanline sweep effect
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );

    pulseLoop.start();
    scanLoop.start();

    return () => {
      pulseLoop.stop();
      scanLoop.stop();
    };
  }, [checked, neonPulse, scanLine]);

  const leftColor = checked
    ? COLORS.completeGreen
    : ex.variant === "pull" || ex.variant === "longevity"
    ? COLORS.longevityGold
    : primaryColor;

  const checkboxBorder =
    ex.variant === "pull" || ex.variant === "longevity" ? COLORS.longevityGold : primaryColor;

  const glowColor = checked ? COLORS.completeGreen : primaryColor;

  return (
    <View
      className="relative mb-3 overflow-hidden"
      style={{
        backgroundColor: COLORS.concreteGray,
        borderWidth: 1,
        borderColor: checked ? COLORS.completeGreen : COLORS.steelGray,
        opacity: checked ? 0.85 : 1,
      }}
    >
      {/* Corner accents - futuristic design */}
      <View
        className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
        style={{ borderColor: leftColor }}
      />
      <View
        className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
        style={{ borderColor: leftColor }}
      />
      <View
        className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
        style={{ borderColor: leftColor }}
      />
      <View
        className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
        style={{ borderColor: leftColor }}
      />

      {/* Left accent bar */}
      <View
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: leftColor }}
      />

      {/* Neon glow overlay (visible when completed) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderWidth: 1,
            borderColor: `${glowColor}70`,
            opacity: neonPulse.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }),
          },
        ]}
      >
        <LinearGradient
          colors={[`${glowColor}00`, `${glowColor}25`, `${glowColor}00`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Scanline effect */}
      {checked && (
        <Animated.View
          pointerEvents="none"
          className="absolute left-0 right-0 h-px"
          style={{
            backgroundColor: COLORS.cyberCyan,
            opacity: 0.3,
            transform: [
              {
                translateY: scanLine.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 120],
                }),
              },
            ],
          }}
        />
      )}

      {/* Main pressable content */}
      <Pressable onPress={onToggle} className="flex-row items-center p-4">
        {/* Checkbox */}
        <View className="w-7 h-7 items-center justify-center mr-4">
          <View
            className="w-7 h-7 items-center justify-center"
            style={{
              borderWidth: 2,
              borderColor: checked ? COLORS.completeGreen : checkboxBorder,
              backgroundColor: checked ? COLORS.completeGreen : "transparent",
            }}
          >
            {checked && (
              <Text className="text-nightBlack font-black text-xs">OK</Text>
            )}
          </View>
        </View>

        {/* Exercise info */}
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center">
            <Text
              className={`text-base font-bold mr-2 ${
                checked ? "line-through text-muted" : "text-boneWhite"
              }`}
              numberOfLines={1}
            >
              {ex.name}
            </Text>

            {ex.badge && (
              <View
                className="px-2 py-0.5"
                style={{
                  backgroundColor:
                    ex.badge.kind === "beast"
                      ? `${COLORS.beastPurple}40`
                      : `${COLORS.longevityGold}30`,
                }}
              >
                <Text
                  className="text-xs font-black tracking-wider"
                  style={{
                    color:
                      ex.badge.kind === "beast"
                        ? COLORS.cyberPurple
                        : COLORS.longevityGold,
                  }}
                >
                  {ex.badge.text}
                </Text>
              </View>
            )}
          </View>

          {ex.detail && (
            <Text className="text-xs text-muted mt-1">{ex.detail}</Text>
          )}
        </View>

        {/* Right side - sets/reps info */}
        <View className="items-end ml-2">
          <Text
            className="text-sm font-black"
            style={{ color: COLORS.neonBlue }}
          >
            {ex.rightTop}
          </Text>
          {ex.rightBottom && (
            <Text className="text-xs text-muted mt-1">{ex.rightBottom}</Text>
          )}
        </View>
      </Pressable>

      {/* Set tracker with weight input */}
      {ex.setsCount && ex.setsCount > 0 && (
        <View className="flex-row flex-wrap pl-14 pr-4 pb-4">
          {Array.from({ length: ex.setsCount }).map((_, i) => {
            const done = !!setsDone?.[i];
            const weight = weights?.[i] ?? 0;
            const showWeightInput = ex.repsPerSet && ex.repsPerSet > 0;

            return (
              <View key={`${ex.id}-set-${i}`} className="items-center mr-3 mb-2">
                <Pressable
                  onPress={() => onToggleSet(i)}
                  className="w-10 h-10 items-center justify-center"
                  style={({ pressed }) => ({
                    backgroundColor: done ? COLORS.completeGreen : COLORS.steelGray,
                    borderWidth: 1,
                    borderColor: done ? COLORS.completeGreen : "#444",
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}
                >
                  <Text
                    className="text-sm font-black"
                    style={{ color: done ? COLORS.nightBlack : "#666" }}
                  >
                    {i + 1}
                  </Text>
                </Pressable>

                {showWeightInput && (
                  <View className="flex-row items-center mt-1">
                    <TextInput
                      className="w-10 h-6 text-center text-xs"
                      style={{
                        backgroundColor: COLORS.nightBlack,
                        borderWidth: 1,
                        borderColor: done ? COLORS.neonBlue : "#444",
                        color: COLORS.boneWhite,
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#555"
                      value={weight > 0 ? String(weight) : ""}
                      onChangeText={(text) => {
                        const parsed = parseFloat(text) || 0;
                        onSetWeight?.(i, parsed);
                      }}
                    />
                    <Text className="text-xs text-muted ml-1">kg</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Bottom status bar */}
      <View
        className="h-0.5"
        style={{
          backgroundColor: checked ? COLORS.completeGreen : leftColor,
          opacity: 0.5,
        }}
      />
    </View>
  );
}
