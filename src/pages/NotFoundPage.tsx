import { Link } from "react-router-dom";
import { ArrowLeft, Ghost } from "lucide-react";

export function NotFoundPage() {
  return <div className="page-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"><Ghost size={42} className="text-violet-300" /><p className="eyebrow mt-5">404 / KAYIP BÖLÜM</p><h1 className="mt-3 text-5xl font-black text-white">Bu sayfa yok.</h1><p className="mt-3 text-zinc-400">Aradığın sayfayı bulamadık. Anime keşfine geri dönebilirsin.</p><Link to="/" className="btn-primary mt-7"><ArrowLeft size={16} /> Ana sayfaya dön</Link></div>;
}
