import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import type { MovieItem } from '../../types/movie';
import { MovieSlider } from './MovieSlider';
import { getAvatarUrl } from '../../constants/avatars';
import { AvatarPickerModal } from '../auth/AvatarPickerModal';

const DEFAULT_TITLE = 'Phim bạn xem';

// Personalized section: shows the signed-in user's saved movies (from Supabase) + avatar picker
export function SavedMoviesSection() {
  const { user, loading: authLoading, openAuthModal, signOut } = useAuth();
  const { favorites, loading } = useFavorites();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const username =
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    user?.email?.split('@')[0];
  const rawAvatar = (user?.user_metadata?.avatar as string | undefined) || 'panda';
  const currentAvatarUrl = getAvatarUrl(rawAvatar);

  const TITLE = user && username ? `Phim ${username} Xem` : DEFAULT_TITLE;

  const headerTitleNode = (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{TITLE}</h2>
      {user && (
        <button
          type="button"
          onClick={() => setAvatarModalOpen(true)}
          title="Nhấp để đổi linh vật đại diện"
          className="group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900/90 border-2 border-transparent hover:border-[#e50914] p-0.5 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-red-600/25 cursor-pointer"
        >
          <img
            src={currentAvatarUrl}
            alt={username || 'Avatar'}
            className="w-full h-full object-contain drop-shadow"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-zinc-900 border border-zinc-700 group-hover:border-[#e50914] rounded-full flex items-center justify-center text-[9px] text-zinc-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all shadow-sm">
            ✏️
          </span>
        </button>
      )}
    </div>
  );

  const logoutButton = (
    <button
      onClick={signOut}
      className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
    >
      Đăng xuất
    </button>
  );

  if (authLoading) return null;

  if (!user) {
    return (
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 sm:mb-4">{TITLE}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-5">
          <p className="text-sm text-zinc-400">Đăng nhập để xem danh sách phim bạn đã lưu.</p>
          <button
            onClick={openAuthModal}
            className="self-start sm:self-auto px-5 py-2 rounded-full bg-[#e50914] hover:bg-red-700 text-sm font-semibold text-white transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </section>
    );
  }

  if (loading) return null;

  if (favorites.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          {headerTitleNode}
          {logoutButton}
        </div>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-10 text-center">
          <p className="text-sm text-zinc-400">Bạn chưa lưu phim nào</p>
          <Link
            to="/danh-sach/phim-le"
            className="px-5 py-2 rounded-full bg-[#e50914] hover:bg-red-700 text-sm font-semibold text-white transition-colors"
          >
            Khám phá phim
          </Link>
        </div>

        <AvatarPickerModal
          isOpen={avatarModalOpen}
          onClose={() => setAvatarModalOpen(false)}
          currentAvatarId={rawAvatar}
        />
      </section>
    );
  }

  // favorites are already ordered by created_at DESC (newest first)
  const movies = favorites as unknown as MovieItem[];

  return (
    <>
      <MovieSlider
        title={headerTitleNode}
        headerRight={logoutButton}
        movies={movies}
      />

      <AvatarPickerModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatarId={rawAvatar}
      />
    </>
  );
}
