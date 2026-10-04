import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { MovieItem } from '../../types/movie';
import { useAuth } from '../../context/AuthContext';

interface HeroBannerProps {
  movies: MovieItem[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);

  const featured = movies.slice(0, 6);

  const username =
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    user?.email?.split('@')[0];
  const initialLetter = username ? username.charAt(0).toUpperCase() : 'P';

  useEffect(() => {
    if (isPaused || featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length, isPaused]);

  useEffect(() => {
    setIsDissolving(true);
    const timeout = setTimeout(() => setIsDissolving(false), 850);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  if (!featured.length) return null;

  const current = featured[currentIndex];

  // Derive an IMDb score or display 8.8/10 as in the design mockup
  const imdbScore = current.year === 2026 ? '8.8' : '8.5';
  const displayImage = current.thumb_url || current.poster_url || current.thumb_url_webp || current.poster_url_webp;

  return (
    <div
      className="relative w-full h-[520px] sm:h-[600px] md:h-[660px] lg:h-[700px] overflow-hidden select-none bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop Image with 3D Cube Enter Animation */}
      <div key={`bg-${current.slug}`} className="absolute inset-0 cube-scene-enter">
        <img
          src={displayImage}
          alt={current.name}
          style={{ objectPosition: 'right top' }}
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
        />

        {/* Cinematic gradient overlays to blend into pure black */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 via-35% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-50% to-transparent w-full md:w-3/4" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      {/* Futuristic Cube Dissolve Matrix Overlay */}
      {isDissolving && (
        <div className="absolute inset-0 pointer-events-none z-30 grid grid-cols-6 sm:grid-cols-8 grid-rows-4 sm:grid-rows-5 gap-2.5 sm:gap-3 p-3 sm:p-4 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            const delay = (col * 0.045 + row * 0.05).toFixed(2);
            return (
              <div
                key={i}
                className="cube-voxel rounded-xl border border-[#e50914]/50 bg-gradient-to-br from-red-600/30 via-zinc-950/40 to-cyan-500/20 backdrop-blur-[2px]"
                style={{ animationDelay: `${delay}s` }}
              />
            );
          })}
          {/* Futuristic laser scanbeam */}
          <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#e50914]/30 to-transparent cyber-scan-line pointer-events-none" />
        </div>
      )}

      {/* Content Container (Money Heist style layout) */}
      <div
        key={`content-${current.slug}`}
        className="relative max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex flex-col justify-center pt-8 pb-12 z-10 cube-scene-enter"
      >
        <div className="max-w-2xl space-y-3.5">
          {/* User Initial Badge (e.g. "P FILM" or "P SERIES", replaces "N FILM" / "N SERIES") */}
          <div className="flex items-center gap-2">
            <span className="text-[#e50914] font-black text-2xl sm:text-3xl tracking-tighter leading-none select-none drop-shadow-[0_0_12px_rgba(229,9,20,0.6)]">
              {initialLetter}
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-zinc-300 uppercase">
              {current.total_episodes && current.total_episodes > 1 ? 'SERIES' : 'FILM'}
            </span>
          </div>

          {/* Hero Big Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {current.name}
          </h1>

          {/* Subtitle / Season / Part */}
          {current.original_name && current.original_name !== current.name ? (
            <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-zinc-300 uppercase drop-shadow">
              {current.original_name}
            </p>
          ) : (
            current.current_episode && (
              <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-zinc-300 uppercase">
                {current.current_episode}
              </p>
            )
          )}

          {/* IMDb Rating & Streams Stat */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#f5c518] text-black font-black text-[11px] tracking-wider">
                IMDb
              </span>
              <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                {imdbScore}/10
              </span>
            </div>

            <div className="text-sm sm:text-base font-semibold">
              <span className="text-[#e50914] font-bold">2B+</span>{' '}
              <span className="text-zinc-300">Streams</span>
            </div>
          </div>

          {/* Description snippet if available */}
          {current.description && (
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 max-w-xl pt-1 leading-relaxed">
              {current.description}
            </p>
          )}

          {/* Action Buttons: Play (Red) & Watch Trailer (Translucent White) */}
          <div className="flex items-center gap-3.5 pt-4">
            <Link
              to={`/xem-phim/${current.slug}`}
              className="px-8 py-2.5 rounded-full bg-[#e50914] hover:bg-red-700 text-white font-bold text-sm sm:text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/40"
            >
              Play
            </Link>

            <Link
              to={`/phim/${current.slug}`}
              className="px-6 py-2.5 rounded-full bg-[#d1d5db]/80 hover:bg-white text-black font-semibold text-sm sm:text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              Watch Trailer
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Slide Indicator Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 right-8 sm:right-16 flex items-center gap-2 z-20">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Chuyển đến phim ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 h-1.5 bg-[#e50914]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
