import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated, TextInput } from "react-native";
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
  const neon = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!checked) {
      neon.stopAnimation();
      neon.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(neon, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(neon, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [checked, neon]);

  const leftColor =
    checked
      ? COLORS.completeGreen
      : ex.variant === "pull" || ex.variant === "longevity"
      ? COLORS.longevityGold
      : primaryColor;

  const checkboxBorder =
    ex.variant === "pull" || ex.variant === "longevity" ? COLORS.longevityGold : primaryColor;

  return (
    <View style={[styles.card, checked && styles.cardCompleted]}>
      {/* left accent */}
      <View style={[styles.cardAccent, { backgroundColor: leftColor }]} />

      {/* RED NEON OVERLAY (only visible when checked) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.neonOverlay,
          {
            opacity: neon.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.35] }),
            transform: [
              { scale: neon.interpolate({ inputRange: [0, 1], outputRange: [1, 1.01] }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,26,26,0.0)", "rgba(255,26,26,0.20)", "rgba(255,26,26,0.0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Pressable onPress={onToggle} style={styles.cardMain}>
        {/* Checkbox */}
        <View style={styles.checkboxBox}>
          <View
            style={[
              styles.checkbox,
              { borderColor: checkboxBorder },
              checked && { backgroundColor: COLORS.completeGreen, borderColor: COLORS.completeGreen },
            ]}
          >
            <Text style={[styles.checkboxTick, checked && { color: COLORS.nightBlack }]}> </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.cardName, checked && styles.cardNameCompleted]} numberOfLines={1}>
              {ex.name}
            </Text>

            {!!ex.badge ? (
              <View
                style={[
                  styles.badge,
                  ex.badge.kind === "beast" && { backgroundColor: "rgba(74,0,128,0.30)" },
                  (ex.badge.kind === "pull" || ex.badge.kind === "core") && { backgroundColor: "rgba(212,175,55,0.20)" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    ex.badge.kind === "beast" && { color: COLORS.beastPurple },
                    (ex.badge.kind === "pull" || ex.badge.kind === "core") && { color: COLORS.longevityGold },
                  ]}
                >
                  {ex.badge.text}
                </Text>
              </View>
            ) : null}
          </View>

          {!!ex.detail ? <Text style={styles.cardDetail}>{ex.detail}</Text> : null}
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          <Text style={styles.rightTop}>{ex.rightTop}</Text>
          {!!ex.rightBottom ? <Text style={styles.rightBottom}>{ex.rightBottom}</Text> : null}
        </View>
      </Pressable>

      {/* Set tracker with weight input */}
      {ex.setsCount && ex.setsCount > 0 ? (
        <View style={styles.setRow}>
          {Array.from({ length: ex.setsCount }).map((_, i) => {
            const done = !!setsDone?.[i];
            const weight = weights?.[i] ?? 0;
            const showWeightInput = ex.repsPerSet && ex.repsPerSet > 0;
            return (
              <View key={`${ex.id}-set-${i}`} style={styles.setContainer}>
                <Pressable
                  onPress={() => onToggleSet(i)}
                  style={({ pressed }) => [
                    styles.setBtn,
                    done && styles.setBtnDone,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <Text style={[styles.setBtnText, done && styles.setBtnTextDone]}>{i + 1}</Text>
                </Pressable>
                {showWeightInput && (
                  <View style={styles.weightInputContainer}>
                    <TextInput
                      style={[styles.weightInput, done && styles.weightInputDone]}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#555"
                      value={weight > 0 ? String(weight) : ""}
                      onChangeText={(text) => {
                        const parsed = parseFloat(text) || 0;
                        onSetWeight?.(i, parsed);
                      }}
                    />
                    <Text style={styles.weightUnit}>kg</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: "relative", backgroundColor: COLORS.concreteGray, borderWidth: 1, borderColor: COLORS.steelGray, marginBottom: 10, overflow: "hidden" },
  cardCompleted: { opacity: 0.8 },
  cardAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },

  neonOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(255,26,26,0.45)",
  },

  cardMain: { flexDirection: "row", alignItems: "center", padding: 15 },

  checkboxBox: { width: 28, height: 28, alignItems: "center", justifyContent: "center", marginRight: 15 },
  checkbox: { width: 28, height: 28, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  checkboxTick: { fontSize: 16, color: "transparent", fontWeight: "900" },

  cardInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  cardName: { fontSize: 15, fontWeight: "700", color: COLORS.boneWhite, marginRight: 8 },
  cardNameCompleted: { textDecorationLine: "line-through", color: "#666" },
  cardDetail: { fontSize: 12, color: "#666", marginTop: 3 },

  badge: { paddingVertical: 2, paddingHorizontal: 6 },
  badgeText: { fontSize: 9, letterSpacing: 1, fontWeight: "800" },

  cardRight: { alignItems: "flex-end" },
  rightTop: { fontSize: 14, color: COLORS.toxicGreen, fontWeight: "800" },
  rightBottom: { fontSize: 11, color: "#555", marginTop: 2 },

  setRow: { flexDirection: "row", flexWrap: "wrap", paddingLeft: 58, paddingRight: 15, paddingBottom: 15 },
  setContainer: { alignItems: "center", marginRight: 12, marginBottom: 8 },
  setBtn: { width: 36, height: 36, backgroundColor: COLORS.steelGray, borderWidth: 1, borderColor: "#444", alignItems: "center", justifyContent: "center" },
  setBtnDone: { backgroundColor: COLORS.completeGreen, borderColor: COLORS.completeGreen },
  setBtnText: { fontSize: 14, color: "#666", fontWeight: "800" },
  setBtnTextDone: { color: COLORS.nightBlack },
  weightInputContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  weightInput: { width: 40, height: 24, backgroundColor: COLORS.nightBlack, borderWidth: 1, borderColor: "#444", color: COLORS.boneWhite, fontSize: 12, textAlign: "center", paddingHorizontal: 2, paddingVertical: 0 },
  weightInputDone: { borderColor: COLORS.completeGreen },
  weightUnit: { fontSize: 10, color: COLORS.muted, marginLeft: 2 },
});
