import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  Film,
  Layers,
  Sparkles,
  Globe,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  getLatestMovies,
  getMoviesByCategory,
  getMoviesByGenre,
  getMoviesByCountry,
  getMoviesByYear,
  CATEGORIES,
  GENRES,
  COUNTRIES,
  YEARS,
} from '../api/client';
import type { MovieItem, PaginateInfo } from '../types/movie';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Pagination } from '../components/movie/Pagination';
import { MovieGridSkeleton } from '../components/common/Loading';

export function CategoryPage() {
  const { slug, year } = useParams<{ slug?: string; year?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [paginate, setPaginate] = useState<PaginateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine page type and metadata
  const isCategory = location.pathname.startsWith('/danh-sach');
  const isGenre = location.pathname.startsWith('/the-loai');
  const isCountry = location.pathname.startsWith('/quoc-gia');
  const isYear = location.pathname.startsWith('/nam-phat-hanh');

  // Title calculation
  let title = 'Danh Sách Phim';
  let icon = <Film className="w-6 h-6 text-rose-500" />;

  if (isCategory) {
    const found = CATEGORIES.find((c) => c.slug === slug);
    title = found ? found.name : `Danh mục: ${slug}`;
    icon = <Layers className="w-6 h-6 text-rose-500" />;
  } else if (isGenre) {
    const found = GENRES.find((g) => g.slug === slug);
    title = found ? `Thể loại: ${found.name}` : `Thể loại: ${slug}`;
    icon = <Sparkles className="w-6 h-6 text-amber-400" />;
  } else if (isCountry) {
    const found = COUNTRIES.find((c) => c.slug === slug);
    title = found ? `Quốc gia: ${found.name}` : `Quốc gia: ${slug}`;
    icon = <Globe className="w-6 h-6 text-sky-400" />;
  } else if (isYear) {
    title = `Phim Phát Hành Năm ${year}`;
    icon = <Calendar className="w-6 h-6 text-purple-400" />;
  }

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const isCat = location.pathname.startsWith('/danh-sach');
        const isGen = location.pathname.startsWith('/the-loai');
        const isCou = location.pathname.startsWith('/quoc-gia');
        const isYr = location.pathname.startsWith('/nam-phat-hanh');

        let res;
        if (isCat) {
          if (slug === 'phim-moi-cap-nhat') {
            res = await getLatestMovies(currentPage);
          } else {
            res = await getMoviesByCategory(slug || '', currentPage);
          }
        } else if (isGen) {
          res = await getMoviesByGenre(slug || '', currentPage);
        } else if (isCou) {
          res = await getMoviesByCountry(slug || '', currentPage);
        } else if (isYr) {
          res = await getMoviesByYear(year || '', currentPage);
        }

        if (!isMounted) return;

        if (res && res.status === 'success') {
          setMovies(res.items || []);
          setPaginate(res.paginate || null);
        } else {
          setMovies([]);
          setError('Không có phim nào trong danh mục này.');
        }
      } catch (err) {
        console.error('Failed to load category data:', err);
        if (isMounted) setError('Lỗi khi tải danh sách phim từ máy chủ.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, slug, year, currentPage]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <div className="pt-4 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {title}
            </h1>
            {paginate && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {paginate.total_items
                  ? `Tổng cộng ${paginate.total_items} phim`
                  : ''}{' '}
                {paginate.total_page
                  ? `• Trang ${paginate.current_page} / ${paginate.total_page}`
                  : `• Trang ${paginate.current_page}`}
              </p>
            )}
          </div>
        </div>

        {/* Quick switch sub-filter links */}
        {isGenre && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0 mr-1" />
            {GENRES.slice(0, 6).map((g) => (
              <Link
                key={g.slug}
                to={`/the-loai/${g.slug}`}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex-shrink-0 transition-colors border ${
                  slug === g.slug
                    ? 'bg-[#e50914] text-white border-red-500'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {g.name}
              </Link>
            ))}
          </div>
        )}

        {isCountry && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0 mr-1" />
            {COUNTRIES.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                to={`/quoc-gia/${c.slug}`}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex-shrink-0 transition-colors border ${
                  slug === c.slug
                    ? 'bg-[#e50914] text-white border-red-500'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {isYear && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0 mr-1" />
            {YEARS.slice(0, 6).map((y) => (
              <Link
                key={y}
                to={`/nam-phat-hanh/${y}`}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex-shrink-0 transition-colors border ${
                  year === y.toString()
                    ? 'bg-[#e50914] text-white border-red-500'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <MovieGridSkeleton count={10} />
      ) : error ? (
        <div className="py-20 text-center text-zinc-400 space-y-3">
          <p className="text-base font-medium">{error}</p>
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} emptyMessage="Hiện chưa có phim nào trong danh mục này." />

          {paginate && paginate.total_page && paginate.total_page > 1 && (
            <Pagination
              currentPage={paginate.current_page}
              totalPages={paginate.total_page}
              totalItems={paginate.total_items}
              itemsPerPage={paginate.items_per_page || movies.length}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
