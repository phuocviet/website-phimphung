import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { ANIMAL_AVATARS } from '../../constants/avatars';

function getAvatarForUser(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
  }
  const index = Math.abs(hash) % ANIMAL_AVATARS.length;
  return ANIMAL_AVATARS[index].url;
}

interface ActivityRow {
  user_id: string;
  username: string;
  movie_slug: string;
  movie_name: string;
}

const REFRESH_MS = 60_000;

// Drifting loop of bubbles: what other users are watching. Click -> that movie's page.
export function WatchingBubbles() {
  const { user } = useAuth();
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    const load = () => {
      supabase!
        .from('user_activity')
        .select('user_id, username, movie_slug, movie_name')
        .order('updated_at', { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (cancelled) return;
          if (error) {
            console.error('Failed to load activity', error);
            return;
          }
          setRows(((data as ActivityRow[]) ?? []).filter((r) => r.user_id !== userId));
        });
    };

    load();
    const t = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [userId]);

  if (rows.length === 0) return null;

  // Repeat so one half always overflows the viewport, then duplicate for a seamless loop.
  const repeat = Math.max(1, Math.ceil(8 / rows.length));
  const half = Array.from({ length: repeat }).flatMap(() => rows);
  const items = [...half, ...half];
  const duration = Math.max(30, half.length * 6);

  return (
    <section aria-label="Mọi người đang xem" className="overflow-hidden -mx-4 sm:-mx-8 lg:-mx-12">
      <div
        className="bubbles-track flex w-max gap-4 py-4 px-4 hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((r, i) => (
          <Link
            key={`${r.user_id}-${i}`}
            to={`/phim/${r.movie_slug}`}
            title={`${r.username} đang xem ${r.movie_name}`}
            className="bubble flex items-center gap-2.5 flex-shrink-0 max-w-[260px] pl-1.5 pr-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
            style={{ animationDelay: `${(i % 5) * -0.8}s`, marginTop: (i % 3) * 6 }}
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700/80 p-0.5 flex items-center justify-center flex-shrink-0">
              <img
                src={getAvatarForUser(r.username)}
                alt={r.username}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="min-w-0 leading-tight">
              <span className="block text-xs font-semibold text-zinc-100 truncate">{r.username}</span>
              <span className="block text-[11px] text-zinc-500 truncate">đang xem {r.movie_name}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
