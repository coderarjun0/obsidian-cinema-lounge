import MovieCard from "./MovieCard";
import type { Movie } from "@/lib/mockData";

interface DiscoveryGridProps {
  movies: Movie[];
  isInVault: (id: number) => boolean;
  onToggleVault: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export default function DiscoveryGrid({ movies, isInVault, onToggleVault, onSelectMovie }: DiscoveryGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-heading text-xl font-semibold text-muted-foreground">No films found</p>
        <p className="mt-2 font-body text-sm text-muted-foreground/60">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, i) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isInVault={isInVault(movie.id)}
          onToggleVault={() => onToggleVault(movie)}
          onClick={() => onSelectMovie(movie)}
          index={i}
        />
      ))}
    </div>
  );
}
