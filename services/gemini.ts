import * as FileSystem from "expo-file-system";
import { GoogleGenAI } from "@google/genai";
import type { BreedInfo } from "@/types";

export class GeminiIdentificationError extends Error {}

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const PROMPT = `Identify the cat breed in this image. Return a JSON object strictly following this schema:
{ "breedName": string, "description": string, "originCountry": string, "funFact": string }

Rules:
- Respond with ONLY the JSON object. No markdown fences, no commentary, no leading/trailing text.
- "breedName" should be a commonly recognized breed name (e.g. "Scottish Fold Longhair"). If the cat looks like a mixed/random-bred cat with no clear pedigree, use "Domestic Shorthair" or "Domestic Longhair" as appropriate.
- "description" should be 2-4 sentences, written like a friendly field guide entry.
- "originCountry" should be the country (or region, e.g. "Scotland") the breed originated from.
- "funFact" should be a single short, genuinely interesting sentence.`;

function isValidBreedInfo(value: unknown): value is BreedInfo {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.breedName === "string" &&
    v.breedName.trim().length > 0 &&
    typeof v.description === "string" &&
    typeof v.originCountry === "string" &&
    typeof v.funFact === "string"
  );
}

/** Gemini sometimes wraps JSON in ```json fences despite instructions;
 * strip them defensively before parsing. */
function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function callGemini(base64Image: string, mimeType: string): Promise<BreedInfo> {
  if (!API_KEY) {
    throw new GeminiIdentificationError(
      "Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to your .env file."
    );
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const response = await ai.models.generateContent({
    // Gemini 2.0 Flash was shut down in June 2026. 3.5 Flash-Lite is the
    // cheapest current model with vision support — plenty for a single
    // breed-identification call. Bump to "gemini-3.5-flash" if you want
    // stronger reasoning on trickier/mixed-breed photos.
    model: "gemini-3.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          { text: PROMPT },
          { inlineData: { mimeType, data: base64Image } },
        ],
      },
    ],
  });

  const text = response.text;
  if (!text) {
    throw new GeminiIdentificationError("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = extractJson(text);
  } catch {
    throw new GeminiIdentificationError("Gemini response was not valid JSON.");
  }

  if (!isValidBreedInfo(parsed)) {
    throw new GeminiIdentificationError("Gemini response didn't match the expected schema.");
  }

  return parsed;
}

/**
 * Identifies the breed of the cat in the given photo. Retries once on a
 * malformed/schema-mismatched response before giving up, since LLM JSON
 * output occasionally needs a second attempt.
 */
export async function identifyBreed(photoUri: string): Promise<BreedInfo> {
  const base64Image = await FileSystem.readAsStringAsync(photoUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const mimeType = photoUri.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

  try {
    return await callGemini(base64Image, mimeType);
  } catch (firstError) {
    try {
      return await callGemini(base64Image, mimeType);
    } catch {
      throw firstError instanceof GeminiIdentificationError
        ? firstError
        : new GeminiIdentificationError("Could not identify this cat's breed.");
    }
  }
}
