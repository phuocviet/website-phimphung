import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import type { MovieItem } from '../../types/movie';
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
    : movie.poster_url || movie.thumb_url || movie.poster_url_webp || movie.thumb_url_webp;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="group relative w-full select-none">
      <Link to={`/phim/${movie.slug}`} className="block w-full">
        {/* Poster */}
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-[1.03]">
          <img
            src={displayImage}
            alt={movie.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />

          {/* Dark gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quality badge */}
          {movie.quality && (
            <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-md bg-black/70 text-[10px] font-semibold text-zinc-200">
              {movie.quality}
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label="Yêu thích"
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all z-20 ${
              isFav
                ? 'bg-[#e50914] text-white'
                : 'bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-[#e50914] hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
          </button>

          {/* Hover play */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-[#e50914] text-white flex items-center justify-center">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Subtle metadata */}
        <div className="pt-2.5 px-0.5">
          <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-white">
            {movie.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
            {[movie.year, movie.current_episode].filter(Boolean).join(' • ')}
          </p>
        </div>
      </Link>
    </div>

  );
}
