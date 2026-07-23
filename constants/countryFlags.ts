/**
 * Best-effort country name -> flag emoji lookup for the breed info card's
 * "origin" badge. Falls back to a paw print if we don't recognize the
 * country string Gemini returned (free-text, so it won't always match).
 */
const FLAG_MAP: Record<string, string> = {
  "united kingdom": "🇬🇧",
  scotland: "🏴",
  england: "🏴",
  "united states": "🇺🇸",
  usa: "🇺🇸",
  "united states of america": "🇺🇸",
  thailand: "🇹🇭",
  russia: "🇷🇺",
  egypt: "🇪🇬",
  ethiopia: "🇪🇹",
  turkey: "🇹🇷",
  iran: "🇮🇷",
  persia: "🇮🇷",
  japan: "🇯🇵",
  france: "🇫🇷",
  norway: "🇳🇴",
  singapore: "🇸🇬",
  myanmar: "🇲🇲",
  burma: "🇲🇲",
  canada: "🇨🇦",
  isle_of_man: "🇮🇲",
  "isle of man": "🇮🇲",
  germany: "🇩🇪",
  china: "🇨🇳",
  ukraine: "🇺🇦",
  kenya: "🇰🇪",
  australia: "🇦🇺",
};

export function flagForCountry(country: string): string {
  const key = country.trim().toLowerCase();
  return FLAG_MAP[key] ?? "🐾";
}
