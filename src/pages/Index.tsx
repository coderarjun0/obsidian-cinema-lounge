import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import CinemaHero from "@/components/CinemaHero";
import DiscoveryGrid from "@/components/DiscoveryGrid";
import VaultSection from "@/components/VaultSection";
import MovieDetail from "@/components/MovieDetail";
import GenreFilter from "@/components/GenreFilter";
import { getTrending, searchMovies, getMovieDetail, discoverByGenre } from "@/lib/tmdb";
import type { Movie } from "@/lib/tmdb";
import { useVault } from "@/hooks/useVault";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeGenre, setActiveGenre] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { vault, addToVault, removeFromVault, isInVault } = useVault();

  const fetchPage = useCallback(async (p: number, query: string, genre: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const result = query.trim()
        ? await searchMovies(query, p)
        : genre === 0
          ? await getTrending(p)
          : await discoverByGenre(genre, p);
      setMovies((prev) => append ? [...prev, ...result.movies] : result.movies);
      setTotalPages(result.totalPages);
      setPage(p);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(1, "", 0, false);
  }, [fetchPage]);

  // Search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPage(1, searchQuery, activeGenre, false);
    }, searchQuery.trim() ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, activeGenre, fetchPage]);

  // Genre change
  const handleGenreChange = useCallback((genreId: number) => {
    setActiveGenre(genreId);
    setSearchQuery("");
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && page < totalPages) {
          fetchPage(page + 1, searchQuery, activeGenre, true);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, totalPages, loading, loadingMore, searchQuery, activeGenre, fetchPage]);

  const handleSelectMovie = useCallback(async (movie: Movie) => {
    try {
      setSelectedMovie(await getMovieDetail(movie.id));
    } catch {
      setSelectedMovie(movie);
    }
  }, []);

  const toggleVault = (movie: Movie) => {
    isInVault(movie.id) ? removeFromVault(movie.id) : addToVault(movie);
  };

  const featured = movies[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {featured && (
        <CinemaHero
          movie={featured}
          isInVault={isInVault(featured.id)}
          onAddToVault={() => addToVault(featured)}
          onRemoveFromVault={() => removeFromVault(featured.id)}
          onViewDetails={() => handleSelectMovie(featured)}
        />
      )}

      <main className="px-6 py-12 md:px-16 lg:px-24">
        <VaultSection movies={vault} onRemove={removeFromVault} onSelect={handleSelectMovie} />

        <section className={vault.length > 0 ? "mt-16" : ""}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-heading text-2xl font-bold">
                {searchQuery ? "Search Results" : "The Stage"}
              </h2>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {loading ? "Loading..." : `${movies.length} films to discover`}
              </p>
            </div>
          </div>

          {!searchQuery && <GenreFilter activeId={activeGenre} onChange={handleGenreChange} />}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="glass-card aspect-[2/3] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <DiscoveryGrid
                movies={movies}
                isInVault={isInVault}
                onToggleVault={toggleVault}
                onSelectMovie={handleSelectMovie}
              />
              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
              {page < totalPages && <div ref={sentinelRef} className="h-1" />}
              {page >= totalPages && movies.length > 0 && (
                <p className="text-center font-body text-xs text-muted-foreground py-8">You've reached the end</p>
              )}
            </>
          )}
        </section>
      </main>

      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          isInVault={isInVault(selectedMovie.id)}
          onAddToVault={() => addToVault(selectedMovie)}
          onRemoveFromVault={() => removeFromVault(selectedMovie.id)}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
