import { Link } from 'react-router-dom';
import { Film, Heart, ShieldCheck } from 'lucide-react';
import { GENRES, CATEGORIES } from '../../api/client';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-20 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                ph<span className="text-rose-500">ê</span>m
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400">
              Trang web xem phim trực tuyến miễn phí với giao diện hiện đại, tốc độ cao, hỗ trợ phụ đề Vietsub và thuyết minh chất lượng cao Full HD.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Dữ liệu API từ phim.nguonc.com</span>
            </div>
          </div>

          {/* Col 2: Danh Mục */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Danh Mục Phim</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/danh-sach/${cat.slug}`}
                    className="hover:text-rose-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Thể Loại */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thể Loại Hot</h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {GENRES.slice(0, 8).map((genre) => (
                <li key={genre.slug}>
                  <Link
                    to={`/the-loai/${genre.slug}`}
                    className="hover:text-rose-400 transition-colors truncate block"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Miễn trừ trách nhiệm */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Miễn Trừ Trách Nhiệm</h4>
            <p className="text-xs leading-relaxed text-zinc-500">
              Mọi nội dung trên website được thu thập tự động từ các dịch vụ video công khai trên internet qua REST API. Trang web không tự lưu trữ bất kỳ nội dung đa phương tiện nào.
            </p>
            <p className="text-xs text-zinc-500 flex items-center gap-1 pt-2">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for movie lovers.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} phêm. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            <Link to="/danh-sach/phim-moi-cap-nhat" className="hover:text-zinc-400">
              Phim mới
            </Link>
            <Link to="/yeu-thich" className="hover:text-zinc-400">
              Phim yêu thích
            </Link>
            <Link to="/lich-su" className="hover:text-zinc-400">
              Lịch sử xem
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
