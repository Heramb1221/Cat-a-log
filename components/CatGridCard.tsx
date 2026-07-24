import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { SavedCat } from "@/types";
import { Sticker } from "@/components/Sticker";
import { colors, spacing } from "@/constants/theme";

interface CatGridCardProps {
  cat: SavedCat;
  onPress?: () => void;
  onSharePress?: () => void;
  onRenamePress?: () => void;
}

const CARD_SIZE = 150;

export function CatGridCard({ cat, onPress, onSharePress, onRenamePress }: CatGridCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Sticker uri={cat.stickerUri} size={CARD_SIZE} rotationDeg={cat.rotationDeg} />
      <Pressable style={styles.nameRow} onPress={onRenamePress}>
        <Text style={styles.name} numberOfLines={1}>
          {cat.name}
        </Text>
        <Text style={styles.editIcon}>✎</Text>
      </Pressable>

      <Pressable hitSlop={10} style={styles.shareButton} onPress={onSharePress}>
        <Text style={styles.shareIcon}>↗</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    alignItems: "center",
    marginBottom: spacing.lg,
    position: "relative",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  name: {
    fontFamily: undefined,
    fontSize: 18,
    color: colors.ink,
    fontWeight: "600",
    maxWidth: 110,
  },
  editIcon: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },
  shareButton: {
    position: "absolute",
    top: 4,
    right: 12,
    backgroundColor: colors.white,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  shareIcon: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: "700",
  },
});
