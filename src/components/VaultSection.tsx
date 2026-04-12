import { Lock, Trash2 } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

interface VaultSectionProps {
  movies: Movie[];
  onRemove: (id: number) => void;
  onSelect: (movie: Movie) => void;
}

export default function VaultSection({ movies, onRemove, onSelect }: VaultSectionProps) {
  if (movies.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="glass-panel rounded-full p-2.5">
          <Lock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold">The Vault</h2>
          <p className="font-body text-xs text-muted-foreground">Your personal collection · {movies.length} films</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {movies.map((movie) => (
          <div key={movie.id} className="group relative shrink-0 w-32 cursor-pointer" onClick={() => onSelect(movie)}>
            <div className="glass-card overflow-hidden aspect-[2/3] rounded-lg">
              <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
                  className="rounded-full bg-destructive p-2 text-destructive-foreground transition-transform hover:scale-110 active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 font-body text-xs font-medium truncate text-muted-foreground group-hover:text-foreground transition-colors">{movie.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
