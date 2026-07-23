import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing } from "@/constants/theme";

interface ProgressHeaderProps {
  uniqueBreeds: number;
  totalCaught: number;
  onSortPress?: () => void;
  onCollapsePress?: () => void;
}

/**
 * Mirrors the reference video's "My cat-a-log" header: a collapse chevron,
 * title, sort toggle, a "breeds discovered" count, and a total-caught line.
 * There's no fixed target (per product decision), so instead of "X/73" we
 * show the running count of unique breeds plus total cats logged.
 */
export function ProgressHeader({
  uniqueBreeds,
  totalCaught,
  onSortPress,
  onCollapsePress,
}: ProgressHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable hitSlop={12} onPress={onCollapsePress}>
          <Text style={styles.chevron}>⌃</Text>
        </Pressable>
        <Text style={styles.title}>My cat-a-log</Text>
        <Pressable hitSlop={12} onPress={onSortPress}>
          <Text style={styles.sortIcon}>⇅</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.breedsText}>{uniqueBreeds} breeds discovered</Text>
      </View>
      <Text style={styles.caughtText}>Caught: {totalCaught}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  chevron: {
    fontSize: 22,
    color: colors.ink,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.ink,
  },
  sortIcon: {
    fontSize: 20,
    color: colors.ink,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breedsText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
  caughtText: {
    fontSize: 13,
    color: colors.inkSoft,
  },
});
