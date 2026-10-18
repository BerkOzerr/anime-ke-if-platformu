import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Compass, Menu, Search, Sparkles, X, CalendarDays, Trophy, Clapperboard, Moon, Sun, ArrowUpRight, LoaderCircle } from "lucide-react";
import { useGetAnimeQuery } from "../../features/anime/animeApi";
import { animeImage, animeTitle, yearFromAnime } from "../../utils/anime";

const links = [
  { to: "/", label: "Ana Sayfa", icon: Sparkles, end: true },
  { to: "/anime", label: "Keşfet", icon: Compass },
  { to: "/top", label: "Popüler", icon: Trophy },
  { to: "/season", label: "Sezon", icon: Clapperboard },
  { to: "/schedule", label: "Program", icon: CalendarDays },
];

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try { return localStorage.getItem("kuro-theme") === "light" ? "light" : "dark"; } catch { return "dark"; }
  });
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search.trim()), 280);
    return () => window.clearTimeout(id);
  }, [search]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("kuro-theme", theme); } catch { /* storage may be disabled */ }
  }, [theme]);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSuggestionsOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const shouldSearch = debouncedSearch.length >= 2;
  const { data: searchData, isFetching, isError } = useGetAnimeQuery(
    { q: debouncedSearch, limit: 6, sfw: true }, { skip: !shouldSearch }
  );
  const results = searchData?.data ?? [];
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/anime?q=${encodeURIComponent(query)}`);
    setSuggestionsOpen(false);
    setMenuOpen(false);
  };
  const searchBox = (mobile = false) => (
    <div ref={searchRef} className={`search-wrap relative ${mobile ? "w-full" : "ml-auto hidden w-full max-w-xs md:block"}`}>
      <form onSubmit={submitSearch} className="search-field flex items-center gap-2 rounded-xl border px-3 transition-all duration-300 focus-within:ring-2">
        <Search size={16} className="shrink-0 opacity-60" />
        <input aria-label="Anime ara" autoComplete="off" value={search} onFocus={() => setSuggestionsOpen(true)} onChange={(e) => { setSearch(e.target.value); setSuggestionsOpen(true); }} placeholder="Anime ara..." className="h-10 w-full bg-transparent text-sm outline-none placeholder:opacity-50" />
        {isFetching && shouldSearch && <LoaderCircle size={15} className="shrink-0 animate-spin opacity-60" />}
      </form>
      {suggestionsOpen && shouldSearch && <div className="search-dropdown absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border shadow-2xl animate-dropdown">
        <div className="flex items-center justify-between border-b px-4 py-3 text-[11px] font-bold uppercase tracking-[.16em] opacity-60"><span>Arama sonuçları</span><span>{results.length ? `${results.length} sonuç` : ""}</span></div>
        {isFetching && results.length === 0 ? <div className="px-4 py-5 text-sm opacity-65">Animeler aranıyor...</div>
          : isError ? <div className="px-4 py-5 text-sm opacity-65">Arama yapılamadı. API bağlantısını kontrol et.</div>
          : results.length ? <div className="max-h-[min(65vh,420px)] overflow-y-auto p-2">{results.map((anime) => <button type="button" key={anime.mal_id} onClick={() => { navigate(`/anime/${anime.mal_id}`); setSearch(""); setSuggestionsOpen(false); setMenuOpen(false); }} className="search-result group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all duration-200">
            <img src={animeImage(anime.images, "small")} alt="" className="h-14 w-10 shrink-0 rounded-lg object-cover" loading="lazy" />
            <span className="min-w-0 flex-1"><span className="block line-clamp-2 text-sm font-semibold">{animeTitle(anime)}</span><span className="mt-1 block text-xs opacity-55">{anime.type || "Anime"} · {yearFromAnime(anime)}{anime.score ? ` · ★ ${anime.score}` : ""}</span></span><ArrowUpRight size={15} className="shrink-0 opacity-35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>)}</div>
          : <div className="px-4 py-5 text-sm opacity-65">“{debouncedSearch}” için sonuç bulunamadı.</div>}
        <button type="button" onClick={() => { const query = search.trim(); if (query) { navigate(`/anime?q=${encodeURIComponent(query)}`); setSuggestionsOpen(false); setMenuOpen(false); } }} className="search-all flex w-full items-center justify-center gap-2 border-t px-4 py-3 text-sm font-semibold transition-colors">Tüm sonuçları göster <ArrowUpRight size={15} /></button>
      </div>}
    </div>
  );
  const themeButton = <button type="button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Aydınlık temaya geç" : "Koyu temaya geç"} title={theme === "dark" ? "Aydınlık tema" : "Koyu tema"} className="theme-toggle group relative ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-90 md:ml-0">
    <span className={`theme-icon absolute transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}><Moon size={18} /></span>
    <span className={`theme-icon absolute transition-all duration-500 ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}><Sun size={19} /></span>
  </button>;
  return (
    <div className="site-shell min-h-screen">
      <header className="site-header sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="page-container flex h-[72px] items-center gap-4 lg:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Kuro ana sayfa"><span className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white"><Sparkles size={19} /></span><span className="brand-word text-xl font-black tracking-tight">kuro<span className="brand-dot">.</span></span></Link>
          <nav className="hidden items-center gap-1 lg:flex">{links.map(({ to, label, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>{label}</NavLink>)}</nav>
          {searchBox()}
          {themeButton}
          <button className="menu-toggle rounded-xl border p-2 lg:hidden" aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"} onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {menuOpen && <div className="mobile-menu border-t px-4 pb-4 pt-3 lg:hidden animate-dropdown"><div className="mb-3">{searchBox(true)}</div><nav className="grid grid-cols-2 gap-2">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}><Icon size={16} />{label}</NavLink>)}</nav><div className="mt-3 flex justify-end">{themeButton}</div></div>}
      </header>
      <main className="min-h-[70vh]"><Outlet /></main>
      <footer className="site-footer mt-20 border-t"><div className="page-container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><Link to="/" className="footer-brand font-black tracking-tight">kuro<span className="brand-dot">.</span></Link><p className="footer-muted">Anime keşfetmenin yeni yolu.</p><p className="footer-muted">Veriler Jikan API üzerinden sağlanır. Kuro, MyAnimeList ile bağlantılı resmî bir ürün değildir.</p></div></footer>
    </div>
  );
}
