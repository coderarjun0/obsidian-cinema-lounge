import { Play, Plus, Check, Star } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

interface CinemaHeroProps {
  movie: Movie;
  isInVault: boolean;
  onAddToVault: () => void;
  onRemoveFromVault: () => void;
  onViewDetails: () => void;
}

export default function CinemaHero({ movie, isInVault, onAddToVault, onRemoveFromVault, onViewDetails }: CinemaHeroProps) {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={movie.backdropUrl} alt={movie.title} className="h-full w-full object-cover object-center" />
        <div className="cinema-gradient absolute inset-0" />
        <div className="cinema-gradient-top absolute inset-0" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative z-10 flex h-full items-end pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl animate-slide-up">
          <div className="mb-4 flex items-center gap-3">
            <span className="glass-panel px-3 py-1 text-xs font-body font-semibold uppercase tracking-widest text-primary">
              Trending Now
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-primary" />
              <span className="font-body text-sm font-semibold">{movie.rating}</span>
            </span>
          </div>

          <h1 className="font-heading text-5xl font-black italic leading-[0.95] tracking-tight md:text-7xl lg:text-8xl gold-glow">
            {movie.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground font-body">
            <span>{movie.year}</span>
            {movie.runtime && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{movie.runtime} min</span>
              </>
            )}
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{movie.genres.join(" · ")}</span>
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-secondary-foreground/80 font-body line-clamp-3">
            {movie.overview}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={onViewDetails}
              className="flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.4)] hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-primary-foreground" />
              Watch Trailer
            </button>

            <button
              onClick={isInVault ? onRemoveFromVault : onAddToVault}
              className="glass-panel flex items-center gap-2.5 rounded-full px-6 py-3.5 font-heading text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:border-primary/50 hover:text-primary active:scale-95"
            >
              {isInVault ? (
                <><Check className="h-4 w-4" /> In Vault</>
              ) : (
                <><Plus className="h-4 w-4" /> Add to Vault</>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
