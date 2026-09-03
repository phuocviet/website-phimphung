import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Star } from 'lucide-react';
import type { MovieItem } from '../../types/movie';
import { Badge } from '../common/Badge';
import { useFavorites } from '../../hooks/useFavorites';

interface MovieCardProps {
  movie: MovieItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const isFav = isFavorite(movie.slug);

  // Fallback image URL
  const displayImage = imgError
    ? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60'
    : movie.poster_url || movie.thumb_url;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 hover:-translate-y-1 flex flex-col">
      {/* Poster Image Container */}
      <Link to={`/phim/${movie.slug}`} className="relative block aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={displayImage}
          alt={movie.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient shadow over bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[85%] z-10">
          {movie.quality && (
            <Badge variant="amber" size="sm">
              {movie.quality}
            </Badge>
          )}
          {movie.language && (
            <Badge variant="blue" size="sm">
              {movie.language}
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Yêu thích"
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isFav
              ? 'bg-rose-600 text-white scale-110 shadow-lg shadow-rose-600/50'
              : 'bg-black/50 text-zinc-300 hover:bg-rose-600 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Bottom overlay badge: episode info */}
        {movie.current_episode && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
            <span className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-zinc-200 border border-white/10 truncate max-w-[130px]">
              {movie.current_episode}
            </span>
            {movie.year && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-zinc-900/80 text-zinc-400 border border-white/5">
                {movie.year}
              </span>
            )}
          </div>
        )}

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/phim/${movie.slug}`}
            className="font-semibold text-sm text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-1"
            title={movie.name}
          >
            {movie.name}
          </Link>
          <p className="text-xs text-zinc-400 font-normal line-clamp-1 mt-0.5" title={movie.original_name}>
            {movie.original_name || movie.name}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2.5 pt-2 border-t border-zinc-800/60">
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span>Phổ biến</span>
          </span>
          <span>{movie.time || 'Đang cập nhật'}</span>
        </div>
      </div>
    </div>
  );
}
