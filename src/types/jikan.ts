export interface JikanImageVariant {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
}

export interface JikanImages {
  jpg?: JikanImageVariant;
  webp?: JikanImageVariant;
}

export interface NamedItem {
  mal_id: number;
  type?: string | null;
  name: string;
  url?: string | null;
}

export interface Anime {
  mal_id: number;
  url?: string | null;
  images?: JikanImages;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  title_synonyms?: string[];
  type?: string | null;
  source?: string | null;
  episodes?: number | null;
  status?: string | null;
  airing?: boolean;
  aired?: { from?: string | null; to?: string | null; string?: string | null };
  duration?: string | null;
  rating?: string | null;
  score?: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  synopsis?: string | null;
  background?: string | null;
  season?: string | null;
  year?: number | null;
  genres?: NamedItem[];
  themes?: NamedItem[];
  demographics?: NamedItem[];
  studios?: NamedItem[];
  producers?: NamedItem[];
  licensors?: NamedItem[];
  relations?: Array<{ relation: string; entry: NamedItem[] }>;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: { count: number; total: number; per_page: number };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: Pagination;
}

export interface AnimeCharacter {
  character: {
    mal_id: number;
    name: string;
    images?: JikanImages;
    url?: string;
  };
  role: string;
  voice_actors?: Array<{
    person: { mal_id: number; name: string; images?: JikanImages };
    language: string;
  }>;
}

export interface AnimeEpisode {
  mal_id: number;
  title: string | null;
  title_japanese?: string | null;
  title_romanji?: string | null;
  aired?: string | null;
  score?: number | null;
  filler?: boolean;
  recap?: boolean;
}

export interface AnimeRecommendation {
  entry: Anime;
  url?: string;
  votes: number;
}
