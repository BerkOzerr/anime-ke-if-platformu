import type { Anime } from "../../types/jikan";
import { AnimeCard } from "./AnimeCard";

export function AnimeGrid({ anime, rankStart }: { anime: Anime[]; rankStart?: number }) {
  return <div className="anime-grid">{anime.map((item, index) => <AnimeCard key={item.mal_id} anime={item} rank={rankStart == null ? undefined : rankStart + index} />)}</div>;
}
