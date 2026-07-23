import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BreedInfo, DraftCat, SavedCat } from "@/types";
import { generateId, randomStickerTilt } from "@/utils/id";
import { deleteStickerFile } from "@/services/fileStorage";

interface CatState {
  /** Cats the user has saved into their collection. Persisted. */
  savedCats: SavedCat[];
  /** The in-progress cat currently being processed/reviewed. Not persisted. */
  draft: DraftCat | null;

  startDraft: (rawPhotoUri: string) => void;
  setDraftSticker: (stickerUri: string) => void;
  setDraftBreed: (breed: BreedInfo) => void;
  discardDraft: () => Promise<void>;

  saveDraft: (name: string) => void;

  uniqueBreedCount: () => number;
}

export const useCatStore = create<CatState>()(
  persist(
    (set, get) => ({
      savedCats: [],
      draft: null,

      startDraft: (rawPhotoUri) =>
        set({ draft: { rawPhotoUri, stickerUri: "", breed: null } }),

      setDraftSticker: (stickerUri) =>
        set((state) => ({
          draft: state.draft ? { ...state.draft, stickerUri } : state.draft,
        })),

      setDraftBreed: (breed) =>
        set((state) => ({
          draft: state.draft ? { ...state.draft, breed } : state.draft,
        })),

      discardDraft: async () => {
        const { draft } = get();
        if (draft?.stickerUri) {
          await deleteStickerFile(draft.stickerUri);
        }
        set({ draft: null });
      },

      saveDraft: (name) => {
        const { draft } = get();
        if (!draft || !draft.breed || !draft.stickerUri) return;

        const newCat: SavedCat = {
          id: generateId(),
          name: name.trim() || "Unnamed cat",
          stickerUri: draft.stickerUri,
          breed: draft.breed,
          createdAt: Date.now(),
          rotationDeg: randomStickerTilt(),
        };

        set((state) => ({
          savedCats: [newCat, ...state.savedCats],
          draft: null,
        }));
      },

      uniqueBreedCount: () => {
        const breeds = new Set(get().savedCats.map((c) => c.breed.breedName.toLowerCase()));
        return breeds.size;
      },
    }),
    {
      name: "cat-a-log-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Never persist the transient draft — a half-finished capture
      // shouldn't survive an app restart.
      partialize: (state) => ({ savedCats: state.savedCats }),
    }
  )
);
