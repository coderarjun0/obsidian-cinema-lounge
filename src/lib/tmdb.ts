const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMjcyMzYyZDQyNDVmMzYwMDZhNTI5ZjhkNDU2YmVmNSIsIm5iZiI6MTc3NDEwODkxNS4yODcwMDAyLCJzdWIiOiI2OWJlYzBmMzY1YmJiYmQ5OWUyYjdkNjgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9MIpRQA2FB9nLk7lnlGYvq_VIYLS7wY4KRhdtFkf3us";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  "Content-Type": "application/json",
};

async function tmdbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

function posterUrl(path: string | null) {
  return path ? `${IMG}/w500${path}` : "/placeholder.svg";
}
function backdropUrl(path: string | null) {
  return path ? `${IMG}/original${path}` : "/placeholder.svg";
}
function profileUrl(path: string | null) {
  return path ? `${IMG}/w185${path}` : "/placeholder.svg";
}

// ── Movie types ───────────────────────────────────────────────────────

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
  runtime?: number;
}

export interface TmdbMovieDetail extends TmdbMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline?: string;
  budget?: number;
  revenue?: number;
  production_companies?: { name: string }[];
  spoken_languages?: { english_name: string }[];
  status?: string;
  vote_count?: number;
  videos?: { results: { key: string; site: string; type: string }[] };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  ["watch/providers"]?: {
    results: Record<string, {
      flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
      rent?: { provider_id: number; provider_name: string; logo_path: string }[];
      buy?: { provider_id: number; provider_name: string; logo_path: string }[];
    }>;
  };
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  logoUrl: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  year: string;
  genres: string[];
  runtime?: number;
  trailerKey?: string;
  cast?: { name: string; character: string; imageUrl: string }[];
  watchProviders?: WatchProvider[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  productionCompanies?: string[];
  spokenLanguages?: string[];
  status?: string;
  voteCount?: number;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

function mapBasicMovie(m: TmdbMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    posterUrl: posterUrl(m.poster_path),
    backdropUrl: backdropUrl(m.backdrop_path),
    rating: Math.round(m.vote_average * 10) / 10,
    year: m.release_date?.split("-")[0] ?? "",
    genres: (m.genre_ids ?? []).map((id) => GENRE_MAP[id] ?? "").filter(Boolean),
  };
}

interface PaginatedResult {
  movies: Movie[];
  totalPages: number;
}

export async function getTrending(page = 1): Promise<PaginatedResult> {
  const data = await tmdbFetch<{ results: TmdbMovie[]; total_pages: number }>(`/trending/movie/week?language=en-US&page=${page}`);
  return { movies: data.results.map(mapBasicMovie), totalPages: Math.min(data.total_pages, 20) };
}

export async function discoverByGenre(genreId: number, page = 1): Promise<PaginatedResult> {
  const data = await tmdbFetch<{ results: TmdbMovie[]; total_pages: number }>(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=${page}`
  );
  return { movies: data.results.map(mapBasicMovie), totalPages: Math.min(data.total_pages, 20) };
}

export async function searchMovies(query: string, page = 1): Promise<PaginatedResult> {
  if (!query.trim()) return { movies: [], totalPages: 0 };
  const data = await tmdbFetch<{ results: TmdbMovie[]; total_pages: number }>(
    `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
  );
  return { movies: data.results.map(mapBasicMovie), totalPages: Math.min(data.total_pages, 20) };
}

export async function getMovieDetail(id: number): Promise<Movie> {
  const m = await tmdbFetch<TmdbMovieDetail>(
    `/movie/${id}?language=en-US&append_to_response=videos,credits`
  );
  const trailer = m.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    posterUrl: posterUrl(m.poster_path),
    backdropUrl: backdropUrl(m.backdrop_path),
    rating: Math.round(m.vote_average * 10) / 10,
    year: m.release_date?.split("-")[0] ?? "",
    genres: m.genres.map((g) => g.name),
    runtime: m.runtime,
    trailerKey: trailer?.key,
    cast: m.credits?.cast.slice(0, 8).map((c) => ({
      name: c.name,
      character: c.character,
      imageUrl: profileUrl(c.profile_path),
    })),
  };
}

// ── TV / Series ───────────────────────────────────────────────────────

export interface TmdbSeries {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids?: number[];
}

export interface TmdbSeriesDetail extends TmdbSeries {
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  videos?: { results: { key: string; site: string; type: string }[] };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
}

export interface Series {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  year: string;
  genres: string[];
  runtime?: number;
  trailerKey?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  cast?: { name: string; character: string; imageUrl: string }[];
}

const TV_GENRE_MAP: Record<number, string> = {
  10759: "Action & Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids",
  9648: "Mystery", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
  10766: "Soap", 10767: "Talk", 10768: "War & Politics", 37: "Western",
};

function mapBasicSeries(s: TmdbSeries): Series {
  return {
    id: s.id,
    title: s.name,
    overview: s.overview,
    posterUrl: posterUrl(s.poster_path),
    backdropUrl: backdropUrl(s.backdrop_path),
    rating: Math.round(s.vote_average * 10) / 10,
    year: s.first_air_date?.split("-")[0] ?? "",
    genres: (s.genre_ids ?? []).map((id) => TV_GENRE_MAP[id] ?? "").filter(Boolean),
  };
}

export interface PaginatedSeriesResult {
  series: Series[];
  totalPages: number;
}

export async function getTrendingSeries(page = 1): Promise<PaginatedSeriesResult> {
  const data = await tmdbFetch<{ results: TmdbSeries[]; total_pages: number }>(
    `/trending/tv/week?language=en-US&page=${page}`
  );
  return { series: data.results.map(mapBasicSeries), totalPages: Math.min(data.total_pages, 20) };
}

export async function discoverSeriesByGenre(genreId: number, page = 1): Promise<PaginatedSeriesResult> {
  const data = await tmdbFetch<{ results: TmdbSeries[]; total_pages: number }>(
    `/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=${page}`
  );
  return { series: data.results.map(mapBasicSeries), totalPages: Math.min(data.total_pages, 20) };
}

export async function searchSeries(query: string, page = 1): Promise<PaginatedSeriesResult> {
  if (!query.trim()) return { series: [], totalPages: 0 };
  const data = await tmdbFetch<{ results: TmdbSeries[]; total_pages: number }>(
    `/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
  );
  return { series: data.results.map(mapBasicSeries), totalPages: Math.min(data.total_pages, 20) };
}

export async function getSeriesDetail(id: number): Promise<Series> {
  const s = await tmdbFetch<TmdbSeriesDetail>(
    `/tv/${id}?language=en-US&append_to_response=videos,credits`
  );
  const trailer = s.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  return {
    id: s.id,
    title: s.name,
    overview: s.overview,
    posterUrl: posterUrl(s.poster_path),
    backdropUrl: backdropUrl(s.backdrop_path),
    rating: Math.round(s.vote_average * 10) / 10,
    year: s.first_air_date?.split("-")[0] ?? "",
    genres: s.genres.map((g) => g.name),
    runtime: s.episode_run_time?.[0],
    trailerKey: trailer?.key,
    numberOfSeasons: s.number_of_seasons,
    numberOfEpisodes: s.number_of_episodes,
    cast: s.credits?.cast.slice(0, 8).map((c) => ({
      name: c.name,
      character: c.character,
      imageUrl: profileUrl(c.profile_path),
    })),
  };
}
