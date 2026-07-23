/**
 * A single identified cat breed, as returned (and strictly validated) from
 * the Gemini vision call.
 */
export interface BreedInfo {
  breedName: string;
  description: string;
  originCountry: string;
  funFact: string;
}

/**
 * One entry in the user's saved collection ("cat-a-log").
 * `stickerUri` points at a transparent PNG stored in the app's document
 * directory (see services/fileStorage.ts) so it survives app restarts.
 */
export interface SavedCat {
  id: string;
  name: string;
  stickerUri: string;
  breed: BreedInfo;
  createdAt: number;
  /** Random tilt in degrees, generated once at save time, used for the
   * "stuck onto a page" look in the collection grid. */
  rotationDeg: number;
}

/**
 * Transient state for a cat that has been photographed and processed but
 * not yet named/saved. Lives only in memory (Zustand), not persisted.
 */
export interface DraftCat {
  rawPhotoUri: string;
  stickerUri: string;
  breed: BreedInfo | null;
}

export type ProcessingStage =
  | "idle"
  | "removing-background"
  | "identifying-breed"
  | "done"
  | "error";
