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
  videos?: { results: { key: string; site: string; type: string }[] };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
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
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

function posterUrl(path: string | null) {
  return path ? `${IMG}/w500${path}` : "/placeholder.svg";
}
function backdropUrl(path: string | null) {
  return path ? `${IMG}/original${path}` : "/placeholder.svg";
}
function profileUrl(path: string | null) {
  return path ? `${IMG}/w185${path}` : "/placeholder.svg";
}

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

export async function getTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>("/trending/movie/week?language=en-US");
  return data.results.slice(0, 18).map(mapBasicMovie);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: TmdbMovie[] }>(
    `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`
  );
  return data.results.slice(0, 18).map(mapBasicMovie);
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
