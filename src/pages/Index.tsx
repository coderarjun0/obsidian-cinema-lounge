import { useState, useEffect, useCallback } from "react";
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
  const [activeGenre, setActiveGenre] = useState(0);
  const { vault, addToVault, removeFromVault, isInVault } = useVault();

  // Load trending on mount
  useEffect(() => {
    getTrending().then((data) => {
      setMovies(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      // When search clears, reload based on active genre
      if (activeGenre === 0) {
        getTrending().then(setMovies);
      } else {
        discoverByGenre(activeGenre).then(setMovies);
      }
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchMovies(searchQuery).then((data) => {
        setMovies(data);
        setLoading(false);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeGenre]);

  // Genre filter effect
  const handleGenreChange = useCallback((genreId: number) => {
    setActiveGenre(genreId);
    setSearchQuery("");
    setLoading(true);
    const fetcher = genreId === 0 ? getTrending() : discoverByGenre(genreId);
    fetcher.then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const handleSelectMovie = useCallback(async (movie: Movie) => {
    try {
      const detail = await getMovieDetail(movie.id);
      setSelectedMovie(detail);
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
            <DiscoveryGrid
              movies={movies}
              isInVault={isInVault}
              onToggleVault={toggleVault}
              onSelectMovie={handleSelectMovie}
            />
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
