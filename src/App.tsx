import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { AnimeCatalogPage } from "./pages/AnimeCatalogPage";
import { AnimeDetailPage } from "./pages/AnimeDetailPage";
import { TopPage } from "./pages/TopPage";
import { SeasonPage } from "./pages/SeasonPage";
import { SchedulePage } from "./pages/SchedulePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime" element={<AnimeCatalogPage />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route path="/top" element={<TopPage />} />
        <Route path="/season" element={<SeasonPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
