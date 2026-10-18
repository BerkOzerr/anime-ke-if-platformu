import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ title, subtitle, to }: { title: string; subtitle?: string; to?: string }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>{subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}</div>{to && <Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-violet-300 transition hover:text-violet-200">Tümünü gör <ArrowUpRight size={15} /></Link>}</div>;
}
