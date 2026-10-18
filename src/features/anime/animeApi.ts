import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/env";
import type {
  Anime, AnimeCharacter, AnimeEpisode, AnimeRecommendation, JikanResponse, NamedItem,
} from "../../types/jikan";

export interface AnimeSearchParams {
  page?: number;
  limit?: number;
  q?: string;
  genres?: string;
  status?: string;
  type?: string;
  order_by?: string;
  sort?: string;
  min_score?: number;
  max_score?: number;
  sfw?: boolean;
}

export const animeApi = createApi({
  reducerPath: "animeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: 15000,
  }),
  keepUnusedDataFor: 90,
  endpoints: (builder) => ({
    getAnime: builder.query<JikanResponse<Anime[]>, AnimeSearchParams>({
      query: (params = {}) => ({
        url: "/anime",
        params: Object.fromEntries(
          Object.entries({ limit: 24, sfw: true, ...params }).filter(([, value]) => value !== undefined && value !== ""),
        ),
      }),
    }),
    getTopAnime: builder.query<JikanResponse<Anime[]>, { page?: number; filter?: "airing" | "upcoming" | "bypopularity" | "favorite"; type?: string }>({
      query: (params = {}) => ({ url: "/top/anime", params: { limit: 24, ...params } }),
    }),
    getAnimeFull: builder.query<JikanResponse<Anime>, number>({
      query: (id) => `/anime/${id}/full`,
    }),
    getAnimeCharacters: builder.query<JikanResponse<AnimeCharacter[]>, number>({
      query: (id) => `/anime/${id}/characters`,
    }),
    getAnimeEpisodes: builder.query<JikanResponse<AnimeEpisode[]> & { pagination?: import("../../types/jikan").Pagination }, { id: number; page?: number }>({
      query: ({ id, page = 1 }) => ({ url: `/anime/${id}/episodes`, params: { page } }),
    }),
    getAnimeRecommendations: builder.query<JikanResponse<AnimeRecommendation[]>, number>({
      query: (id) => `/anime/${id}/recommendations`,
    }),
    getCurrentSeason: builder.query<JikanResponse<Anime[]>, { page?: number }>({
      query: ({ page = 1 } = {}) => ({ url: "/seasons/now", params: { page, limit: 24 } }),
    }),
    getSeason: builder.query<JikanResponse<Anime[]>, { year: number; season: "winter" | "spring" | "summer" | "fall"; page?: number }>({
      query: ({ year, season, page = 1 }) => ({ url: `/seasons/${year}/${season}`, params: { page, limit: 24 } }),
    }),
    getSchedule: builder.query<JikanResponse<Anime[]>, { filter?: string; kids?: boolean; sfw?: boolean; page?: number }>({
      query: (params = {}) => ({ url: "/schedules", params: { ...params, limit: 24 } }),
    }),
    getGenres: builder.query<JikanResponse<NamedItem[]>, void>({
      query: () => "/genres/anime",
    }),
  }),
});

export const {
  useGetAnimeQuery,
  useGetTopAnimeQuery,
  useGetAnimeFullQuery,
  useGetAnimeCharactersQuery,
  useGetAnimeEpisodesQuery,
  useGetAnimeRecommendationsQuery,
  useGetCurrentSeasonQuery,
  useGetSeasonQuery,
  useGetScheduleQuery,
  useGetGenresQuery,
} = animeApi;
