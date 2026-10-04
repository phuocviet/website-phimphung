import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Film,
  ArrowLeft,
  Heart,
  Info,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { getMovieDetail } from '../api/client';
import type { MovieDetail, EpisodeItem } from '../types/movie';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { EpisodeList } from '../components/player/EpisodeList';
import { LoadingSpinner } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';
import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function WatchPage() {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug?: string }>();
  const navigate = useNavigate();
  const { saveWatchHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeItem | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load movie detail
  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadMovie() {
      try {
        setLoading(true);
        setError(null);

        const res = await getMovieDetail(slug!);
        if (!isMounted) return;

        if (res && res.movie) {
          setMovie(res.movie);

          const servers = res.movie.episodes || [];
          const activeServer = servers[0];
          if (activeServer && activeServer.items.length > 0) {
            // Find episode matching slug if provided, else default to first
            let epToPlay = activeServer.items[0];
            if (episodeSlug) {
              const matched = activeServer.items.find((i) => i.slug === episodeSlug);
              if (matched) epToPlay = matched;
            }
            setCurrentEpisode(epToPlay);
          }
        } else {
          setError('Không tìm thấy nguồn phim để xem.');
        }
      } catch (err) {
        console.error('Failed to load movie for player:', err);
        if (isMounted) setError('Lỗi khi tải tập phim.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMovie();

    return () => {
      isMounted = false;
    };
  }, [slug, episodeSlug]);

  // When episodeSlug changes in URL, update currentEpisode
  useEffect(() => {
    if (movie && episodeSlug) {
      const activeServer = movie.episodes?.[currentServerIndex] || movie.episodes?.[0];
      if (activeServer) {
        const found = activeServer.items.find((item) => item.slug === episodeSlug);
        if (found) {
          setCurrentEpisode(found);
        }
      }
    }
  }, [episodeSlug, movie, currentServerIndex]);

  // Record watch history when an episode starts playing
  useEffect(() => {
    if (movie && currentEpisode) {
      saveWatchHistory({
        slug: movie.slug,
        name: movie.name,
        original_name: movie.original_name,
        poster_url: movie.poster_url,
        thumb_url: movie.thumb_url,
        episodeName: currentEpisode.name,
        episodeSlug: currentEpisode.slug,
      });
    }
  }, [movie, currentEpisode, saveWatchHistory]);

  // Share "currently watching" (public to other users) for signed-in users
  const userId = user?.id;
  const username =
    (user?.user_metadata?.username as string | undefined)?.trim() || user?.email?.split('@')[0];
  useEffect(() => {
    if (!supabase || !userId || !username || !movie) return;
    supabase
      .from('user_activity')
      .upsert({
        user_id: userId,
        username,
        movie_slug: movie.slug,
        movie_name: movie.name,
        poster_url: movie.poster_url,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('Failed to publish activity', error);
      });
  }, [userId, username, movie]);

  const handleSelectEpisode = (serverIndex: number, episode: EpisodeItem) => {
    setCurrentServerIndex(serverIndex);
    setCurrentEpisode(episode);
    navigate(`/xem-phim/${slug}/${episode.slug}`, { replace: true });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Đang chuẩn bị trình phát video..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="p-4 rounded-full bg-zinc-900 text-zinc-500 inline-block">
          <Film className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Không Thể Phát Phim</h2>
        <p className="text-sm text-zinc-400">{error || 'Nguồn phát hiện không khả dụng.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    );
  }

  const isFav = isFavorite(movie.slug);
  const playerTitle = currentEpisode
    ? `${movie.name} - Tập ${currentEpisode.name}`
    : movie.name;

  return (
    <div
      className={`pt-20 pb-20 transition-all duration-300 ${
        isCinemaMode ? 'bg-black/95' : ''
      }`}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 space-y-6 transition-all duration-300 ${
          isCinemaMode ? 'max-w-[1550px]' : 'max-w-7xl'
        }`}
      >
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <Link
              to={`/phim/${movie.slug}`}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại phim</span>
            </Link>
            <span>/</span>
            <span className="text-zinc-200 font-semibold truncate">{movie.name}</span>
            {currentEpisode && (
              <>
                <span>/</span>
                <span className="text-rose-500 font-bold">Tập {currentEpisode.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => toggleFavorite(movie)}
              className={`p-2 rounded-xl border transition-colors ${
                isFav
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Yêu thích"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Chia sẻ link tập này"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <VideoPlayer
          embedUrl={currentEpisode?.embed || ''}
          title={playerTitle}
          isCinemaMode={isCinemaMode}
          onToggleCinemaMode={() => setIsCinemaMode(!isCinemaMode)}
        />

        {/* Grid: Episode List & Movie Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Episode List (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <EpisodeList
              servers={movie.episodes || []}
              currentServerIndex={currentServerIndex}
              currentEpisode={currentEpisode}
              onSelectEpisode={handleSelectEpisode}
            />

            {/* Note & Tip for Streaming */}
            <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/60 p-4 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Mẹo xem phim mượt mà:</span>
              </div>
              <p>
                Nếu video bị đứng hoặc tải chậm, bạn có thể nhấn nút <strong className="text-zinc-300">Tải lại</strong> trên thanh công cụ phát hoặc chọn máy chủ/nguồn phát khác nếu có.
              </p>
            </div>
          </div>

          {/* Quick Movie Info Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 space-y-4">
              <div className="flex gap-4 items-start">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  className="w-20 h-28 object-cover rounded-xl border border-zinc-800 flex-shrink-0 shadow-md"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white line-clamp-2 leading-snug">
                    {movie.name}
                  </h3>
                  <p className="text-xs text-zinc-400 italic line-clamp-1">
                    {movie.original_name}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {movie.quality && <Badge variant="amber">{movie.quality}</Badge>}
                    {movie.language && <Badge variant="blue">{movie.language}</Badge>}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800 pt-3">
                {movie.year && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Năm phát hành:</span>
                    <span className="text-zinc-200 font-medium">{movie.year}</span>
                  </div>
                )}
                {movie.time && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Thời lượng:</span>
                    <span className="text-zinc-200 font-medium">{movie.time}</span>
                  </div>
                )}
                {movie.current_episode && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Trạng thái:</span>
                    <span className="text-rose-400 font-semibold">{movie.current_episode}</span>
                  </div>
                )}
              </div>

              {movie.description && (
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-xs text-zinc-400 line-clamp-4 leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to={`/phim/${movie.slug}`}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-colors border border-zinc-700/50"
                >
                  <Info className="w-3.5 h-3.5" />
                  Xem thông tin chi tiết đầy đủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
