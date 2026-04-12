import { X, Star, Play, Plus, Check, Clock, Calendar } from "lucide-react";
import type { Movie } from "@/lib/mockData";

interface MovieDetailProps {
  movie: Movie;
  isInVault: boolean;
  onAddToVault: () => void;
  onRemoveFromVault: () => void;
  onClose: () => void;
}

export default function MovieDetail({ movie, isInVault, onAddToVault, onRemoveFromVault, onClose }: MovieDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in" onClick={onClose}>
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-glass-border/30 bg-card animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
          <img src={movie.backdrop_path} alt={movie.title} className="h-full w-full object-cover" />
          <div className="cinema-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-card/30" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 glass-panel rounded-full p-2.5 transition-all hover:bg-foreground/10"
          >
            <X className="h-4 w-4" />
          </button>

          {movie.trailer_key && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.trailer_key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_40px_hsl(var(--gold)/0.5)] hover:scale-110 active:scale-95"
            >
              <Play className="h-5 w-5 fill-primary-foreground" />
              Play Trailer
            </a>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-black italic sm:text-4xl">{movie.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Star className="h-4 w-4 fill-primary" />
                  {movie.vote_average}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {movie.release_date.split("-")[0]}
                </span>
                {movie.runtime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {movie.runtime} min
                  </span>
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

          {/* Genres */}
          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g} className="glass-panel rounded-full px-3 py-1 font-body text-xs font-medium text-muted-foreground">
                {g}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="mt-6 font-body text-sm leading-relaxed text-secondary-foreground/80">{movie.overview}</p>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-8">
              <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Cast</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {movie.cast.map((person) => (
                  <div key={person.name} className="flex shrink-0 items-center gap-3 glass-panel rounded-full pr-4">
                    <img
                      src={person.profile_path}
                      alt={person.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-body text-xs font-semibold">{person.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
