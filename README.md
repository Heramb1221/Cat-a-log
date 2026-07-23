# Cat-a-log

Snap a cat, turn it into a sticker, learn its breed, name it, and keep it in your collection.

## Stack

- Expo (managed workflow + **custom dev client**, required by the native bg-removal module)
- expo-router (file-based navigation)
- expo-camera, expo-sharing, expo-file-system
- `@six33/react-native-bg-removal` — on-device background removal (native module)
- `@google/genai` — Gemini vision for breed identification
- zustand + AsyncStorage — state + persistence
- NativeWind / Tailwind — styling (most screens use plain `StyleSheet` for precise control over the sticker/paper look; NativeWind is wired up and ready for anything you want to build with utility classes)

## ⚠️ Before you run this

**This app cannot run in plain Expo Go.** `@six33/react-native-bg-removal` is a native module, so you need a custom dev client:

```bash
npm install
npx expo prebuild        # generates ios/ and android/ native projects
npx expo run:ios         # or: npx expo run:android
```

or, to build on EAS instead of locally:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Then run `npx expo start --dev-client` and open the app on your device/simulator through the installed dev client (not Expo Go).

## Environment setup

Copy `.env.example` to `.env` and add your Gemini API key:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

### Security note (read this)

Per your call, the Gemini key is called **directly from the client** using an `EXPO_PUBLIC_*` env var. This is simple, but it means the key is bundled into the compiled app and **can be extracted** by anyone with the APK/IPA and a bit of effort. That's fine for a prototype or a key with tight quotas/billing alerts, but before a public release you'd want to move the Gemini call behind a small server (even a single serverless function) that holds the key and forwards requests. The `services/gemini.ts` file is written so swapping the direct SDK call for a `fetch("https://your-proxy/identify")` call is a one-function change — nothing else in the app needs to know.

## Project structure

```
app/                  expo-router screens
  _layout.tsx         Stack navigator
  index.tsx           Camera screen (route "/")
  result.tsx          Processing → breed info → naming → save (route "/result")
  catalog.tsx          "My cat-a-log" collection grid (route "/catalog")
components/
  Sticker.tsx         Renders a transparent PNG with the white "die-cut" outline
  PaperBackground.tsx Dotted paper texture (SVG pattern, not per-dot views)
  InfoCard.tsx         Breed field-guide card (name, origin badge, description, fun fact)
  NameCatModal.tsx     "What's that cat's name?" prompt
  ProgressHeader.tsx   Collection header (breeds discovered / total caught)
  CatGridCard.tsx      One sticker in the 2-column grid, with share button
  LoadingOverlay.tsx   Spinner + "Identifying breed…" state
services/
  backgroundRemoval.ts Wraps @six33/react-native-bg-removal, persists result to disk
  gemini.ts            Gemini call + strict JSON-schema validation + one retry
  share.ts              expo-sharing wrapper
  fileStorage.ts         Cleans up abandoned draft sticker files
store/
  catStore.ts           Zustand store: saved cats (persisted) + in-progress draft (not persisted)
types/index.ts           Shared types (BreedInfo, SavedCat, DraftCat, ProcessingStage)
constants/               Theme tokens, country → flag emoji lookup
utils/id.ts              UUID + random sticker tilt generator
```

## Design decisions worth knowing about

- **No fixed "X/73" target.** Per your call, the header shows a running count of unique breeds discovered plus total cats caught, instead of progress against a fixed master breed list. If you later want a Pokédex-style fixed target, `uniqueBreedCount()` in `catStore.ts` is the place to plug in a breed checklist.
- **Sticker outline** is faked via stacked, white-tinted, offset copies of the same transparent image (`Sticker.tsx`) rather than a native stroke filter, since RN has no built-in "stroke around alpha" primitive. It's cheap and looks right at the sizes used here; for a crisper edge at large sizes you could later swap this for a one-time server/on-device edge-detection pass baked into the PNG itself.
- **Gemini is called on the raw photo, not the cut-out sticker.** Background-removed images sometimes lose fur texture/color context at the edges; the original photo gives the model more to work with.
- **Draft cats aren't persisted.** If the app is killed mid-flow (after capture, before Save), the in-progress cat is gone and its temp sticker file is cleaned up on next mount — intentional, so you never end up with orphaned half-finished entries in storage.
- **Retry** re-runs the *entire* pipeline (background removal + Gemini) rather than just the failed step, since a background-removal failure means there's no sticker to send to Gemini anyway, and this keeps the state machine simple.

## Known rough edges / next steps

- Placeholder `assets/icon.png`, `splash.png`, `adaptive-icon.png` are solid-color stand-ins — swap in real artwork before shipping.
- No unit/integration tests yet.
- `flagForCountry` is a manual lookup table, not exhaustive — it'll fall back to a paw emoji for countries it doesn't recognize (Gemini's `originCountry` is free text, so this will happen sometimes).
- No image compression/resizing before sending to Gemini — large photos will work but cost more tokens/time per request.
