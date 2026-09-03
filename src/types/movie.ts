export interface MovieItem {
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created?: string;
  modified?: string;
  description: string;
  total_episodes?: number;
  current_episode: string;
  time?: string | null;
  quality: string;
  language: string;
  director?: string | null;
  casts?: string | null;
  year: string | number;
}

export interface PaginateInfo {
  current_page: number;
  total_page?: number;
  total_items?: number;
  items_per_page: number;
}

export interface MovieListResponse {
  status: 'success' | 'error';
  paginate: PaginateInfo;
  cat?: {
    name: string;
    title: string;
    slug: string;
  };
  items: MovieItem[];
}

export interface EpisodeItem {
  name: string;
  slug: string;
  embed: string;
  m3u8?: string;
}

export interface EpisodeServer {
  server_name: string;
  items: EpisodeItem[];
}

export interface CategoryGroupItem {
  id: string;
  name: string;
  slug?: string;
}

export interface CategoryGroup {
  group: {
    id: string;
    name: string;
  };
  list: CategoryGroupItem[];
}

export interface MovieDetail extends MovieItem {
  category: Record<string, CategoryGroup>;
  episodes: EpisodeServer[];
}

export interface MovieDetailResponse {
  status: 'success' | 'error';
  movie: MovieDetail;
}

export interface FavoriteMovie {
  slug: string;
  name: string;
  original_name: string;
  poster_url: string;
  thumb_url: string;
  quality: string;
  year: string | number;
  savedAt: number;
}

export interface WatchHistoryItem {
  slug: string;
  name: string;
  original_name: string;
  poster_url: string;
  thumb_url: string;
  episodeName: string;
  episodeSlug: string;
  watchedAt: number;
}
