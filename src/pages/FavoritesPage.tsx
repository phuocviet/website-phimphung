import { Link } from 'react-router-dom';
import { Heart, Trash2, Play, Film, ArrowRight } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { Badge } from '../components/common/Badge';

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-500">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Phim Yêu Thích
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Bạn đã lưu {favorites.length} bộ phim vào danh sách yêu thích
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="p-5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600">
            <Film className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Chưa có phim yêu thích</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">
              Nhấn vào biểu tượng trái tim trên bất kỳ bộ phim nào để thêm vào danh sách yêu thích của bạn.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-rose-600/30"
          >
            Khám phá phim ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {favorites.map((movie) => (
            <div
              key={movie.slug}
              className="group relative rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              {/* Poster Link */}
              <Link to={`/phim/${movie.slug}`} className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20" />

                {/* Badges */}
                <div className="absolute top-2 left-2">
                  {movie.quality && (
                    <Badge variant="amber" size="sm">
                      {movie.quality}
                    </Badge>
                  )}
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFavorite(movie.slug);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-zinc-300 hover:text-white transition-colors"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Play icon hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/phim/${movie.slug}`}
                    className="font-semibold text-sm text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-1"
                    title={movie.name}
                  >
                    {movie.name}
                  </Link>
                  <p className="text-xs text-zinc-400 font-normal line-clamp-1 mt-0.5">
                    {movie.original_name || movie.name}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{movie.year || 'Phim hay'}</span>
                  <Link
                    to={`/xem-phim/${movie.slug}`}
                    className="text-rose-500 font-semibold hover:underline"
                  >
                    Xem ngay →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
