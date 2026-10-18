import type { Anime, JikanImages } from "../types/jikan";

export function animeImage(images?: JikanImages, size: "small" | "large" | "regular" = "regular"): string {
  const webp = images?.webp;
  const jpg = images?.jpg;
  if (size === "small") return webp?.small_image_url || jpg?.small_image_url || webp?.image_url || jpg?.image_url || "";
  if (size === "large") return webp?.large_image_url || jpg?.large_image_url || webp?.image_url || jpg?.image_url || "";
  return webp?.image_url || jpg?.image_url || "";
}

export function animeTitle(anime: Anime): string {
  return anime.title_english || anime.title || "İsimsiz anime";
}

export function formatNumber(value?: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("tr-TR", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

export function yearFromAnime(anime: Anime): string {
  const year = anime.year ?? (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : undefined);
  return year && Number.isFinite(year) ? String(year) : "Yıl bilinmiyor";
}
