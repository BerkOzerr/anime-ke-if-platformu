import { useState } from "react";
import { useGetScheduleQuery } from "../features/anime/animeApi";
import { AnimeGrid } from "../components/anime/AnimeGrid";
import { AnimeSkeletons, EmptyState, ErrorState } from "../components/ui/StateView";

const days = [{ value: "monday", label: "Pazartesi" }, { value: "tuesday", label: "Salı" }, { value: "wednesday", label: "Çarşamba" }, { value: "thursday", label: "Perşembe" }, { value: "friday", label: "Cuma" }, { value: "saturday", label: "Cumartesi" }, { value: "sunday", label: "Pazar" }];
export function SchedulePage() {
  const [day, setDay] = useState("monday");
  const query = useGetScheduleQuery({ filter: day, sfw: true });
  return <div className="page-container section-space"><p className="eyebrow">HAFTALIK TAKVİM</p><h1 className="page-title">Yayın programı</h1><p className="mt-2 text-zinc-400">Günlere göre yayın programında yer alan animeler.</p>
    <div className="my-7 flex flex-wrap gap-2">{days.map((item) => <button key={item.value} onClick={() => setDay(item.value)} className={`filter-chip ${day === item.value ? "filter-chip-active" : ""}`}>{item.label}</button>)}</div>
    {query.isLoading ? <AnimeSkeletons count={12} /> : query.isError ? <ErrorState onRetry={() => query.refetch()} /> : (query.data?.data?.length ?? 0) === 0 ? <EmptyState message="Bu gün için API'den yayın programı verisi dönmedi." /> : <AnimeGrid anime={query.data?.data ?? []} />}
  </div>;
}
