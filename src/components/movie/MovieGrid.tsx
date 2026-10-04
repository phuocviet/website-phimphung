import type { MovieItem } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { Film } from 'lucide-react';

interface MovieGridProps {
  movies: MovieItem[];
  emptyMessage?: string;
}

export function MovieGrid({ movies, emptyMessage = 'Không tìm thấy phim nào' }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
          <Film className="w-8 h-8" />
        </div>
        <p className="text-base font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 mx-auto">
      {movies.map((movie) => (
        <MovieCard key={movie.slug} movie={movie} />
      ))}
    </div>
  );
}
