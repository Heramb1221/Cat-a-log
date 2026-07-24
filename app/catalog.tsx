import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCatStore } from "@/store/catStore";
import { PaperBackground } from "@/components/PaperBackground";
import { ProgressHeader } from "@/components/ProgressHeader";
import { CatGridCard } from "@/components/CatGridCard";
import { NameCatModal } from "@/components/NameCatModal";
import { shareSticker, ShareUnavailableError } from "@/services/share";
import type { SavedCat } from "@/types";
import { colors, spacing } from "@/constants/theme";

type SortMode = "newest" | "oldest" | "name";

export default function CatalogScreen() {
  const router = useRouter();
  const savedCats = useCatStore((s) => s.savedCats);
  const uniqueBreedCount = useCatStore((s) => s.uniqueBreedCount);
  const updateCatName = useCatStore((s) => s.updateCatName);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [shareError, setShareError] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<SavedCat | null>(null);

  const sortedCats = [...savedCats].sort((a, b) => {
    if (sortMode === "newest") return b.createdAt - a.createdAt;
    if (sortMode === "oldest") return a.createdAt - b.createdAt;
    return a.name.localeCompare(b.name);
  });

  const cycleSortMode = () => {
    setSortMode((m) => (m === "newest" ? "oldest" : m === "oldest" ? "name" : "newest"));
  };

  const handleShare = async (cat: SavedCat) => {
    try {
      await shareSticker(cat.stickerUri, cat.name);
    } catch (err) {
      setShareError(
        err instanceof ShareUnavailableError
          ? err.message
          : "Couldn't share this sticker right now."
      );
    }
  };

  return (
    <PaperBackground>
      <SafeAreaView style={styles.safeArea}>
        <ProgressHeader
          uniqueBreeds={uniqueBreedCount()}
          totalCaught={savedCats.length}
          onSortPress={cycleSortMode}
          onCollapsePress={() => router.back()}
        />

        {shareError && (
          <Pressable style={styles.errorBanner} onPress={() => setShareError(null)}>
            <Text style={styles.errorBannerText}>{shareError}</Text>
          </Pressable>
        )}

        {sortedCats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyTitle}>No cats caught yet</Text>
            <Text style={styles.emptyBody}>
              Go find a cat and snap a photo to start your collection.
            </Text>
            <Pressable style={styles.cameraButton} onPress={() => router.replace("/")}>
              <Text style={styles.cameraButtonText}>Open camera</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={sortedCats}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContent}
            renderItem={({ item }) => (
              <CatGridCard
                cat={item}
                onSharePress={() => handleShare(item)}
                onRenamePress={() => setEditingCat(item)}
              />
            )}
          />
        )}

        <Pressable style={styles.fab} onPress={() => router.replace("/")}>
          <Text style={styles.fabIcon}>➤</Text>
        </Pressable>
      </SafeAreaView>

      <NameCatModal
        visible={editingCat !== null}
        initialName={editingCat?.name ?? ""}
        onCancel={() => setEditingCat(null)}
        onSave={(newName) => {
          if (editingCat) {
            updateCatName(editingCat.id, newName);
          }
          setEditingCat(null);
        }}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  gridContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl * 2,
  },
  errorBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: "#FBE9E7",
    borderRadius: 10,
    padding: spacing.sm,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  cameraButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
  },
  cameraButtonText: {
    color: colors.white,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 20,
    transform: [{ rotate: "-45deg" }],
  },
});
