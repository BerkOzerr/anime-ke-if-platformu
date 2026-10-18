import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clapperboard, ExternalLink, Star, Users } from "lucide-react";
import { useGetAnimeCharactersQuery, useGetAnimeEpisodesQuery, useGetAnimeFullQuery, useGetAnimeRecommendationsQuery } from "../features/anime/animeApi";
import { AnimeGrid } from "../components/anime/AnimeGrid";
import { AnimeSkeletons, EmptyState, ErrorState, LoadingState } from "../components/ui/StateView";
import { animeImage, animeTitle, formatNumber, yearFromAnime } from "../utils/anime";

export function AnimeDetailPage() {
  const { id: rawId } = useParams();
  const id = Number(rawId);
  const validId = Number.isInteger(id) && id > 0;
  const detail = useGetAnimeFullQuery(id, { skip: !validId });
  const characters = useGetAnimeCharactersQuery(id, { skip: !validId });
  const recommendations = useGetAnimeRecommendationsQuery(id, { skip: !validId });
  const [episodePage, setEpisodePage] = useState(1);
  const episodes = useGetAnimeEpisodesQuery({ id, page: episodePage }, { skip: !validId });
  if (!validId) return <div className="page-container section-space"><ErrorState message="Geçersiz anime kimliği." /><Link to="/anime" className="btn-secondary mt-5 inline-flex">Kataloğa dön</Link></div>;
  if (detail.isLoading) return <div className="page-container section-space"><LoadingState label="Anime detayları yükleniyor..." /></div>;
  if (detail.isError || !detail.data?.data) return <div className="page-container section-space"><ErrorState onRetry={() => detail.refetch()} message="Anime detayları alınamadı. Anime kimliğini ve API bağlantısını kontrol et." /><Link to="/anime" className="btn-secondary mt-5 inline-flex"><ArrowLeft size={16} /> Kataloğa dön</Link></div>;
  const anime = detail.data.data;
  const image = animeImage(anime.images, "large");
  return <div>
    <section className="relative overflow-hidden border-b border-white/10">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm" />}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090f]/75 via-[#09090f]/90 to-[#09090f]" />
      <div className="page-container relative z-10 py-8 sm:py-12">
        <Link to="/anime" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} /> Kataloğa dön</Link>
        <div className="grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
          <div>{image ? <img src={image} alt={`${animeTitle(anime)} posteri`} className="mx-auto max-h-[420px] w-full max-w-[260px] rounded-2xl object-cover shadow-2xl ring-1 ring-white/10" /> : <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-white/5 text-sm text-zinc-500">Poster bulunamadı</div>}</div>
          <div className="self-center">
            <div className="mb-3 flex flex-wrap gap-2">{anime.type && <span className="filter-chip">{anime.type}</span>}{anime.status && <span className="filter-chip">{anime.status}</span>}</div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{animeTitle(anime)}</h1>
            {anime.title_japanese && <p className="mt-2 text-zinc-500">{anime.title_japanese}</p>}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-zinc-300">
              {anime.score != null && <span className="inline-flex items-center gap-1.5 text-amber-300"><Star size={16} fill="currentColor" /> {anime.score.toFixed(2)} <span className="text-zinc-500">({formatNumber(anime.scored_by)} oy)</span></span>}
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> {yearFromAnime(anime)}</span>
              {anime.episodes != null && <span className="inline-flex items-center gap-1.5"><Clapperboard size={15} /> {anime.episodes} bölüm</span>}
              {anime.members != null && <span className="inline-flex items-center gap-1.5"><Users size={15} /> {formatNumber(anime.members)} üye</span>}
            </div>
            {anime.genres?.length ? <div className="mt-5 flex flex-wrap gap-2">{anime.genres.map((g) => <span key={g.mal_id} className="rounded-lg border border-violet-300/15 bg-violet-300/5 px-3 py-1.5 text-xs text-violet-200">{g.name}</span>)}</div> : null}
            {anime.synopsis && <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-300 sm:text-base">{anime.synopsis}</p>}
            {anime.url && <a href={anime.url} target="_blank" rel="noreferrer" className="btn-secondary mt-6 inline-flex">MyAnimeList'te aç <ExternalLink size={15} /></a>}
          </div>
        </div>
      </div>
    </section>
    <div className="page-container section-space">
      <section><h2 className="section-title">Karakterler</h2>{characters.isLoading ? <LoadingState label="Karakterler yükleniyor..." /> : characters.isError ? <ErrorState onRetry={() => characters.refetch()} message="Karakterler yüklenemedi." /> : (characters.data?.data?.length ?? 0) === 0 ? <EmptyState message="Karakter bilgisi mevcut değil." /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{characters.data?.data.slice(0, 12).map((entry) => <div key={entry.character.mal_id} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3"><img src={animeImage(entry.character.images, "small") || undefined} alt="" className="h-16 w-12 rounded-lg bg-zinc-900 object-cover" /><div className="min-w-0 self-center"><p className="line-clamp-2 text-sm font-medium text-zinc-200">{entry.character.name}</p><p className="mt-1 text-xs text-zinc-500">{entry.role}</p></div></div>)}</div>}</section>
      <section className="section-space"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="section-title">Bölümler</h2>{episodes.data?.pagination && episodes.data.pagination.last_visible_page > 1 && <div className="flex gap-2"><button className="btn-secondary" disabled={episodePage <= 1} onClick={() => setEpisodePage((p) => p - 1)}>Önceki</button><span className="self-center text-xs text-zinc-500">{episodePage}/{episodes.data.pagination.last_visible_page}</span><button className="btn-secondary" disabled={!episodes.data.pagination.has_next_page} onClick={() => setEpisodePage((p) => p + 1)}>Sonraki</button></div>}</div>
        {episodes.isLoading ? <LoadingState label="Bölümler yükleniyor..." /> : episodes.isError ? <ErrorState onRetry={() => episodes.refetch()} message="Bölüm listesi alınamadı." /> : (episodes.data?.data?.length ?? 0) === 0 ? <EmptyState message="Bölüm listesi mevcut değil." /> : <div className="divide-y divide-white/[0.07] rounded-xl border border-white/10">{episodes.data?.data.map((ep) => <div key={ep.mal_id} className="flex flex-wrap items-center justify-between gap-2 p-4"><div><p className="text-sm font-medium text-zinc-200">{ep.mal_id}. {ep.title || ep.title_romanji || "Bölüm başlığı mevcut değil"}</p>{ep.aired && <p className="mt-1 text-xs text-zinc-500">{ep.aired}</p>}</div><div className="flex gap-2">{ep.filler && <span className="filter-chip">Filler</span>}{ep.recap && <span className="filter-chip">Özet</span>}</div></div>)}</div>}
      </section>
      <section className="section-space"><h2 className="section-title">Anime önerileri</h2>{recommendations.isLoading ? <AnimeSkeletons count={6} /> : recommendations.isError ? <ErrorState onRetry={() => recommendations.refetch()} message="Öneriler yüklenemedi." /> : (recommendations.data?.data?.length ?? 0) === 0 ? <EmptyState message="Bu anime için öneri bulunmuyor." /> : <AnimeGrid anime={(recommendations.data?.data ?? []).slice(0, 8).map((r) => r.entry)} />}</section>
    </div>
  </div>;
}
