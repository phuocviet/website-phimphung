import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { ANIMAL_AVATARS } from '../../constants/avatars';

export function AuthModal() {
  const { authModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('panda');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const err =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password, username, selectedAvatar);
    setSubmitting(false);
    if (err) setMessage(err);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          aria-label="Đóng"
          className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold text-white">
          {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </h2>
        <p className="text-xs text-zinc-500">Đăng nhập để lưu phim và xem lại ở mục "Phim Phước Xem".</p>

        {!isSupabaseConfigured && (
          <p className="text-xs text-amber-400">
            Chưa cấu hình VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              {/* Animal Avatar Picker */}
              <div className="space-y-1.5 pb-1">
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span>Chọn linh vật đại diện:</span>
                  <span className="text-[11px] text-[#e50914] font-semibold">
                    {ANIMAL_AVATARS.find((a) => a.id === selectedAvatar)?.name}
                  </span>
                </label>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
                  {ANIMAL_AVATARS.map((a) => {
                    const isPicked = selectedAvatar === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSelectedAvatar(a.id)}
                        className={`flex-shrink-0 w-11 h-11 p-1 rounded-xl border transition-all ${
                          isPicked
                            ? 'bg-red-500/10 border-[#e50914] ring-2 ring-[#e50914]/40 scale-105'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                        }`}
                        title={a.name}
                      >
                        <img src={a.url} alt={a.name} className="w-full h-full object-contain" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <input
                type="text"
                required
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên người dùng"
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </>
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
          />
          {message && <p className="text-xs text-rose-400">{message}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 rounded-lg bg-[#e50914] hover:bg-red-700 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setMessage(null);
          }}
          className="w-full text-xs text-zinc-400 hover:text-white"
        >
          {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  );
}
