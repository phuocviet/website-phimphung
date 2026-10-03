import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SidebarDock } from './components/layout/SidebarDock';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { WatchPage } from './pages/WatchPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { getLatestMovies } from './api/client';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleShuffle = async () => {
    try {
      const res = await getLatestMovies(1);
      if (res && res.items && res.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * res.items.length);
        navigate(`/phim/${res.items[randomIndex].slug}`);
      }
    } catch (err) {
      console.error('Lỗi khi chọn phim ngẫu nhiên:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 selection:bg-[#e50914] selection:text-white relative">
      {/* 1. Global Left Sidebar Dock across all pages */}
      <SidebarDock onShuffle={handleShuffle} />

      {/* 2. Top Navbar on non-home pages */}
      {!isHomePage && <Navbar />}

      {/* 3. Main Content with responsive left padding for SidebarDock */}
      <main className={`flex-1 sm:pl-16 md:pl-20 ${!isHomePage ? 'pt-20 sm:pt-24' : ''}`}>
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

      {/* 4. Footer on non-home pages */}
      {!isHomePage && (
        <div className="sm:pl-16 md:pl-20">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
