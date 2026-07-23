import * as FileSystem from "expo-file-system";

/**
 * The background-removal service already writes into
 * `${documentDirectory}stickers/`, so saving a cat is just "keep this file
 * where it is" — nothing to move. This helper exists mainly to clean up an
 * abandoned draft's sticker file if the user backs out without saving,
 * so temp files don't pile up.
 */
export async function deleteStickerFile(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // Non-fatal — a stray file is not worth surfacing an error for.
  }
}
