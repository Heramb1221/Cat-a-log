import React, { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCatStore } from "@/store/catStore";
import { colors, spacing } from "@/constants/theme";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [isCapturing, setIsCapturing] = useState(false);

  const savedCats = useCatStore((s) => s.savedCats);
  const startDraft = useCatStore((s) => s.startDraft);
  const lastCat = savedCats[0];

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Cat-a-log needs your camera</Text>
        <Text style={styles.permissionBody}>
          Snap photos of cats you meet to turn them into stickers for your collection.
        </Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant camera access</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) {
        startDraft(photo.uri);
        router.push("/result");
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing={facing} flash={flash} />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable
            hitSlop={12}
            style={styles.iconButton}
            onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
          >
            <Text style={styles.iconText}>{flash === "off" ? "⚡︎" : "⚡"}</Text>
          </Pressable>
          <Pressable
            hitSlop={12}
            style={styles.iconButton}
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          >
            <Text style={styles.iconText}>⟲</Text>
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <Pressable style={styles.thumbnail} onPress={() => router.push("/catalog")}>
            {lastCat ? (
              <Image source={{ uri: lastCat.stickerUri }} style={styles.thumbnailImage} />
            ) : (
              <Text style={styles.thumbnailPlaceholder}>🐱</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.shutterButton, isCapturing && styles.shutterButtonDisabled]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            <View style={styles.shutterInner} />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={() => router.push("/catalog")}>
            <Text style={styles.iconText}>▤</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const SHUTTER_SIZE = 76;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: colors.white,
    fontSize: 20,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    fontSize: 22,
  },
  shutterButton: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: SHUTTER_SIZE / 2,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterButtonDisabled: {
    opacity: 0.5,
  },
  shutterInner: {
    width: SHUTTER_SIZE - 16,
    height: SHUTTER_SIZE - 16,
    borderRadius: (SHUTTER_SIZE - 16) / 2,
    backgroundColor: colors.white,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  permissionBody: {
    fontSize: 15,
    color: colors.inkSoft,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
  },
  permissionButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
