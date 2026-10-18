import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetCurrentSeasonQuery,
  useGetTopAnimeQuery,
  useGetAnimeQuery,
} from "../features/anime/animeApi";
import { AnimeGrid } from "../components/anime/AnimeGrid";
import { SectionHeading } from "../components/ui/SectionHeading";
import { AnimeSkeletons, ErrorState } from "../components/ui/StateView";
import { animeImage, animeTitle } from "../utils/anime";

export function HomePage() {
  const top = useGetTopAnimeQuery({ page: 1 });
  const season = useGetCurrentSeasonQuery({ page: 1 });
  const highest = useGetAnimeQuery({
    page: 1,
    limit: 12,
    order_by: "score",
    sort: "desc",
    sfw: true,
  });
  const featured = top.data?.data?.[0] ?? season.data?.data?.[0];
  const heroImage = animeImage(featured?.images, "large");

  return (
    <div>
      <section className="page-container pt-7 sm:pt-10">
        {featured ? (
          <div className="hero-panel relative overflow-hidden rounded-3xl border border-white/10">
            {heroImage && (
              <img
                src={heroImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
            )}
            <div className="hero-overlay absolute inset-0" />
            <div className="relative z-10 grid min-h-[390px] items-end gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_220px] lg:items-center lg:p-12">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold dark:text-violet-200 text-violet-600">
                  <Sparkles size={14} /> Anime dünyasını keşfet
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em]  text-violet-800">
                  Öne çıkan anime
                </p>
                <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight dark:text-amber-50 text-black/60 sm:text-5xl lg:text-6xl">
                  {animeTitle(featured)}
                </h1>
                <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                  {featured.synopsis ||
                    "Yeni favorini keşfetmek için anime kataloğuna göz at."}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    className="btn-primary"
                    to={`/anime/${featured.mal_id}`}
                  >
                    <Play size={16} fill="currentColor" /> Detayları keşfet
                  </Link>
                  <Link className="btn-secondary" to="/anime">
                    Kataloğa git <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
              <div className="hidden justify-self-center lg:block">
                {heroImage && (
                  <img
                    src={heroImage}
                    alt={`${animeTitle(featured)} posteri`}
                    className="max-h-[280px] w-[190px] rounded-2xl object-cover shadow-2xl shadow-black/50 ring-1 ring-white/15"
                  />
                )}
              </div>
            </div>
          </div>
        ) : top.isLoading ? (
          <div className="h-[390px] animate-pulse rounded-3xl bg-white/[0.04]" />
        ) : (
          <div className="hero-panel rounded-3xl p-8 sm:p-12">
            <p className="text-sm text-violet-300">KURO / ANIME DISCOVERY</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black text-white sm:text-6xl">
              Bir sonraki favori animeni keşfet.
            </h1>
            <p className="mt-4 max-w-xl text-zinc-400">
              Popüler serileri keşfet, katalogda ara ve anime dünyasına dal.
            </p>
            <Link to="/anime" className="btn-primary mt-6 inline-flex">
              Anime keşfet <ArrowRight size={16} />
            </Link>
            {top.isError && (
              <p className="mt-4 text-sm text-rose-300">
                API bağlantısı kurulamadı. Yerel Jikan servisinin çalıştığını
                kontrol et.
              </p>
            )}
          </div>
        )}
      </section>
      <section className="page-container section-space">
        <SectionHeading
          title="Şu sıralar popüler"
          subtitle="Anime topluluğunun öne çıkardığı seriler"
          to="/top"
        />
        {top.isLoading ? (
          <AnimeSkeletons count={6} />
        ) : top.isError ? (
          <ErrorState onRetry={() => top.refetch()} />
        ) : (
          <AnimeGrid anime={(top.data?.data ?? []).slice(0, 6)} />
        )}
      </section>
      <section className="page-container section-space">
        <SectionHeading
          title="Güncel sezon"
          subtitle="Sezonda yayınlanan animelere göz at"
          to="/season"
        />
        {season.isLoading ? (
          <AnimeSkeletons count={6} />
        ) : season.isError ? (
          <ErrorState onRetry={() => season.refetch()} />
        ) : (
          <AnimeGrid anime={(season.data?.data ?? []).slice(0, 6)} />
        )}
      </section>
      <section className="page-container section-space">
        <SectionHeading
          title="Yüksek puanlı animeler"
          subtitle="Puan sıralamasına göre keşfet"
          to="/top"
        />
        {highest.isLoading ? (
          <AnimeSkeletons count={6} />
        ) : highest.isError ? (
          <ErrorState onRetry={() => highest.refetch()} />
        ) : (
          <AnimeGrid anime={(highest.data?.data ?? []).slice(0, 6)} />
        )}
      </section>
      <section className="page-container">
        <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Sıradaki maceran
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Kataloğu keşfetmeye hazır mısın?
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Arama ve filtrelerle sana uygun animeleri bul.
            </p>
          </div>
          <Link to="/anime" className="btn-primary mt-5 inline-flex sm:mt-0">
            Keşfet <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
