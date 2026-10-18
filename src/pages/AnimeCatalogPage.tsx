import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetAnimeQuery, useGetGenresQuery } from "../features/anime/animeApi";
import type { AnimeSearchParams } from "../features/anime/animeApi";
import { AnimeGrid } from "../components/anime/AnimeGrid";
import { Pagination } from "../components/anime/Pagination";
import { AnimeSkeletons, EmptyState, ErrorState } from "../components/ui/StateView";

export function AnimeCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchDraft, setSearchDraft] = useState(searchParams.get("q") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState<AnimeSearchParams>({
    q: searchParams.get("q") || undefined,
    page: Number(searchParams.get("page") || 1),
    genres: searchParams.get("genres") || undefined,
    type: searchParams.get("type") || undefined,
    status: searchParams.get("status") || undefined,
    order_by: searchParams.get("order_by") || "popularity",
    sort: searchParams.get("sort") || "asc",
    sfw: true,
    limit: 24,
  });
  const result = useGetAnimeQuery(query);
  const genres = useGetGenresQuery();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const q = searchDraft.trim();
      setQuery((old) => old.q === q ? old : ({ ...old, q: q || undefined, page: 1 }));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchDraft]);
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.q) next.set("q", query.q);
    if (query.page && query.page > 1) next.set("page", String(query.page));
    if (query.genres) next.set("genres", query.genres);
    if (query.type) next.set("type", query.type);
    if (query.status) next.set("status", query.status);
    if (query.order_by) next.set("order_by", query.order_by);
    if (query.sort) next.set("sort", query.sort);
    setSearchParams(next, { replace: true });
  }, [query, setSearchParams]);

  const update = (key: keyof AnimeSearchParams, value: string | number | undefined) =>
    setQuery((old) => ({ ...old, [key]: value || undefined, page: 1 }));
  const reset = () => {
    setSearchDraft("");
    setQuery({ page: 1, limit: 24, sfw: true, order_by: "popularity", sort: "asc" });
  };

  return <div className="page-container section-space">
    <div className="mb-8"><p className="eyebrow">ANIME KATALOĞU</p><h1 className="page-title">Keşfet</h1><p className="mt-2 text-zinc-400">Yeni seriler bul, filtrele ve sıradaki favorini keşfet.</p></div>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 focus-within:border-violet-400/50"><Search size={18} className="text-zinc-500" /><input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} placeholder="Anime adı ara..." className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600" /></label>
      <button className="btn-secondary" onClick={() => setFiltersOpen((v) => !v)}><SlidersHorizontal size={16} /> Filtreler {filtersOpen ? <X size={15} /> : null}</button>
    </div>
    {filtersOpen && <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="field-label">Tür<select className="field-control" value={query.genres ?? ""} onChange={(e) => update("genres", e.target.value)}><option value="">Tüm türler</option>{(genres.data?.data ?? []).map((genre) => <option key={genre.mal_id} value={genre.mal_id}>{genre.name}</option>)}</select></label>
      <label className="field-label">Format<select className="field-control" value={query.type ?? ""} onChange={(e) => update("type", e.target.value)}><option value="">Tüm formatlar</option>{["tv", "movie", "ova", "special", "ona", "music"].map((v) => <option key={v} value={v}>{v.toUpperCase()}</option>)}</select></label>
      <label className="field-label">Durum<select className="field-control" value={query.status ?? ""} onChange={(e) => update("status", e.target.value)}><option value="">Tüm durumlar</option><option value="airing">Yayınlanıyor</option><option value="complete">Tamamlandı</option><option value="upcoming">Yakında</option></select></label>
      <label className="field-label">Sıralama<select className="field-control" value={`${query.order_by}:${query.sort}`} onChange={(e) => { const [order_by, sort] = e.target.value.split(":"); setQuery((old) => ({ ...old, order_by, sort, page: 1 })); }}><option value="popularity:asc">Popülerlik</option><option value="score:desc">En yüksek puan</option><option value="title:asc">İsme göre A–Z</option><option value="start_date:desc">En yeni</option></select></label>
      <div className="sm:col-span-2 lg:col-span-4"><button onClick={reset} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">Filtreleri temizle <X size={14} /></button></div>
    </div>}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500"><span>{result.data?.pagination?.items.total != null ? `${result.data.pagination.items.total.toLocaleString("tr-TR")} sonuç` : "Anime sonuçları"}</span>{result.isFetching && <span className="text-violet-300">Güncelleniyor…</span>}</div>
    {result.isLoading ? <AnimeSkeletons count={12} /> : result.isError ? <ErrorState onRetry={() => result.refetch()} /> : (result.data?.data?.length ?? 0) === 0 ? <EmptyState /> : <AnimeGrid anime={result.data?.data ?? []} />}
    <Pagination pagination={result.data?.pagination} onPageChange={(page) => { setQuery((old) => ({ ...old, page })); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
  </div>;
}
