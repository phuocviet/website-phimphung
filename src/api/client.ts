import type { MovieDetailResponse, MovieListResponse } from '../types/movie';

const API_BASE_URL = 'https://phim.nguonc.com/api';

export const CATEGORIES = [
  { slug: 'phim-moi-cap-nhat', name: 'Phim Mới Cập Nhật' },
  { slug: 'dang-chieu', name: 'Phim Đang Chiếu' },
  { slug: 'phim-bo', name: 'Phim Bộ' },
  { slug: 'phim-le', name: 'Phim Lẻ' },
  { slug: 'tv-shows', name: 'TV Shows' },
];

export const GENRES = [
  { slug: 'hanh-dong', name: 'Hành Động' },
  { slug: 'phieu-luu', name: 'Phiêu Lưu' },
  { slug: 'hoat-hinh', name: 'Hoạt Hình' },
  { slug: 'phim-hai', name: 'Hài' },
  { slug: 'hinh-su', name: 'Hình Sự' },
  { slug: 'tai-lieu', name: 'Tài Liệu' },
  { slug: 'chinh-kich', name: 'Chính Kịch' },
  { slug: 'gia-dinh', name: 'Gia Đình' },
  { slug: 'gia-tuong', name: 'Giả Tưởng' },
  { slug: 'lich-su', name: 'Lịch Sử' },
  { slug: 'kinh-di', name: 'Kinh Dị' },
  { slug: 'phim-nhac', name: 'Nhạc' },
  { slug: 'bi-an', name: 'Bí Ẩn' },
  { slug: 'lang-man', name: 'Lãng Mạn' },
  { slug: 'khoa-hoc-vien-tuong', name: 'Khoa Học Viễn Tưởng' },
  { slug: 'gay-can', name: 'Gây Cấn' },
  { slug: 'chien-tranh', name: 'Chiến Tranh' },
  { slug: 'tam-ly', name: 'Tâm Lý' },
  { slug: 'tinh-cam', name: 'Tình Cảm' },
  { slug: 'co-trang', name: 'Cổ Trang' },
  { slug: 'mien-tay', name: 'Miền Tây' },
];

export const COUNTRIES = [
  { slug: 'au-my', name: 'Âu Mỹ' },
  { slug: 'anh', name: 'Anh' },
  { slug: 'trung-quoc', name: 'Trung Quốc' },
  { slug: 'viet-nam', name: 'Việt Nam' },
  { slug: 'han-quoc', name: 'Hàn Quốc' },
  { slug: 'nhat-ban', name: 'Nhật Bản' },
  { slug: 'thai-lan', name: 'Thái Lan' },
  { slug: 'hong-kong', name: 'Hồng Kông' },
  { slug: 'dai-loan', name: 'Đài Loan' },
  { slug: 'an-do', name: 'Ấn Độ' },
  { slug: 'phap', name: 'Pháp' },
  { slug: 'nga', name: 'Nga' },
  { slug: 'indonesia', name: 'Indonesia' },
  { slug: 'philippines', name: 'Philippines' },
];

export const YEARS = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016,
];

// Helper fetch wrapper with timeout & error handling
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T;
  } catch (err) {
    console.error(`Fetch failed for URL: ${url}`, err);
    throw err;
  }
}

// 1. Phim mới cập nhật
export async function getLatestMovies(page = 1): Promise<MovieListResponse> {
  return fetchFromApi<MovieListResponse>(`/films/phim-moi-cap-nhat?page=${page}`);
}

// 2. Phim theo danh mục (phim-le, phim-bo, dang-chieu, tv-shows)
export async function getMoviesByCategory(slug: string, page = 1): Promise<MovieListResponse> {
  return fetchFromApi<MovieListResponse>(`/films/danh-sach/${slug}?page=${page}`);
}

// 3. Phim theo thể loại
export async function getMoviesByGenre(slug: string, page = 1): Promise<MovieListResponse> {
  return fetchFromApi<MovieListResponse>(`/films/the-loai/${slug}?page=${page}`);
}

// 4. Phim theo quốc gia
export async function getMoviesByCountry(slug: string, page = 1): Promise<MovieListResponse> {
  return fetchFromApi<MovieListResponse>(`/films/quoc-gia/${slug}?page=${page}`);
}

// 5. Phim theo năm phát hành
export async function getMoviesByYear(year: string | number, page = 1): Promise<MovieListResponse> {
  return fetchFromApi<MovieListResponse>(`/films/nam-phat-hanh/${year}?page=${page}`);
}

// 6. Chi tiết phim
export async function getMovieDetail(slug: string): Promise<MovieDetailResponse> {
  return fetchFromApi<MovieDetailResponse>(`/film/${slug}`);
}

// 7. Tìm kiếm phim
export async function searchMovies(keyword: string, page = 1): Promise<MovieListResponse> {
  return fetchFromApi<MovieListResponse>(`/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
}
