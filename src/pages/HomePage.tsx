import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Tv,
  Film,
  Clapperboard,
  Gamepad2,
  TrendingUp,
} from 'lucide-react';
import {
  getLatestMovies,
  getMoviesByCategory,
  getMoviesByGenre,
  GENRES,
} from '../api/client';
import type { MovieItem } from '../types/movie';
import { HeroBanner } from '../components/movie/HeroBanner';
import { MovieSlider } from '../components/movie/MovieSlider';
import { LoadingSpinner } from '../components/common/Loading';

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const [latestMovies, setLatestMovies] = useState<MovieItem[]>([]);
  const [airingMovies, setAiringMovies] = useState<MovieItem[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<MovieItem[]>([]);
  const [singleMovies, setSingleMovies] = useState<MovieItem[]>([]);
  const [tvShows, setTvShows] = useState<MovieItem[]>([]);
  const [animeMovies, setAnimeMovies] = useState<MovieItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch multiple categories concurrently
        const [
          latestRes,
          airingRes,
          seriesRes,
          singleRes,
          tvShowsRes,
          animeRes,
        ] = await Promise.all([
          getLatestMovies(1),
          getMoviesByCategory('dang-chieu', 1),
          getMoviesByCategory('phim-bo', 1),
          getMoviesByCategory('phim-le', 1),
          getMoviesByCategory('tv-shows', 1),
          getMoviesByGenre('hoat-hinh', 1),
        ]);

        if (!isMounted) return;

        setLatestMovies(latestRes.items || []);
        setAiringMovies(airingRes.items || []);
        setSeriesMovies(seriesRes.items || []);
        setSingleMovies(singleRes.items || []);
        setTvShows(tvShowsRes.items || []);
        setAnimeMovies(animeRes.items || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        if (isMounted) {
          setError('Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại kết nối mạng!');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Đang tải dữ liệu phim mới nhất..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-600/10 text-rose-500 inline-block">
          <Flame className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Lỗi Tải Dữ Liệu</h2>
        <p className="text-sm text-zinc-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-semibold text-white text-sm"
        >
          Thử Lại Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-16">
      {/* Hero Showcase Banner */}
      <HeroBanner movies={latestMovies} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 -mt-8 sm:-mt-12 relative z-20">
        {/* Quick Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 flex-shrink-0 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Khám phá:
          </span>
          {GENRES.slice(0, 10).map((genre) => (
            <Link
              key={genre.slug}
              to={`/the-loai/${genre.slug}`}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900/90 hover:bg-rose-600 hover:text-white text-zinc-300 border border-zinc-800 transition-all hover:border-rose-500 shadow-sm"
            >
              {genre.name}
            </Link>
          ))}
        </div>

        {/* 1. Phim Mới Cập Nhật */}
        <MovieSlider
          title="Phim Mới Cập Nhật"
          subtitle="Các tác phẩm vừa được cập nhật tập mới nhất"
          movies={latestMovies}
          viewAllLink="/danh-sach/phim-moi-cap-nhat"
          icon={<Flame className="w-6 h-6" />}
        />

        {/* 2. Phim Đang Chiếu Hot */}
        <MovieSlider
          title="Phim Đang Chiếu Hot"
          subtitle="Theo dõi các tập phim phát sóng hàng tuần"
          movies={airingMovies}
          viewAllLink="/danh-sach/dang-chieu"
          icon={<TrendingUp className="w-6 h-6" />}
        />

        {/* 3. Phim Bộ Đặc Sắc */}
        <MovieSlider
          title="Phim Bộ Đặc Sắc"
          subtitle="Phim truyền hình Hàn Quốc, Trung Quốc, Âu Mỹ hấp dẫn"
          movies={seriesMovies}
          viewAllLink="/danh-sach/phim-bo"
          icon={<Tv className="w-6 h-6" />}
        />

        {/* 4. Phim Lẻ Nổi Bật */}
        <MovieSlider
          title="Phim Lẻ Nổi Bật"
          subtitle="Bom tấn rạp chiếu phim chất lượng chuẩn Full HD"
          movies={singleMovies}
          viewAllLink="/danh-sach/phim-le"
          icon={<Film className="w-6 h-6" />}
        />

        {/* 5. Hoạt Hình & Anime */}
        <MovieSlider
          title="Hoạt Hình & Anime Tuyển Chọn"
          subtitle="Thế giới hoạt hình 3D, anime Nhật Bản lôi cuốn"
          movies={animeMovies}
          viewAllLink="/the-loai/hoat-hinh"
          icon={<Gamepad2 className="w-6 h-6" />}
        />

        {/* 6. TV Shows */}
        <MovieSlider
          title="TV Shows & Chương Trình Truyền Hình"
          subtitle="Gameshow, truyền hình thực tế vui nhộn hấp dẫn"
          movies={tvShows}
          viewAllLink="/danh-sach/tv-shows"
          icon={<Clapperboard className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}
