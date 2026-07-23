import * as Sharing from "expo-sharing";

export class ShareUnavailableError extends Error {}

/**
 * Shares a saved cat's transparent sticker PNG through the native share
 * sheet (WhatsApp, Messages, etc. all handle transparent PNGs directly).
 */
export async function shareSticker(stickerUri: string, catName: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new ShareUnavailableError("Sharing isn't available on this device.");
  }

  await Sharing.shareAsync(stickerUri, {
    mimeType: "image/png",
    dialogTitle: `Share ${catName}`,
    UTI: "public.png",
  });
}
