import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS } from "../theme";

type AchievementType = "workout" | "streak" | "pr" | "volume" | "level";

type AchievementBadgeProps = {
  type: AchievementType;
  title: string;
  subtitle?: string;
  value?: string | number;
  unlocked?: boolean;
};

const ACHIEVEMENT_CONFIG: Record<AchievementType, { icon: string; colors: readonly [string, string] }> = {
  workout: { icon: "W", colors: ["#39FF14", "#00D4FF"] as const },
  streak: { icon: "S", colors: ["#FF6600", "#FFD700"] as const },
  pr: { icon: "PR", colors: ["#FF00E5", "#8B5CF6"] as const },
  volume: { icon: "V", colors: ["#4a0080", "#39FF14"] as const },
  level: { icon: "L", colors: ["#FFD700", "#FF00FF"] as const },
};

export function AchievementBadge({
  type,
  title,
  subtitle,
  value,
  unlocked = true,
}: AchievementBadgeProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const config = ACHIEVEMENT_CONFIG[type];

  useEffect(() => {
    if (!unlocked) return;

    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [unlocked, shimmerAnim]);

  return (
    <View
      className={`flex-row items-center p-3 mb-3 border ${
        unlocked ? "bg-concreteGray border-steelGray" : "bg-nightBlack border-steelGray/50"
      }`}
      style={{ opacity: unlocked ? 1 : 0.5 }}
    >
      {/* Icon badge */}
      <View className="relative mr-4">
        <Animated.View
          style={{
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 4,
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
            }),
          }}
        >
          <LinearGradient
            colors={config.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: 4 }}
          />
        </Animated.View>

        <View
          className="w-12 h-12 items-center justify-center border-2"
          style={{ borderColor: config.colors[0], backgroundColor: COLORS.nightBlack }}
        >
          <LinearGradient
            colors={[`${config.colors[0]}30`, `${config.colors[1]}10`]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Text
            className="font-black text-base"
            style={{ color: config.colors[0] }}
          >
            {config.icon}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-boneWhite font-bold text-sm">{title}</Text>
        {subtitle && <Text className="text-muted text-xs mt-0.5">{subtitle}</Text>}
      </View>

      {/* Value */}
      {value && (
        <View className="items-end">
          <Text
            className="font-black text-lg"
            style={{ color: config.colors[0] }}
          >
            {value}
          </Text>
        </View>
      )}

      {/* Locked overlay */}
      {!unlocked && (
        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
          <Text className="text-muted text-2xl">?</Text>
        </View>
      )}
    </View>
  );
}
