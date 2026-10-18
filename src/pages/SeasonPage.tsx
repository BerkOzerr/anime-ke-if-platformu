import { useState } from "react";
import { useGetCurrentSeasonQuery, useGetSeasonQuery } from "../features/anime/animeApi";
import { AnimeGrid } from "../components/anime/AnimeGrid";
import { Pagination } from "../components/anime/Pagination";
import { AnimeSkeletons, EmptyState, ErrorState } from "../components/ui/StateView";

type SeasonName = "winter" | "spring" | "summer" | "fall";
const seasons: { value: SeasonName; label: string }[] = [{ value: "winter", label: "Kış" }, { value: "spring", label: "İlkbahar" }, { value: "summer", label: "Yaz" }, { value: "fall", label: "Sonbahar" }];
function currentSeason(): SeasonName {
  const month = new Date().getMonth();
  if (month < 3) return "winter";
  if (month < 6) return "spring";
  if (month < 9) return "summer";
  if (month < 11) return "fall";
  return "winter";
}
export function SeasonPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [season, setSeason] = useState<SeasonName>(currentSeason());
  const [page, setPage] = useState(1);
  const isCurrent = year === now.getFullYear() && season === currentSeason();
  const current = useGetCurrentSeasonQuery({ page }, { skip: !isCurrent });
  const historical = useGetSeasonQuery({ year, season, page }, { skip: isCurrent });
  const query = isCurrent ? current : historical;
  return <div className="page-container section-space"><p className="eyebrow">SEZON REHBERİ</p><h1 className="page-title">Sezon animeleri</h1><p className="mt-2 text-zinc-400">Yeni sezonları ve yayınlanan serileri keşfet.</p>
    <div className="my-7 flex flex-wrap gap-3"><label className="field-label">Yıl<select className="field-control min-w-28" value={year} onChange={(e) => { setYear(Number(e.target.value)); setPage(1); }}>{Array.from({ length: 12 }, (_, i) => now.getFullYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}</select></label><div className="field-label">Sezon<div className="flex flex-wrap gap-2">{seasons.map((s) => <button key={s.value} onClick={() => { setSeason(s.value); setPage(1); }} className={`filter-chip ${season === s.value ? "filter-chip-active" : ""}`}>{s.label}</button>)}</div></div></div>
    {query.isLoading ? <AnimeSkeletons count={12} /> : query.isError ? <ErrorState onRetry={() => query.refetch()} /> : (query.data?.data?.length ?? 0) === 0 ? <EmptyState /> : <AnimeGrid anime={query.data?.data ?? []} />}
    <Pagination pagination={query.data?.pagination} onPageChange={setPage} />
  </div>;
}
