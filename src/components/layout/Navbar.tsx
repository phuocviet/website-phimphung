import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  Heart,
  History,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { GENRES, COUNTRIES, YEARS, CATEGORIES } from '../../api/client';
import { useFavorites } from '../../hooks/useFavorites';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'genre' | 'country' | 'year' | null>(null);

  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Handle scroll backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleDropdown = (type: 'genre' | 'country' | 'year') => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 sm:left-16 md:left-20 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md shadow-lg shadow-black/80 border-b border-white/5 py-3'
          : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Logo */}
          <Link to="/" className="flex sm:hidden items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#e50914] flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                  ph<span className="text-[#e50914]">ê</span>m
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600/20 text-[#e50914] border border-red-500/30 uppercase tracking-widest hidden sm:inline-block">
                  HD
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-[#e50914] bg-rose-500/10' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Trang Chủ
            </Link>

            <Link
              to="/danh-sach/phim-le"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/danh-sach/phim-le'
                  ? 'text-[#e50914] bg-rose-500/10'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              Phim Lẻ
            </Link>

            <Link
              to="/danh-sach/phim-bo"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/danh-sach/phim-bo'
                  ? 'text-[#e50914] bg-rose-500/10'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              Phim Bộ
            </Link>

            <Link
              to="/danh-sach/dang-chieu"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/danh-sach/dang-chieu'
                  ? 'text-[#e50914] bg-rose-500/10'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              Đang Chiếu
            </Link>

            <Link
              to="/danh-sach/tv-shows"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/danh-sach/tv-shows'
                  ? 'text-[#e50914] bg-rose-500/10'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              TV Shows
            </Link>

            {/* Dropdown: Thể loại */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('genre')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeDropdown === 'genre' || location.pathname.startsWith('/the-loai')
                    ? 'text-[#e50914] bg-rose-500/10'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span>Thể Loại</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeDropdown === 'genre' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-1 z-50">
                  {GENRES.map((g) => (
                    <Link
                      key={g.slug}
                      to={`/the-loai/${g.slug}`}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-rose-400 hover:bg-zinc-900 transition-colors truncate"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown: Quốc gia */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('country')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeDropdown === 'country' || location.pathname.startsWith('/quoc-gia')
                    ? 'text-[#e50914] bg-rose-500/10'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span>Quốc Gia</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeDropdown === 'country' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-1 z-50">
                  {COUNTRIES.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/quoc-gia/${c.slug}`}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-rose-400 hover:bg-zinc-900 transition-colors truncate"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown: Năm */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('year')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeDropdown === 'year' || location.pathname.startsWith('/nam-phat-hanh')
                    ? 'text-[#e50914] bg-rose-500/10'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span>Năm</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeDropdown === 'year' && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-3 grid grid-cols-3 gap-1 z-50">
                  {YEARS.map((y) => (
                    <Link
                      key={y}
                      to={`/nam-phat-hanh/${y}`}
                      className="px-2 py-1.5 text-center rounded-lg text-xs font-medium text-zinc-300 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
                    >
                      {y}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Area: Search Box & Bookmarks */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên phim, diễn viên..."
                className="w-52 lg:w-64 pl-9 pr-3 py-1.5 text-xs rounded-full bg-zinc-900/90 border border-zinc-700/60 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-white placeholder-zinc-500 transition-all focus:w-72"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Mobile Search Icon */}
            <Link
              to="/tim-kiem"
              aria-label="Tìm kiếm"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white md:hidden"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Favorites Icon */}
            <Link
              to="/yeu-thich"
              title="Phim yêu thích"
              className="relative sm:hidden p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-[#e50914] transition-colors"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* History Icon */}
            <Link
              to="/lich-su"
              title="Lịch sử xem phim"
              className="sm:hidden p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-[#e50914] transition-colors"
            >
              <History className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white sm:hidden"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#0b0c0f]/98 backdrop-blur-xl border-t border-zinc-800 overflow-y-auto p-4 space-y-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm phim..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Mobile Categories */}
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-3 pb-1">Danh Mục</p>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/danh-sach/${c.slug}`}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-zinc-200 hover:text-rose-400 hover:bg-zinc-900"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Mobile Genres */}
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-3 pb-1">Thể Loại Phổ Biến</p>
            <div className="grid grid-cols-2 gap-1">
              {GENRES.slice(0, 12).map((g) => (
                <Link
                  key={g.slug}
                  to={`/the-loai/${g.slug}`}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-rose-400 hover:bg-zinc-900"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Countries */}
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-3 pb-1">Quốc Gia</p>
            <div className="grid grid-cols-2 gap-1">
              {COUNTRIES.slice(0, 8).map((c) => (
                <Link
                  key={c.slug}
                  to={`/quoc-gia/${c.slug}`}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-rose-400 hover:bg-zinc-900"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
