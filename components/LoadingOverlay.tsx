import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Sticker } from "@/components/Sticker";
import { colors, spacing } from "@/constants/theme";

interface LoadingOverlayProps {
  /** Preview image shown while processing — the raw photo before the
   * background-removal step resolves, then the sticker once it does. */
  previewUri: string;
  label: string;
}

export function LoadingOverlay({ previewUri, label }: LoadingOverlayProps) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Sticker uri={previewUri} size={180} />
      <Animated.Text style={[styles.spinner, { transform: [{ rotate }] }]}>◐</Animated.Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xl * 2,
  },
  spinner: {
    fontSize: 32,
    color: colors.inkSoft,
    marginTop: spacing.xl,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: "600",
    color: colors.inkSoft,
  },
});
