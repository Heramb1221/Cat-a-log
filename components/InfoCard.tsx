import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BreedInfo } from "@/types";
import { flagForCountry } from "@/constants/countryFlags";
import { colors, radii, spacing } from "@/constants/theme";

interface InfoCardProps {
  breed: BreedInfo;
}

/**
 * The "paper field guide" card shown under the sticker on the result
 * screen: breed name, origin badge, description, and a fun fact — styled
 * to look like a taped-in index card, echoing the reference video.
 */
export function InfoCard({ breed }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.breedName}>{breed.breedName}</Text>

      <View style={styles.originBadge}>
        <Text style={styles.originFlag}>{flagForCountry(breed.originCountry)}</Text>
        <Text style={styles.originText}>{breed.originCountry}</Text>
      </View>

      <Text style={styles.description}>{breed.description}</Text>

      <View style={styles.tapeStripLeft} />
      <View style={styles.tapeStripRight} />
      <View style={styles.funFactBox}>
        <Text style={styles.funFactLabel}>Fun fact</Text>
        <Text style={styles.funFactText}>{breed.funFact}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  breedName: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  originBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.accentLight,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  originFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  originText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
    marginBottom: spacing.lg,
  },
  tapeStripLeft: {
    position: "absolute",
    top: -6,
    left: 12,
    width: 46,
    height: 18,
    backgroundColor: "rgba(232, 223, 200, 0.85)",
    transform: [{ rotate: "-8deg" }],
  },
  tapeStripRight: {
    position: "absolute",
    top: -6,
    right: 12,
    width: 46,
    height: 18,
    backgroundColor: "rgba(217, 213, 206, 0.85)",
    transform: [{ rotate: "8deg" }],
  },
  funFactBox: {
    borderWidth: 1,
    borderColor: colors.washiGray,
    borderStyle: "dashed",
    borderRadius: radii.sm,
    padding: spacing.md,
  },
  funFactLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.accent,
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
});
