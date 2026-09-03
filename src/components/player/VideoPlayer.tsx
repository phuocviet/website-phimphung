import { useState } from 'react';
import { RotateCcw, Tv, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
}

export function VideoPlayer({
  embedUrl,
  title,
  isCinemaMode,
  onToggleCinemaMode,
}: VideoPlayerProps) {
  const [key, setKey] = useState(0);

  const reloadPlayer = () => {
    setKey((prev) => prev + 1);
  };

  if (!embedUrl) {
    return (
      <div className="w-full aspect-video bg-zinc-950 rounded-2xl flex flex-col items-center justify-center text-zinc-400 border border-zinc-800 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Chưa chọn tập phim</h3>
        <p className="text-sm max-w-md text-zinc-500">
          Vui lòng chọn một tập phim trong danh sách bên dưới để bắt đầu thưởng thức.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Player Frame Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl shadow-black/80">
        <iframe
          key={key}
          src={embedUrl}
          title={title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>

      {/* Player Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-1 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Đang phát
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300 font-medium truncate max-w-[260px] sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reload Stream Button */}
          <button
            onClick={reloadPlayer}
            title="Tải lại nguồn phát"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tải lại</span>
          </button>

          {/* Cinema Mode Toggle */}
          <button
            onClick={onToggleCinemaMode}
            title="Bật/Tắt chế độ rạp chiếu"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${
              isCinemaMode
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700/60 text-zinc-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{isCinemaMode ? 'Thu nhỏ' : 'Rạp chiếu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
