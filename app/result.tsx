import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCatStore } from "@/store/catStore";
import { removeBackground, BackgroundRemovalError } from "@/services/backgroundRemoval";
import { identifyBreed, GeminiIdentificationError } from "@/services/gemini";
import { PaperBackground } from "@/components/PaperBackground";
import { Sticker } from "@/components/Sticker";
import { InfoCard } from "@/components/InfoCard";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { NameCatModal } from "@/components/NameCatModal";
import { colors, spacing } from "@/constants/theme";
import type { ProcessingStage } from "@/types";

export default function ResultScreen() {
  const router = useRouter();
  const draft = useCatStore((s) => s.draft);
  const setDraftSticker = useCatStore((s) => s.setDraftSticker);
  const setDraftBreed = useCatStore((s) => s.setDraftBreed);
  const discardDraft = useCatStore((s) => s.discardDraft);
  const saveDraft = useCatStore((s) => s.saveDraft);

  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [nameModalVisible, setNameModalVisible] = useState(false);

  const runPipeline = useCallback(async () => {
    if (!draft?.rawPhotoUri) return;
    setErrorMessage(null);

    try {
      setStage("removing-background");
      const stickerUri = await removeBackground(draft.rawPhotoUri);
      setDraftSticker(stickerUri);

      setStage("identifying-breed");
      const breed = await identifyBreed(draft.rawPhotoUri);
      setDraftBreed(breed);

      setStage("done");
    } catch (err) {
      setStage("error");
      if (err instanceof BackgroundRemovalError) {
        setErrorMessage(err.message || "Couldn't cut out this cat. Try a clearer shot.");
      } else if (err instanceof GeminiIdentificationError) {
        setErrorMessage(err.message || "Couldn't identify the breed. Give it another try.");
      } else {
        setErrorMessage("Something went wrong processing this photo.");
      }
    }
  }, [draft?.rawPhotoUri, setDraftSticker, setDraftBreed]);

  useEffect(() => {
    if (draft?.rawPhotoUri && stage === "idle") {
      runPipeline();
    }
  }, [draft?.rawPhotoUri, stage, runPipeline]);

  const handleClose = async () => {
    await discardDraft();
    router.back();
  };

  const handleSave = () => {
    saveDraft(catName);
    router.replace("/catalog");
  };

  if (!draft) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photo to show.</Text>
        <Pressable style={styles.retryButton} onPress={() => router.replace("/")}>
          <Text style={styles.retryText}>Back to camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const previewUri = draft.stickerUri || draft.rawPhotoUri;
  const isProcessing = stage === "removing-background" || stage === "identifying-breed";

  return (
    <PaperBackground>
      <SafeAreaView style={styles.safeArea}>
        <Pressable style={styles.closeButton} hitSlop={12} onPress={handleClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isProcessing && (
            <LoadingOverlay
              previewUri={previewUri}
              label={
                stage === "removing-background" ? "Cutting out the cat…" : "Identifying breed…"
              }
            />
          )}

          {stage === "error" && (
            <View style={styles.errorContainer}>
              <Sticker uri={previewUri} size={180} />
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Pressable style={styles.retryButton} onPress={runPipeline}>
                <Text style={styles.retryText}>↻ Retry</Text>
              </Pressable>
            </View>
          )}

          {stage === "done" && draft.breed && (
            <View style={styles.doneContainer}>
              <View style={styles.stickerWrap}>
                <Sticker uri={draft.stickerUri} size={220} />
                {catName.length > 0 && <Text style={styles.catNameLabel}>{catName}</Text>}
              </View>

              <Pressable style={styles.nameButton} onPress={() => setNameModalVisible(true)}>
                <Text style={styles.nameButtonText}>✎ {catName ? "Rename this cat" : "Name this cat"}</Text>
              </Pressable>

              <InfoCard breed={draft.breed} />

              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>⤓ Save</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <NameCatModal
        visible={nameModalVisible}
        initialName={catName}
        onCancel={() => setNameModalVisible(false)}
        onSave={(name) => {
          setCatName(name);
          setNameModalVisible(false);
        }}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginRight: spacing.md,
    marginTop: spacing.xs,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.washiGray,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 15,
    color: colors.ink,
    fontWeight: "700",
  },
  doneContainer: {
    alignItems: "center",
  },
  stickerWrap: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  catNameLabel: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.ink,
    marginTop: -spacing.sm,
    transform: [{ rotate: "-3deg" }],
  },
  nameButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentLight,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  nameButtonText: {
    color: colors.ink,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.accentLight,
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  errorText: {
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.ink,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
  },
  retryText: {
    color: colors.white,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
  emptyText: {
    color: colors.inkSoft,
    marginBottom: spacing.md,
  },
});
