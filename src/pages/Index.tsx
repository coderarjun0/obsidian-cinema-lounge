import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CinemaHero from "@/components/CinemaHero";
import DiscoveryGrid from "@/components/DiscoveryGrid";
import VaultSection from "@/components/VaultSection";
import MovieDetail from "@/components/MovieDetail";
import { MOCK_MOVIES, FEATURED_MOVIE } from "@/lib/mockData";
import type { Movie } from "@/lib/mockData";
import { useVault } from "@/hooks/useVault";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { vault, addToVault, removeFromVault, isInVault } = useVault();

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_MOVIES;
    const q = searchQuery.toLowerCase();
    return MOCK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const toggleVault = (movie: Movie) => {
    if (isInVault(movie.id)) {
      removeFromVault(movie.id);
    } else {
      addToVault(movie);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <CinemaHero
        movie={FEATURED_MOVIE}
        isInVault={isInVault(FEATURED_MOVIE.id)}
        onAddToVault={() => addToVault(FEATURED_MOVIE)}
        onRemoveFromVault={() => removeFromVault(FEATURED_MOVIE.id)}
        onViewDetails={() => setSelectedMovie(FEATURED_MOVIE)}
      />

      <main className="px-6 py-12 md:px-16 lg:px-24">
        <VaultSection
          movies={vault}
          onRemove={removeFromVault}
          onSelect={setSelectedMovie}
        />

        <section className={vault.length > 0 ? "mt-16" : ""}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold">The Stage</h2>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {filteredMovies.length} films to discover
              </p>
            </div>
          </div>
          <DiscoveryGrid
            movies={filteredMovies}
            isInVault={isInVault}
            onToggleVault={toggleVault}
            onSelectMovie={setSelectedMovie}
          />
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
