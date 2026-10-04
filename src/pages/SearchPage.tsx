import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, Film } from 'lucide-react';
import { searchMovies } from '../api/client';
import type { MovieItem, PaginateInfo } from '../types/movie';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Pagination } from '../components/movie/Pagination';
import { MovieGridSkeleton } from '../components/common/Loading';

const POPULAR_SEARCHES = [
  'Quy Ông',
  'Thần Điêu',
  'Trường An',
  'Conan',
  'One Piece',
  'Doraemon',
  'Hành Động',
  'Người Nhện',
  'Tình Yêu',
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [inputVal, setInputVal] = useState(keywordParam);
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [paginate, setPaginate] = useState<PaginateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync input with url
  useEffect(() => {
    setInputVal(keywordParam);
  }, [keywordParam]);

  useEffect(() => {
    if (!keywordParam.trim()) {
      setMovies([]);
      setPaginate(null);
      setHasSearched(false);
      return;
    }

    let isMounted = true;

    async function executeSearch() {
      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await searchMovies(keywordParam, pageParam);
        if (!isMounted) return;

        if (res && res.status === 'success') {
          setMovies(res.items || []);
          setPaginate(res.paginate || null);
        } else {
          setMovies([]);
          setPaginate(null);
        }
      } catch (err) {
        console.error('Failed to search movies:', err);
        if (isMounted) setError('Lỗi khi thực hiện tìm kiếm.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    executeSearch();

    return () => {
      isMounted = false;
    };
  }, [keywordParam, pageParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ keyword: inputVal.trim(), page: '1' });
    }
  };

  const handleClear = () => {
    setInputVal('');
    setSearchParams({});
    setMovies([]);
    setHasSearched(false);
  };

  const handleSelectPopular = (kw: string) => {
    setInputVal(kw);
    setSearchParams({ keyword: kw, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ keyword: keywordParam, page: newPage.toString() });
  };

  return (
    <div className="pt-4 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tìm Kiếm Phim
        </h1>
        <p className="text-sm text-zinc-400">
          Khám phá hàng ngàn bộ phim lẻ, phim bộ, hoạt hình hấp dẫn trên phêm
        </p>

        {/* Input Box */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập tên phim, diễn viên hoặc từ khóa..."
            className="w-full pl-12 pr-24 py-4 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-base shadow-xl transition-all"
            autoFocus
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                title="Xóa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-semibold text-xs sm:text-sm text-white transition-colors shadow-md shadow-rose-600/30"
            >
              Tìm
            </button>
          </div>
        </form>

        {/* Popular searches suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-xs text-zinc-500 flex items-center gap-1 mr-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Gợi ý:
          </span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => handleSelectPopular(term)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-4 space-y-6">
        {keywordParam && (
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              Kết quả cho: <span className="text-rose-400 font-extrabold">"{keywordParam}"</span>
            </h2>
            {paginate && (
              <span className="text-xs text-zinc-400">
                Tìm thấy {paginate.total_items ?? movies.length} kết quả
              </span>
            )}
          </div>
        )}

        {loading ? (
          <MovieGridSkeleton count={12} />
        ) : error ? (
          <div className="py-16 text-center text-zinc-400">{error}</div>
        ) : hasSearched && movies.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 space-y-2">
            <p className="text-lg font-bold text-white">Không tìm thấy phim phù hợp</p>
            <p className="text-xs sm:text-sm text-zinc-500">
              Hãy thử tìm kiếm bằng từ khóa ngắn hơn hoặc kiểm tra lại chính tả.
            </p>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />

            {paginate && paginate.total_page && paginate.total_page > 1 && (
              <Pagination
                currentPage={paginate.current_page}
                totalPages={paginate.total_page}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
