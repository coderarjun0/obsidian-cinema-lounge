import { Play, Plus, Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie, Series } from "@/lib/tmdb";

type Media = Movie | Series;

interface CinemaHeroProps {
  media: Media;
  isInVault: boolean;
  onAddToVault: () => void;
  onRemoveFromVault: () => void;
  onViewDetails: () => void;
  mode: "movies" | "series";
}

export default function CinemaHero({ media, isInVault, onAddToVault, onRemoveFromVault, onViewDetails, mode }: CinemaHeroProps) {
  const accentColor = mode === "movies" ? "#FFD700" : "#A855F7";
  const glowColor = mode === "movies" ? "#00E5FF22" : "#A855F722";

  return (
    <section className="relative h-[70vh] sm:h-[85vh] min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={media.backdropUrl}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src={media.backdropUrl} alt={media.title} className="h-full w-full object-cover object-center" />
          <div className="cinema-gradient absolute inset-0" />
          <div className="cinema-gradient-top absolute inset-0" />
          <div className="absolute inset-0 bg-background/40" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 20% 80%, ${glowColor}, transparent 60%)` }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-end pb-12 sm:pb-20 px-4 sm:px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl animate-slide-up">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="glass-panel px-3 py-1 text-xs font-body font-semibold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              {mode === "movies" ? "Trending Now" : "Top Series"}
            </span>
            <span className="flex items-center gap-1" style={{ color: accentColor }}>
              <Star className="h-4 w-4" style={{ fill: accentColor }} />
              <span className="font-body text-sm font-semibold">{media.rating}</span>
            </span>
          </div>

          <h1
            className="font-heading text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black italic leading-[0.95] tracking-tight md:tracking-tighter"
            style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}55` }}
          >
            {media.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground font-body">
            <span>{media.year}</span>
            {"numberOfSeasons" in media && media.numberOfSeasons && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{media.numberOfSeasons} Seasons</span>
              </>
            )}
            {media.runtime && !("numberOfSeasons" in media) && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{media.runtime} min</span>
              </>
            )}
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{media.genres.join(" · ")}</span>
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-secondary-foreground/80 font-body line-clamp-3">
            {media.overview}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <button
              onClick={onViewDetails}
              className="flex items-center justify-center gap-2.5 rounded-full w-[80%] sm:w-auto min-h-[48px] px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{
                background: accentColor,
                color: "#000",
                boxShadow: `0 0 30px ${accentColor}55`,
              }}
            >
              <Play className="h-4 w-4 fill-black" />
              {mode === "movies" ? "Watch Trailer" : "View Series"}
            </button>
            <button
              onClick={isInVault ? onRemoveFromVault : onAddToVault}
              className="glass-panel flex items-center justify-center gap-2.5 rounded-full w-[80%] sm:w-auto min-h-[48px] px-6 py-3.5 font-heading text-sm font-semibold uppercase tracking-wider text-foreground transition-all active:scale-95"
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
