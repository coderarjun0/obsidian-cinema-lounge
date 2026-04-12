import { useEffect } from "react";
import { X, Play, Plus, Check, Star, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Series } from "@/lib/tmdb";

interface SeriesDetailProps {
  series: Series;
  isInVault: boolean;
  onAddToVault: () => void;
  onRemoveFromVault: () => void;
  onClose: () => void;
}

export default function SeriesDetail({ series, isInVault, onAddToVault, onRemoveFromVault, onClose }: SeriesDetailProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const trailerUrl = series.trailerKey
    ? "https://www.youtube.com/watch?v=" + series.trailerKey
    : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

        <motion.div
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="relative h-64 overflow-hidden rounded-t-3xl">
            <img src={series.backdropUrl} alt={series.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 100%, #A855F722, transparent 60%)" }} />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 glass-panel rounded-full p-2 hover:border-primary/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 pb-8 -mt-10 relative">
            <div className="flex gap-4 items-end mb-6">
              <img src={series.posterUrl} alt={series.title} className="w-24 rounded-xl shadow-2xl shrink-0 border border-border" />
              <div className="pb-1">
                <h2 className="font-heading text-2xl font-black italic" style={{ color: "#A855F7", textShadow: "0 0 20px #A855F755" }}>
                  {series.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-body text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-purple-400 text-purple-400" />
                    {series.rating}
                  </span>
                  <span>·</span>
                  <span>{series.year}</span>
                  {series.numberOfSeasons && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Tv className="h-3 w-3" />
                        {series.numberOfSeasons} Seasons
                      </span>
                    </>
                  )}
                  {series.numberOfEpisodes && (
                    <>
                      <span>·</span>
                      <span>{series.numberOfEpisodes} Episodes</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {series.genres.map((g) => (
                    <span key={g} className="glass-panel px-2 py-0.5 rounded-full text-[10px] font-body font-semibold text-purple-400 border-purple-400/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="font-body text-sm leading-relaxed text-muted-foreground mb-6">{series.overview}</p>

            <div className="flex gap-3 mb-8 flex-wrap">
              {trailerUrl && (
  <a // <--- This 'a' was missing!
    href={trailerUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
    style={{ background: "#A855F7", color: "#fff", boxShadow: "0 0 20px #A855F755" }}
  >
    <Play className="h-4 w-4 fill-white" /> Watch Trailer
  </a>
)}
              <button
                onClick={isInVault ? onRemoveFromVault : onAddToVault}
                className="glass-panel flex items-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-semibold uppercase tracking-wider transition-all hover:border-purple-400/50 hover:text-purple-400 active:scale-95"
              >
                {isInVault ? (
                  <><Check className="h-4 w-4" /> In Vault</>
                ) : (
                  <><Plus className="h-4 w-4" /> Add to Vault</>
                )}
              </button>
            </div>

            {series.cast && series.cast.length > 0 && (
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Cast</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {series.cast.map((member) => (
                    <div key={member.name} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                      <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                      <span className="font-body text-[10px] text-center text-foreground leading-tight line-clamp-2">{member.name}</span>
                      <span className="font-body text-[9px] text-center text-muted-foreground leading-tight line-clamp-1">{member.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}