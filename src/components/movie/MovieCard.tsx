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
    <div className="group relative rounded-xl overflow-hidden bg-zinc-950 aspect-[2/3] w-full transition-all duration-300 hover:scale-[1.03] hover:z-20 shadow-md hover:shadow-2xl hover:shadow-black/80 select-none">
      <Link to={`/phim/${movie.slug}`} className="block w-full h-full relative">
        {/* Full Card Poster Image */}
        <img
          src={displayImage}
          alt={movie.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:brightness-90 transition-all duration-300"
        />

        {/* Subtle base vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-40 group-hover:opacity-80 transition-opacity" />

        {/* Favorite Button (top right) */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Yêu thích"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
            isFav
              ? 'bg-[#e50914] text-white scale-110 shadow-lg shadow-red-600/50'
              : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-[#e50914] hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-xl shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Hover Bottom Info: Title, Quality, Episode */}
        <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 leading-snug drop-shadow">
            {movie.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-300 font-medium">
            {movie.year && <span>{movie.year}</span>}
            {movie.quality && (
              <>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{movie.quality}</span>
              </>
            )}
            {movie.current_episode && (
              <>
                <span>•</span>
                <span className="text-zinc-400 truncate max-w-[90px]">{movie.current_episode}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
