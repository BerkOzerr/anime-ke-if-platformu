import { useState } from "react";
import { useGetTopAnimeQuery } from "../features/anime/animeApi";
import { AnimeGrid } from "../components/anime/AnimeGrid";
import { Pagination } from "../components/anime/Pagination";
import { AnimeSkeletons, EmptyState, ErrorState } from "../components/ui/StateView";

export function TopPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"bypopularity" | "airing" | "upcoming" | "favorite">("bypopularity");
  const query = useGetTopAnimeQuery({ page, filter });
  const labels = [{ value: "bypopularity", label: "Popüler" }, { value: "airing", label: "Yayınlanıyor" }, { value: "upcoming", label: "Yakında" }, { value: "favorite", label: "Favoriler" }] as const;
  return <div className="page-container section-space"><p className="eyebrow">TOP LİSTELER</p><h1 className="page-title">Öne çıkan animeler</h1><p className="mt-2 text-zinc-400">Topluluk verileriyle anime dünyasını keşfet.</p>
    <div className="my-7 flex flex-wrap gap-2">{labels.map((item) => <button key={item.value} onClick={() => { setFilter(item.value); setPage(1); }} className={`filter-chip ${filter === item.value ? "filter-chip-active" : ""}`}>{item.label}</button>)}</div>
    {query.isLoading ? <AnimeSkeletons count={12} /> : query.isError ? <ErrorState onRetry={() => query.refetch()} /> : (query.data?.data?.length ?? 0) === 0 ? <EmptyState /> : <AnimeGrid anime={query.data?.data ?? []} rankStart={(page - 1) * 24 + 1} />}
    <Pagination pagination={query.data?.pagination} onPageChange={setPage} />
  </div>;
}
