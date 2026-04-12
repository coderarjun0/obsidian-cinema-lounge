import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  loading?: boolean;
}

export default function MovieRow({ title, movies, onSelectMovie, loading }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-6">
        <h2 className="movie-row-title mb-4 px-6 md:px-16 lg:px-24">{title}</h2>
        <div className="flex gap-4 px-6 md:px-16 lg:px-24 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass-card aspect-[2/3] w-[160px] md:w-[200px] flex-shrink-0 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="group/row py-6">
      <div className="flex items-center justify-between mb-4 px-6 md:px-16 lg:px-24">
        <h2 className="movie-row-title">{title}</h2>
        <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll("left")}
            className="glass-panel p-2 rounded-full hover:bg-primary/20 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="glass-panel p-2 rounded-full hover:bg-primary/20 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-16 lg:px-24 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="group relative cursor-pointer flex-shrink-0 snap-start animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onSelectMovie(movie)}
          >
            <div className="glass-card overflow-hidden w-[160px] md:w-[200px] aspect-[2/3]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 p-4">
                <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="font-body text-xs font-bold text-primary">{movie.rating}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{movie.year}</span>
                  </div>
                  <h3 className="font-heading text-sm font-bold leading-tight line-clamp-2 text-foreground">{movie.title}</h3>
                  <p className="mt-1 font-body text-xs text-muted-foreground line-clamp-1">{movie.genres.join(" / ")}</p>
                  
                  {/* Play button */}
                  <div className="mt-3 flex justify-center">
                    <div className="glass-panel p-2 rounded-full neon-gold-glow">
                      <Play className="h-4 w-4 fill-primary text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
