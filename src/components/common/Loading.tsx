export function LoadingSpinner({ text = 'Đang tải dữ liệu...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] w-full gap-4 text-zinc-400">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-rose-600 animate-spin" />
      </div>
      <p className="text-sm tracking-wide font-medium">{text}</p>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800/60 animate-pulse flex flex-col">
      <div className="aspect-[2/3] w-full bg-zinc-800/80" />
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 bg-zinc-800/80 rounded w-10" />
          <div className="h-3 bg-zinc-800/80 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
