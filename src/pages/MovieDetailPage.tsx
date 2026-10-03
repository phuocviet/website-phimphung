import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Heart,
  Share2,
  Calendar,
  Clock,
  User,
  Users,
  Film,
  Check,
  ArrowLeft,
  Tv,
} from 'lucide-react';
import { getMovieDetail, getMoviesByGenre } from '../api/client';
import type { MovieDetail, MovieItem } from '../types/movie';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Loading';
import { MovieSlider } from '../components/movie/MovieSlider';
import { useFavorites } from '../hooks/useFavorites';

export function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const res = await getMovieDetail(slug!);
        if (!isMounted) return;

        if (res && res.movie) {
          setMovie(res.movie);

          // Try fetching related movies based on the first genre category
          const genreGroup = res.movie.category?.['2']; // Group 'Thể loại'
          const firstGenre = genreGroup?.list?.[0];
          if (firstGenre) {
            // Find slug or fetch popular movies
            try {
              const relatedRes = await getMoviesByGenre('hanh-dong', 1);
              if (isMounted) {
                setRelatedMovies(
                  (relatedRes.items || []).filter((item) => item.slug !== slug)
                );
              }
            } catch {
              // Ignore related error
            }
          }
        } else {
          setError('Không tìm thấy thông tin phim này.');
        }
      } catch (err) {
        console.error('Failed to load movie detail:', err);
        if (isMounted) setError('Lỗi khi tải chi tiết phim.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Đang tải thông tin chi tiết phim..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-zinc-900 text-zinc-500 inline-block">
          <Film className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Không Tìm Thấy Phim</h2>
        <p className="text-sm text-zinc-400">{error || 'Phim không tồn tại hoặc đã bị xóa.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    );
  }

  const isFav = isFavorite(movie.slug);
  const firstServer = movie.episodes?.[0];
  const firstEpisode = firstServer?.items?.[0];
  const watchUrl = firstEpisode
    ? `/xem-phim/${movie.slug}/${firstEpisode.slug}`
    : `/xem-phim/${movie.slug}`;

  // Extract categories
  const categoriesList = Object.values(movie.category || {}).flatMap(
    (grp) => grp.list || []
  );

  return (
    <div className="pb-20 space-y-12">
      {/* Top Hero Backdrop */}
      <div className="relative w-full min-h-[460px] md:min-h-[520px] bg-black overflow-hidden pt-12 md:pt-16">
        {/* Backdrop image */}
        <div className="absolute inset-0">
          <img
            src={movie.thumb_url || movie.poster_url}
            alt={movie.name}
            style={{ objectPosition: 'center top' }}
            className="w-full h-full object-cover filter brightness-[0.7] contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent w-full md:w-3/4" />
        </div>

        {/* Content Details Header */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 z-10">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
            {/* Poster Card */}
            <div className="w-56 sm:w-64 md:w-72 flex-shrink-0">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-zinc-800/80 relative group">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    to={watchUrl}
                    className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 hover:scale-110 transition-transform"
                  >
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {movie.quality && (
                  <Badge variant="amber" size="md">
                    {movie.quality}
                  </Badge>
                )}
                {movie.language && (
                  <Badge variant="blue" size="md">
                    {movie.language}
                  </Badge>
                )}
                {movie.current_episode && (
                  <Badge variant="purple" size="md">
                    {movie.current_episode}
                  </Badge>
                )}
                {movie.year && (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-300 font-medium px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                    <Calendar className="w-3.5 h-3.5" />
                    {movie.year}
                  </span>
                )}
                {movie.time && (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-300 font-medium px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                    <Clock className="w-3.5 h-3.5" />
                    {movie.time}
                  </span>
                )}
              </div>

              {/* Movie Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.name}
              </h1>
              {movie.original_name && (
                <p className="text-base sm:text-lg text-zinc-400 font-normal italic">
                  {movie.original_name}
                </p>
              )}

              {/* Tags / Categories */}
              {categoriesList.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  {categoriesList.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Director & Casts */}
              <div className="pt-2 space-y-1.5 text-xs sm:text-sm text-zinc-400">
                {movie.director && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-500 font-medium">Đạo diễn:</span>
                    <span className="text-zinc-200 font-semibold">{movie.director}</span>
                  </div>
                )}
                {movie.casts && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Users className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    <span className="text-zinc-500 font-medium flex-shrink-0">Diễn viên:</span>
                    <span className="text-zinc-200 line-clamp-1">{movie.casts}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-4">
                <Link
                  to={watchUrl}
                  className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full font-bold text-sm sm:text-base bg-[#e50914] hover:bg-red-700 text-white shadow-xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Xem Phim
                </Link>

                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border transition-all ${
                    isFav
                      ? 'bg-[#e50914] border-red-500 text-white shadow-lg shadow-red-600/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                  {isFav ? 'Đã Lưu' : 'Yêu Thích'}
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                  title="Chia sẻ link phim"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis & Episodes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Synopsis */}
        {movie.description && (
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              Nội Dung Phim
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              {movie.description}
            </p>
          </div>
        )}

        {/* Quick Episode Selection */}
        {firstServer && firstServer.items && firstServer.items.length > 0 && (
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-rose-500" />
                Chọn Tập Để Xem ({firstServer.items.length} tập)
              </h3>
              <span className="text-xs text-zinc-400 font-medium">
                Nguồn: {firstServer.server_name}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {firstServer.items.map((ep) => (
                <Link
                  key={ep.slug}
                  to={`/xem-phim/${movie.slug}/${ep.slug}`}
                  className="py-2.5 px-2 text-center rounded-xl text-xs font-semibold bg-zinc-800/90 hover:bg-rose-600 text-zinc-200 hover:text-white border border-zinc-700/60 transition-all hover:scale-105 shadow-sm truncate"
                >
                  Tập {ep.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <MovieSlider
            title="Phim Liên Quan Đề Xuất"
            subtitle="Có thể bạn cũng sẽ thích những bộ phim này"
            movies={relatedMovies}
          />
        )}
      </div>
    </div>
  );
}
