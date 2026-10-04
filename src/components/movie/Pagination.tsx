import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const navBtn =
  'flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-zinc-900 disabled:hover:text-zinc-300';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState('');

  if (totalPages <= 1) return null;

  // Collapse page numbers: 1 2 3 … N (window of neighbors around current page)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const go = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    if (target !== currentPage) {
      onPageChange(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(jumpValue, 10);
    if (!Number.isNaN(n)) go(n);
    setJumpValue('');
  };

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  let summary: string | null = null;
  if (totalItems && itemsPerPage) {
    const from = (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, totalItems);
    summary = `Hiển thị ${from.toLocaleString('en-US')}–${to.toLocaleString('en-US')} trong ${totalItems.toLocaleString('en-US')} phim`;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-12 mb-8 select-none">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
        <button onClick={() => go(1)} disabled={isFirst} title="Trang đầu" aria-label="Trang đầu" className={navBtn}>
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button onClick={() => go(currentPage - 1)} disabled={isFirst} title="Trang trước" aria-label="Trang trước" className={navBtn}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="w-6 text-center text-zinc-500 text-sm">
              …
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => go(page as number)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`min-w-9 h-9 px-2.5 text-sm font-semibold rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-[#e50914] border-[#e50914] text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button onClick={() => go(currentPage + 1)} disabled={isLast} title="Trang kế tiếp" aria-label="Trang kế tiếp" className={navBtn}>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => go(totalPages)} disabled={isLast} title="Trang cuối" aria-label="Trang cuối" className={navBtn}>
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-x-6 gap-y-2 flex-wrap text-xs text-zinc-500">
        {summary && <span>{summary}</span>}
        <form onSubmit={handleJump} className="flex items-center gap-2">
          <label htmlFor="jump-page">Đến trang</label>
          <input
            id="jump-page"
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            placeholder={`1–${totalPages}`}
            className="w-20 h-8 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="submit"
            className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Đi
          </button>
        </form>
      </div>
    </div>
  );
}
