import { Star, Plus, Check } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  isInVault: boolean;
  onToggleVault: () => void;
  onClick: () => void;
  index: number;
}

export default function MovieCard({ movie, isInVault, onToggleVault, onClick, index }: MovieCardProps) {
  return (
    <div
      className="group relative cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={onClick}
    >
      <div className="glass-card overflow-hidden aspect-[2/3]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 p-4">
          <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-body text-xs font-bold text-primary">{movie.rating}</span>
            </div>
            <h3 className="font-heading text-base font-bold leading-tight">{movie.title}</h3>
            <p className="mt-1 font-body text-xs text-muted-foreground">{movie.genres.join(" · ")}</p>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleVault(); }}
          className={`absolute right-3 top-3 rounded-full p-2 transition-all duration-300 ${
            isInVault
              ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--gold)/0.4)]"
              : "bg-background/60 backdrop-blur-md text-foreground opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {isInVault ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
