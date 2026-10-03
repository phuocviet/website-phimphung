import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Home,
  Clapperboard,
  Tv,
  TrendingUp,
  Plus,
  Shuffle,
} from 'lucide-react';

interface SidebarDockProps {
  onShuffle?: () => void;
}

export function SidebarDock({ onShuffle }: SidebarDockProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isSearch = currentPath.startsWith('/tim-kiem');
  const isHome = currentPath === '/';
  const isSingle = currentPath.startsWith('/danh-sach/phim-le');
  const isSeries = currentPath.startsWith('/danh-sach/phim-bo');
  const isTrending = currentPath.startsWith('/danh-sach/dang-chieu');
  const isFavorites = currentPath.startsWith('/yeu-thich');

  return (
    <>
      {/* Desktop / Tablet Vertical Sidebar */}
      <aside
        aria-label="Thanh điều hướng chính"
        className="fixed left-0 top-0 bottom-0 w-16 md:w-20 bg-black/90 md:bg-black/80 backdrop-blur-md z-40 hidden sm:flex flex-col items-center py-8 border-r border-white/5 select-none"
      >
        <div className="flex flex-col items-center gap-7 my-auto">
          {/* 1. Search */}
          <Link
            to="/tim-kiem"
            title="Tìm kiếm"
            className={`group relative flex flex-col items-center justify-center p-2 transition-colors ${
              isSearch ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform" />
            {isSearch && (
              <span className="w-4 h-[2.5px] bg-[#e50914] rounded-full mt-1.5 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Tìm kiếm
            </span>
          </Link>

          {/* 2. Home (Active on homepage) */}
          <Link
            to="/"
            title="Trang chủ"
            className={`group relative flex flex-col items-center justify-center p-2 transition-colors ${
              isHome ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform" />
            {isHome && (
              <span className="w-4 h-[2.5px] bg-[#e50914] rounded-full mt-1.5 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Trang chủ
            </span>
          </Link>

          {/* 3. Movies / Clapperboard */}
          <Link
            to="/danh-sach/phim-le"
            title="Phim lẻ"
            className={`group relative flex flex-col items-center justify-center p-2 transition-colors ${
              isSingle ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clapperboard className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform" />
            {isSingle && (
              <span className="w-4 h-[2.5px] bg-[#e50914] rounded-full mt-1.5 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Phim lẻ
            </span>
          </Link>

          {/* 4. TV Series */}
          <Link
            to="/danh-sach/phim-bo"
            title="Phim bộ"
            className={`group relative flex flex-col items-center justify-center p-2 transition-colors ${
              isSeries ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tv className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform" />
            {isSeries && (
              <span className="w-4 h-[2.5px] bg-[#e50914] rounded-full mt-1.5 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Phim bộ
            </span>
          </Link>

          {/* 5. Trending / Chart */}
          <Link
            to="/danh-sach/dang-chieu"
            title="Đang chiếu & Thịnh hành"
            className={`group relative flex flex-col items-center justify-center p-2 transition-colors ${
              isTrending ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform" />
            {isTrending && (
              <span className="w-4 h-[2.5px] bg-[#e50914] rounded-full mt-1.5 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Thịnh hành
            </span>
          </Link>

          {/* 6. Plus / Watchlist */}
          <Link
            to="/yeu-thich"
            title="Danh sách yêu thích"
            className={`group relative flex flex-col items-center justify-center p-2 transition-colors ${
              isFavorites ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[1.8] group-hover:scale-110 transition-transform" />
            {isFavorites && (
              <span className="w-4 h-[2.5px] bg-[#e50914] rounded-full mt-1.5 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Danh sách yêu thích
            </span>
          </Link>

          {/* 7. Shuffle / Random */}
          <button
            onClick={onShuffle}
            type="button"
            title="Xem phim ngẫu nhiên"
            className="group relative flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Shuffle className="w-5 h-5 stroke-[1.8] group-hover:rotate-45 transition-transform" />
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Phim ngẫu nhiên
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Thanh điều hướng di động"
        className="sm:hidden fixed bottom-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-3"
      >
        <Link to="/" className={`flex flex-col items-center py-1 ${isHome ? 'text-[#e50914]' : 'text-zinc-400'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Trang chủ</span>
        </Link>
        <Link to="/tim-kiem" className={`flex flex-col items-center py-1 ${isSearch ? 'text-[#e50914]' : 'text-zinc-400 hover:text-white'}`}>
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tìm kiếm</span>
        </Link>
        <Link to="/danh-sach/phim-le" className={`flex flex-col items-center py-1 ${isSingle ? 'text-[#e50914]' : 'text-zinc-400 hover:text-white'}`}>
          <Clapperboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Phim lẻ</span>
        </Link>
        <Link to="/danh-sach/phim-bo" className={`flex flex-col items-center py-1 ${isSeries ? 'text-[#e50914]' : 'text-zinc-400 hover:text-white'}`}>
          <Tv className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Phim bộ</span>
        </Link>
        <Link to="/yeu-thich" className={`flex flex-col items-center py-1 ${isFavorites ? 'text-[#e50914]' : 'text-zinc-400 hover:text-white'}`}>
          <Plus className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Yêu thích</span>
        </Link>
      </nav>
    </>
  );
}
