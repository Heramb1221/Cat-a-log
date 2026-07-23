import uuid from "react-native-uuid";

export function generateId(): string {
  return uuid.v4() as string;
}

/** A gentle random tilt so each saved sticker looks hand-placed on the
 * collection page, matching the reference video's grid look. */
export function randomStickerTilt(): number {
  const magnitude = 3 + Math.random() * 5; // 3–8 degrees
  return Math.random() > 0.5 ? magnitude : -magnitude;
}
