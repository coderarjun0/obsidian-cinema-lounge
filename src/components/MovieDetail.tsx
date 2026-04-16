import { X, Star, Play, Plus, Check, Clock, Calendar, Tv, Globe, Film, DollarSign, Users } from "lucide-react";
import type { Movie } from "@/lib/tmdb";
import ReviewSection from "./ReviewSection";

interface MovieDetailProps {
  movie: Movie;
  isInVault: boolean;
  onAddToVault: () => void;
  onRemoveFromVault: () => void;
  onClose: () => void;
}

function formatCurrency(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MovieDetail({ movie, isInVault, onAddToVault, onRemoveFromVault, onClose }: MovieDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-glass-border/30 bg-card animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
          <img src={movie.backdropUrl} alt={movie.title} className="h-full w-full object-cover" />
          <div className="cinema-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-card/30" />

          <button onClick={onClose} className="absolute right-4 top-4 glass-panel rounded-full p-2.5 transition-all hover:bg-foreground/10">
            <X className="h-4 w-4" />
          </button>

          {movie.trailerKey && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_40px_hsl(var(--gold)/0.5)] hover:scale-110 active:scale-95"
            >
              <Play className="h-5 w-5 fill-primary-foreground" />
              Play Trailer
            </a>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-black italic sm:text-4xl">{movie.title}</h2>
              {movie.tagline && (
                <p className="mt-1 font-body text-sm italic text-muted-foreground">"{movie.tagline}"</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Star className="h-4 w-4 fill-primary" />{movie.rating}
                  {movie.voteCount && <span className="text-[10px] text-muted-foreground font-normal ml-0.5">({movie.voteCount.toLocaleString()})</span>}
                </span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{movie.year}</span>
                {movie.runtime && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{movie.runtime} min</span>}
                {movie.status && movie.status !== "Released" && (
                  <span className="glass-panel rounded-full px-2 py-0.5 text-xs font-medium text-primary">{movie.status}</span>
                )}
              </div>
            </div>

            <button
              onClick={isInVault ? onRemoveFromVault : onAddToVault}
              className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                isInVault
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--gold)/0.3)]"
                  : "glass-panel text-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              {isInVault ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {isInVault ? "In Vault" : "Add to Vault"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g} className="glass-panel rounded-full px-3 py-1 font-body text-xs font-medium text-muted-foreground">{g}</span>
            ))}
          </div>

          {/* Watch Providers */}
          {movie.watchProviders && movie.watchProviders.length > 0 && (
            <div className="mt-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <Tv className="h-3.5 w-3.5" /> Available On
              </h3>
              <div className="flex items-center gap-2">
                {movie.watchProviders.map((p) => (
                  <div key={p.provider_id} className="flex items-center gap-2 glass-panel rounded-full pr-3">
                    <img src={p.logoUrl} alt={p.provider_name} className="h-8 w-8 rounded-full object-cover" />
                    <span className="font-body text-xs font-medium">{p.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 font-body text-sm leading-relaxed text-secondary-foreground/80">{movie.overview}</p>

          {/* Enhanced Details */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
              <div className="glass-panel rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Languages</span>
                </div>
                <p className="font-body text-xs text-foreground">{movie.spokenLanguages.slice(0, 3).join(", ")}</p>
              </div>
            )}
            {movie.budget && (
              <div className="glass-panel rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Budget</span>
                </div>
                <p className="font-body text-xs text-foreground">{formatCurrency(movie.budget)}</p>
              </div>
            )}
            {movie.revenue && (
              <div className="glass-panel rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</span>
                </div>
                <p className="font-body text-xs text-foreground">{formatCurrency(movie.revenue)}</p>
              </div>
            )}
            {movie.productionCompanies && movie.productionCompanies.length > 0 && (
              <div className="glass-panel rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Film className="h-3 w-3 text-muted-foreground" />
                  <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Studio</span>
                </div>
                <p className="font-body text-xs text-foreground">{movie.productionCompanies.slice(0, 2).join(", ")}</p>
              </div>
            )}
          </div>

          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-8">
              <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Cast
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {movie.cast.map((person) => (
                  <div key={person.name} className="flex shrink-0 items-center gap-3 glass-panel rounded-full pr-4">
                    <img src={person.imageUrl} alt={person.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-body text-xs font-semibold">{person.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ReviewSection mediaId={movie.id} mediaType="movie" />
        </div>
      </div>
    </div>
  );
}
