import { Link } from 'react-router-dom';
import { History, Trash2, Play, Film, ArrowRight, Clock } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

export function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useHistory();

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-rose-500">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Lịch Sử Xem Phim
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Các tập phim bạn đã xem gần đây
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-rose-600/20 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa toàn bộ lịch sử</span>
          </button>
        )}
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="p-5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600">
            <Film className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Chưa có lịch sử xem</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">
              Khi bạn bắt đầu xem bất kỳ tập phim nào, tiến trình xem sẽ tự động lưu lại ở đây để bạn xem tiếp bất cứ lúc nào.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <div
              key={`${item.slug}-${item.episodeSlug}`}
              className="flex gap-3.5 p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <Link
                to={`/xem-phim/${item.slug}/${item.episodeSlug}`}
                className="relative w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0"
              >
                <img
                  src={item.thumb_url || item.poster_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-1">
                  <Link
                    to={`/xem-phim/${item.slug}/${item.episodeSlug}`}
                    className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors line-clamp-1"
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {item.original_name || item.name}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
                      Đang xem: Tập {item.episodeName}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.watchedAt)}
                  </span>
                  <button
                    onClick={() => removeFromHistory(item.slug)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Xóa khỏi lịch sử"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
