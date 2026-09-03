import { useState } from 'react';
import type { EpisodeItem, EpisodeServer } from '../../types/movie';
import { Play, Server, ListVideo, SkipBack, SkipForward } from 'lucide-react';

interface EpisodeListProps {
  servers: EpisodeServer[];
  currentServerIndex: number;
  currentEpisode: EpisodeItem | null;
  onSelectEpisode: (serverIndex: number, episode: EpisodeItem) => void;
}

export function EpisodeList({
  servers,
  currentServerIndex,
  currentEpisode,
  onSelectEpisode,
}: EpisodeListProps) {
  const [selectedBatch, setSelectedBatch] = useState(0);

  if (!servers || servers.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center text-zinc-400">
        Hiện chưa có danh sách tập phim cho phim này.
      </div>
    );
  }

  const activeServer = servers[currentServerIndex] || servers[0];
  const episodes = activeServer?.items || [];

  // Group episodes into batches of 40
  const BATCH_SIZE = 40;
  const batchesCount = Math.ceil(episodes.length / BATCH_SIZE);

  const currentBatchEpisodes = episodes.slice(
    selectedBatch * BATCH_SIZE,
    (selectedBatch + 1) * BATCH_SIZE
  );

  // Find index of current episode
  const currentEpIndex = episodes.findIndex((ep) => ep.slug === currentEpisode?.slug);
  const hasPrev = currentEpIndex > 0;
  const hasNext = currentEpIndex >= 0 && currentEpIndex < episodes.length - 1;

  const handlePrevEp = () => {
    if (hasPrev) {
      const prevEp = episodes[currentEpIndex - 1];
      // Auto adjust batch if needed
      const prevBatch = Math.floor((currentEpIndex - 1) / BATCH_SIZE);
      setSelectedBatch(prevBatch);
      onSelectEpisode(currentServerIndex, prevEp);
    }
  };

  const handleNextEp = () => {
    if (hasNext) {
      const nextEp = episodes[currentEpIndex + 1];
      const nextBatch = Math.floor((currentEpIndex + 1) / BATCH_SIZE);
      setSelectedBatch(nextBatch);
      onSelectEpisode(currentServerIndex, nextEp);
    }
  };

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/80 p-4 sm:p-5 space-y-4">
      {/* Header & Quick Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ListVideo className="w-5 h-5 text-rose-500" />
          <h3 className="font-bold text-base sm:text-lg text-white">
            Danh Sách Tập Phim ({episodes.length} tập)
          </h3>
        </div>

        {/* Prev / Next Ep Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevEp}
            disabled={!hasPrev}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 transition-colors border border-zinc-700/50"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>Tập trước</span>
          </button>
          <button
            onClick={handleNextEp}
            disabled={!hasNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 transition-colors border border-zinc-700/50"
          >
            <span>Tập sau</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Servers Selector if more than 1 server */}
      {servers.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
            <Server className="w-3.5 h-3.5" />
            Nguồn:
          </span>
          {servers.map((server, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Keep same episode if exists in new server, else pick first
                const sameEp = server.items.find((item) => item.slug === currentEpisode?.slug);
                onSelectEpisode(idx, sameEp || server.items[0]);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border ${
                currentServerIndex === idx
                  ? 'bg-rose-600/20 text-rose-400 border-rose-500/50'
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {server.server_name || `Server #${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Batches Selector if > 40 episodes */}
      {batchesCount > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {Array.from({ length: batchesCount }).map((_, batchIdx) => {
            const start = batchIdx * BATCH_SIZE + 1;
            const end = Math.min((batchIdx + 1) * BATCH_SIZE, episodes.length);
            const isBatchActive = selectedBatch === batchIdx;

            return (
              <button
                key={batchIdx}
                onClick={() => setSelectedBatch(batchIdx)}
                className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-lg transition-colors border ${
                  isBatchActive
                    ? 'bg-zinc-700 text-white border-zinc-500 font-bold'
                    : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {start} - {end}
              </button>
            );
          })}
        </div>
      )}

      {/* Episode Buttons Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[380px] overflow-y-auto pr-1">
        {currentBatchEpisodes.map((ep) => {
          const isActive = currentEpisode?.slug === ep.slug;
          return (
            <button
              key={ep.slug}
              onClick={() => onSelectEpisode(currentServerIndex, ep)}
              className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 scale-105'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700/50'
              }`}
              title={`Tập ${ep.name}`}
            >
              {isActive && <Play className="w-2.5 h-2.5 fill-current" />}
              <span className="truncate">Tập {ep.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
