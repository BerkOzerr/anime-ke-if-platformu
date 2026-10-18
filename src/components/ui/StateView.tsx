import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";

export function LoadingState({ label = "Veriler yükleniyor..." }: { label?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-zinc-400" role="status">
      <LoaderCircle className="animate-spin text-violet-400" size={30} />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ onRetry, message = "Veriler alınamadı. API bağlantını kontrol edip yeniden deneyebilirsin." }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-center">
      <AlertCircle className="text-rose-300" size={30} />
      <p className="max-w-lg text-sm text-zinc-300">{message}</p>
      {onRetry && <button className="btn-secondary" onClick={onRetry}><RefreshCw size={15} /> Yeniden dene</button>}
    </div>
  );
}

export function EmptyState({ message = "Bu ölçütlerle eşleşen anime bulunamadı." }: { message?: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center text-zinc-400">{message}</div>;
}

export function AnimeSkeletons({ count = 8 }: { count?: number }) {
  return <div className="anime-grid">{Array.from({ length: count }, (_, i) => <div key={i} className="animate-pulse"><div className="aspect-[3/4] rounded-xl bg-white/[0.07]" /><div className="mt-3 h-4 rounded bg-white/[0.07]" /><div className="mt-2 h-3 w-2/3 rounded bg-white/[0.05]" /></div>)}</div>;
}
