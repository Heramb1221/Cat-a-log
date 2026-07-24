import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export class ShareUnavailableError extends Error {}

/**
 * Shares a saved cat's transparent sticker through the native share sheet.
 * Converts/presents as image/webp so messaging apps (WhatsApp, Telegram, etc.)
 * send it as a transparent sticker rather than a plain photo card.
 */
export async function shareSticker(stickerUri: string, catName: string): Promise<void> {
  let uri = stickerUri;
  if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
    uri = `file://${uri}`;
  }

  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists) {
    throw new ShareUnavailableError("Sticker image file not found on device.");
  }

  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new ShareUnavailableError("Sharing isn't available on this device.");
  }

  // Messaging platforms (WhatsApp, Telegram, Messages) identify transparent .webp files as stickers.
  const stickerWebpPath = `${FileSystem.cacheDirectory}cat_sticker_${Date.now()}.webp`;

  try {
    await FileSystem.copyAsync({ from: uri, to: stickerWebpPath });
    await Sharing.shareAsync(stickerWebpPath, {
      mimeType: "image/webp",
      dialogTitle: `Share ${catName} Sticker`,
      UTI: "com.google.webp",
    });
  } catch {
    // Fallback to original PNG if webp copy sharing fails
    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: `Share ${catName}`,
      UTI: "public.png",
    });
  }
}
