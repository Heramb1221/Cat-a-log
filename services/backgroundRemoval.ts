import * as FileSystem from "expo-file-system";
// NOTE: this package requires a custom dev client / EAS build — it will
// throw a linking error if run inside plain Expo Go. See README "Before
// you run this". It also can't run on the iOS Simulator (falls back to
// returning the original image) and on iOS < 17 throws
// 'REQUIRES_API_FALLBACK', which we surface as a normal error here since
// this app has no cloud fallback wired up.
import { removeBackground as removeBackgroundNative } from "@six33/react-native-bg-removal";

export class BackgroundRemovalError extends Error {}

/**
 * Runs on-device ML background removal on a captured photo and returns a
 * file:// URI pointing at the resulting transparent PNG, copied into a
 * stable app-owned directory so it isn't cleaned up as a temp file.
 */
export async function removeBackground(sourceUri: string): Promise<string> {
  let resultUri: string;

  try {
    resultUri = await removeBackgroundNative(sourceUri, { trim: true });
  } catch (err) {
    if (err instanceof Error && err.message === "REQUIRES_API_FALLBACK") {
      throw new BackgroundRemovalError(
        "This device's OS is too old for on-device background removal (needs iOS 17+ / a recent Android with MLKit). A cloud fallback isn't wired up yet."
      );
    }
    throw new BackgroundRemovalError(
      err instanceof Error ? err.message : "Background removal failed."
    );
  }

  if (!resultUri) {
    throw new BackgroundRemovalError("Background removal returned no image.");
  }

  try {
    const stickersDir = `${FileSystem.documentDirectory}stickers/`;
    const dirInfo = await FileSystem.getInfoAsync(stickersDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(stickersDir, { intermediates: true });
    }

    const destUri = `${stickersDir}${Date.now()}.png`;
    await FileSystem.copyAsync({ from: resultUri, to: destUri });
    return destUri;
  } catch (err) {
    throw new BackgroundRemovalError(
      err instanceof Error ? err.message : "Couldn't save the processed sticker."
    );
  }
}
