import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { WatchPage } from './pages/WatchPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#0b0c0f] text-slate-100 selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/danh-sach/:slug" element={<CategoryPage />} />
            <Route path="/the-loai/:slug" element={<CategoryPage />} />
            <Route path="/quoc-gia/:slug" element={<CategoryPage />} />
            <Route path="/nam-phat-hanh/:year" element={<CategoryPage />} />
            <Route path="/phim/:slug" element={<MovieDetailPage />} />
            <Route path="/xem-phim/:slug" element={<WatchPage />} />
            <Route path="/xem-phim/:slug/:episodeSlug" element={<WatchPage />} />
            <Route path="/tim-kiem" element={<SearchPage />} />
            <Route path="/yeu-thich" element={<FavoritesPage />} />
            <Route path="/lich-su" element={<HistoryPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
