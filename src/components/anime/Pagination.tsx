import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationInfo } from "../../types/jikan";

export function Pagination({ pagination, onPageChange }: { pagination?: PaginationInfo; onPageChange: (page: number) => void }) {
  if (!pagination || pagination.last_visible_page <= 1) return null;
  const current = pagination.current_page;
  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Sayfalama">
      <button className="btn-secondary" disabled={current <= 1} onClick={() => onPageChange(current - 1)}><ChevronLeft size={16} /> Önceki</button>
      <span className="text-sm text-zinc-400">Sayfa <strong className="text-white">{current}</strong> / {pagination.last_visible_page}</span>
      <button className="btn-secondary" disabled={!pagination.has_next_page} onClick={() => onPageChange(current + 1)}>Sonraki <ChevronRight size={16} /></button>
    </nav>
  );
}
