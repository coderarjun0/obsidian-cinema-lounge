import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import CinemaHero from "@/components/CinemaHero";
import DiscoveryGrid from "@/components/DiscoveryGrid";
import VaultSection from "@/components/VaultSection";
import MovieDetail from "@/components/MovieDetail";
import SeriesDetail from "@/components/SeriesDetail";
import GenreFilter from "@/components/GenreFilter";
import {
  getTrending, searchMovies, getMovieDetail, discoverByGenre,
  getTrendingSeries, searchSeries, getSeriesDetail, discoverSeriesByGenre,
} from "@/lib/tmdb";
import type { Movie, Series } from "@/lib/tmdb";
import { useVault } from "@/hooks/useVault";
import { useModeStore } from "@/store/useModeStore";

export default function Index() {
  const { activeMode } = useModeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeGenre, setActiveGenre] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { vault, addToVault, removeFromVault, isInVault } = useVault();

  const fetchPage = useCallback(async (p: number, query: string, genre: number, append: boolean, mode: string) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      if (mode === "movies") {
        const result = query.trim()
          ? await searchMovies(query, p)
          : genre === 0 ? await getTrending(p) : await discoverByGenre(genre, p);
        setMovies((prev) => append ? [...prev, ...result.movies] : result.movies);
        setTotalPages(result.totalPages);
      } else {
        const result = query.trim()
          ? await searchSeries(query, p)
          : genre === 0 ? await getTrendingSeries(p) : await discoverSeriesByGenre(genre, p);
        setSeries((prev) => append ? [...prev, ...result.series] : result.series);
        setTotalPages(result.totalPages);
      }
      setPage(p);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setActiveGenre(0);
    setPage(1);
    fetchPage(1, "", 0, false, activeMode);
  }, [activeMode, fetchPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPage(1, searchQuery, activeGenre, false, activeMode);
    }, searchQuery.trim() ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, activeGenre, fetchPage, activeMode]);

  const handleGenreChange = useCallback((genreId: number) => {
    setActiveGenre(genreId);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && page < totalPages) {
          fetchPage(page + 1, searchQuery, activeGenre, true, activeMode);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, totalPages, loading, loadingMore, searchQuery, activeGenre, fetchPage, activeMode]);

  const handleSelectMovie = useCallback(async (movie: Movie) => {
    try { setSelectedMovie(await getMovieDetail(movie.id)); }
    catch { setSelectedMovie(movie); }
  }, []);

  const handleSelectSeries = useCallback(async (s: Series) => {
    try { setSelectedSeries(await getSeriesDetail(s.id)); }
    catch { setSelectedSeries(s); }
  }, []);

  const toggleVault = (item: Movie | Series) => {
    isInVault(item.id) ? removeFromVault(item.id) : addToVault(item as Movie);
  };

  const displayItems = activeMode === "movies" ? movies : series;
  const featured = displayItems[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <AnimatePresence mode="wait">
        {featured && (
          <motion.div
            key={`${activeMode}-hero`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CinemaHero
              media={featured}
              mode={activeMode}
              isInVault={isInVault(featured.id)}
              onAddToVault={() => addToVault(featured as Movie)}
              onRemoveFromVault={() => removeFromVault(featured.id)}
              onViewDetails={() =>
                activeMode === "movies"
                  ? handleSelectMovie(featured as Movie)
                  : handleSelectSeries(featured as Series)
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-4 py-10 md:px-16 lg:px-24 md:py-12">
        <VaultSection movies={vault} onRemove={removeFromVault} onSelect={handleSelectMovie} />

        <section className={vault.length > 0 ? "mt-16" : ""}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-heading text-2xl font-bold">
                {searchQuery ? "Search Results" : activeMode === "movies" ? "The Stage" : "The Series Vault"}
              </h2>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {loading ? "Loading..." : `${displayItems.length} ${activeMode === "movies" ? "films" : "series"} to discover`}
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
                movies={displayItems as Movie[]}
                isInVault={isInVault}
                onToggleVault={toggleVault}
                onSelectMovie={(item) =>
                  activeMode === "movies"
                    ? handleSelectMovie(item as Movie)
                    : handleSelectSeries(item as Series)
                }
              />
              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div
                    className="h-6 w-6 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: activeMode === "series" ? "#A855F7" : "hsl(var(--primary))",
                      borderTopColor: "transparent",
                    }}
                  />
                </div>
              )}
              {page < totalPages && <div ref={sentinelRef} className="h-1" />}
              {page >= totalPages && displayItems.length > 0 && (
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

      {selectedSeries && (
        <SeriesDetail
          series={selectedSeries}
          isInVault={isInVault(selectedSeries.id)}
          onAddToVault={() => addToVault(selectedSeries as unknown as Movie)}
          onRemoveFromVault={() => removeFromVault(selectedSeries.id)}
          onClose={() => setSelectedSeries(null)}
        />
      )}
    </div>
  );
}
