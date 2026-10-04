import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ANIMAL_AVATARS } from '../../constants/avatars';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarId?: string | null;
}

export function AvatarPickerModal({ isOpen, onClose, currentAvatarId }: AvatarPickerModalProps) {
  const { updateAvatar } = useAuth();
  const [selectedId, setSelectedId] = useState(currentAvatarId || 'panda');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (avatarId: string) => {
    setSelectedId(avatarId);
    setSaving(true);
    setErrorMsg(null);
    setSuccess(false);

    const err = await updateAvatar(avatarId);
    setSaving(false);

    if (err) {
      setErrorMsg(err);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Chọn linh vật đại diện</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Chọn 1 con vật bạn yêu thích để làm ảnh đại diện
          </p>
        </div>

        {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>Đã cập nhật avatar thành công!</span>
          </div>
        )}

        {/* Avatars Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto no-scrollbar p-1">
          {ANIMAL_AVATARS.map((avatar) => {
            const isSelected = selectedId === avatar.id;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleSelect(avatar.id)}
                disabled={saving}
                className={`group flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-500/10 border-[#e50914] ring-2 ring-[#e50914]/40 scale-105'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-850'
                }`}
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform group-hover:scale-110">
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-full h-full object-contain drop-shadow"
                    loading="lazy"
                  />
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-medium text-center truncate max-w-full ${
                    isSelected ? 'text-white font-semibold' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {avatar.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-zinc-850 text-center">
          <p className="text-[11px] text-zinc-500">
            Avatar này sẽ hiển thị cạnh tên của bạn và trên bong bóng hoạt động của website.
          </p>
        </div>
      </div>
    </div>
  );
}
