import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MovieItem } from '../../types/movie';
import { MovieCard } from './MovieCard';

interface MovieSliderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  icon?: React.ReactNode;
  movies: MovieItem[];
}

export function MovieSlider({ title, movies }: MovieSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative group/slider select-none">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 sm:mb-4">
        {title}
      </h2>

      {/* Relative container for cards & overlay buttons */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Cuộn sang trái"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:bg-zinc-200 transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Right Scroll Button (White circular button exactly like the screenshot) */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Cuộn sang phải"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:bg-zinc-200 transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Horizontal Card Row */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1"
        >
          {movies.map((movie) => (
            <div
              key={movie.slug}
              className="flex-shrink-0 w-[135px] sm:w-[165px] md:w-[190px] lg:w-[205px]"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
