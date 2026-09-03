import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Heart, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import type { MovieItem } from '../../types/movie';
import { Badge } from '../common/Badge';
import { useFavorites } from '../../hooks/useFavorites';

interface HeroBannerProps {
  movies: MovieItem[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const featured = movies.slice(0, 6);

  useEffect(() => {
    if (isPaused || featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length, isPaused]);

  if (!featured.length) return null;

  const current = featured[currentIndex];
  const isFav = isFavorite(current.slug);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div
      className="relative w-full h-[540px] sm:h-[620px] md:h-[680px] overflow-hidden select-none bg-zinc-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={current.thumb_url || current.poster_url}
          alt={current.name}
          key={current.slug}
          className="w-full h-full object-cover object-center animate-fade-in filter brightness-[0.75]"
        />
        {/* Gradients to fade seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f] via-[#0b0c0f]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4 animate-fade-in-up">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-rose-600 text-white shadow-lg shadow-rose-600/40">
              Nổi Bật
            </span>
            {current.quality && (
              <Badge variant="amber" size="md">
                {current.quality}
              </Badge>
            )}
            {current.language && (
              <Badge variant="blue" size="md">
                {current.language}
              </Badge>
            )}
            {current.current_episode && (
              <Badge variant="purple" size="md">
                {current.current_episode}
              </Badge>
            )}
            {current.year && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-300 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {current.year}
              </span>
            )}
            {current.time && (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-300 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {current.time}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {current.name}
          </h1>
          {current.original_name && current.original_name !== current.name && (
            <p className="text-sm sm:text-base text-zinc-400 font-medium italic -mt-2">
              {current.original_name}
            </p>
          )}

          {/* Description */}
          {current.description && (
            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed max-w-xl drop-shadow">
              {current.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/phim/${current.slug}`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm sm:text-base bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              Xem Phim Ngay
            </Link>

            <Link
              to={`/phim/${current.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/60 backdrop-blur-md transition-all hover:text-white"
            >
              <Info className="w-5 h-5" />
              Chi Tiết
            </Link>

            <button
              onClick={() => toggleFavorite(current)}
              aria-label="Yêu thích"
              className={`p-3 rounded-xl border transition-all ${
                isFav
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/40'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Phim trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 z-20 hidden md:flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Phim kế tiếp"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 z-20 hidden md:flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Chuyển đến phim ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-8 h-2 bg-rose-600 shadow-md shadow-rose-600/50'
                : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
