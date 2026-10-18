import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useState } from "react";
import type { Anime } from "../../types/jikan";
import { animeImage, animeTitle, yearFromAnime } from "../../utils/anime";

export function AnimeCard({ anime, rank }: { anime: Anime; rank?: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = animeImage(anime.images, "regular");
  console.log(image);
  return (
    <Link to={`/anime/${anime.mal_id}`} className="anime-card group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900">
        {!imageFailed && image ? (
          <img
            src={image}
            alt={`${animeTitle(anime)} anime posteri`}
            loading="lazy"
            className="anime-poster h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-950 to-zinc-900 p-3 text-center text-xs text-zinc-500">
            Görsel mevcut değil
          </div>
        )}
        {rank && (
          <span className="absolute left-2 top-2 rounded-lg border border-white/10 bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur">
            #{rank}
          </span>
        )}
        {anime.score != null && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
            <Star size={12} fill="currentColor" />
            {anime.score.toFixed(2)}
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-zinc-100 transition-colors duration-300 group-hover:text-violet-300">
          {animeTitle(anime)}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
          <span>{anime.type || "Anime"}</span>
          <span className="text-zinc-700">•</span>
          <span>{yearFromAnime(anime)}</span>
        </div>
      </div>
    </Link>
  );
}
