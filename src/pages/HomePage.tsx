import { useState, useEffect } from 'react';
import { getLatestMovies } from '../api/client';
import type { MovieItem } from '../types/movie';
import { HeroBanner } from '../components/movie/HeroBanner';
import { MovieSlider } from '../components/movie/MovieSlider';
import { LoadingSpinner } from '../components/common/Loading';

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const [newThisWeek, setNewThisWeek] = useState<MovieItem[]>([]);
  const [trendingNow, setTrendingNow] = useState<MovieItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomePageMovies() {
      try {
        setLoading(true);
        setError(null);

        // Fetch movies from api: https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=1 and page=2
        const [page1Res, page2Res] = await Promise.all([
          getLatestMovies(1),
          getLatestMovies(2),
        ]);

        if (!isMounted) return;

        setNewThisWeek(page1Res.items || []);
        setTrendingNow(page2Res.items || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu phim mới:', err);
        if (isMounted) {
          setError('Không thể kết nối đến máy chủ phim. Vui lòng thử lại sau.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomePageMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner text="Đang tải danh sách phim mới cập nhật..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Không Thể Tải Phim Mới</h2>
        <p className="text-sm text-zinc-400 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full bg-[#e50914] hover:bg-red-700 font-semibold text-white text-sm transition-all"
        >
          Thử Lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Top Hero Banner (Money Heist style) */}
      <HeroBanner movies={newThisWeek} />

      {/* Movie Horizontal Carousels */}
      <div className="px-4 sm:px-8 lg:px-12 -mt-4 sm:-mt-8 md:-mt-12 relative z-20 pb-20 sm:pb-16 space-y-8 sm:space-y-10">
        {/* Row 1: New this week */}
        <MovieSlider title="New this week" movies={newThisWeek} />

        {/* Row 2: Trending Now */}
        <MovieSlider title="Trending Now" movies={trendingNow} />
      </div>
    </div>
  );
}
