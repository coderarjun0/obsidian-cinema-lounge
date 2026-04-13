import { useMemo } from "react";
import { motion } from "framer-motion";
import { Film, Clock, Star, TrendingUp, ArrowLeft, User } from "lucide-react";
import { useVault } from "@/hooks/useVault";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/lib/tmdb";

export default function Profile() {
  const { user } = useAuth();
  const { vault } = useVault();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalMovies = vault.length;
    const avgRating = totalMovies > 0
      ? Math.round((vault.reduce((sum, m) => sum + m.rating, 0) / totalMovies) * 10) / 10
      : 0;
    const totalRuntime = vault.reduce((sum, m) => sum + (m.runtime ?? 0), 0);
    const hours = Math.floor(totalRuntime / 60);
    const mins = totalRuntime % 60;

    // Genre breakdown
    const genreCount: Record<string, number> = {};
    vault.forEach((m) => m.genres.forEach((g) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    }));
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Decade breakdown
    const decadeCount: Record<string, number> = {};
    vault.forEach((m) => {
      if (m.year) {
        const decade = `${m.year.slice(0, 3)}0s`;
        decadeCount[decade] = (decadeCount[decade] || 0) + 1;
      }
    });
    const topDecades = Object.entries(decadeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { totalMovies, avgRating, hours, mins, topGenres, topDecades };
  }, [vault]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-6 py-3 md:px-16 lg:px-24">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/browse")}
            className="glass-panel rounded-full p-2 hover:border-primary/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
          </button>
          <span className="font-heading text-lg font-black italic tracking-tight gold-glow">
            CINE-SYNC
          </span>
          <span className="font-body text-sm text-muted-foreground">/ Profile</span>
        </div>
      </div>

      <div className="pt-20 px-6 md:px-16 lg:px-24 pb-16 max-w-5xl mx-auto">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Your Profile</h1>
            <p className="font-body text-sm text-muted-foreground">{user?.email ?? "Guest"}</p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Film, label: "In Vault", value: stats.totalMovies, color: "text-primary" },
            { icon: Star, label: "Avg Rating", value: stats.avgRating, color: "text-primary" },
            { icon: Clock, label: "Watch Time", value: `${stats.hours}h ${stats.mins}m`, color: "text-primary" },
            { icon: TrendingUp, label: "Top Genre", value: stats.topGenres[0]?.[0] ?? "—", color: "text-primary" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl p-5 flex flex-col items-center text-center gap-2"
            >
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="font-heading text-xl font-bold text-foreground">{s.value}</span>
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Genre Breakdown */}
        {stats.topGenres.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-xl p-6 mb-6"
          >
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Genre Breakdown</h2>
            <div className="space-y-3">
              {stats.topGenres.map(([genre, count]) => {
                const pct = Math.round((count / stats.totalMovies) * 100);
                return (
                  <div key={genre} className="flex items-center gap-3">
                    <span className="font-body text-sm text-muted-foreground w-24 shrink-0">{genre}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <span className="font-body text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Decade Breakdown */}
        {stats.topDecades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-xl p-6 mb-6"
          >
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Decades</h2>
            <div className="flex flex-wrap gap-3">
              {stats.topDecades.map(([decade, count]) => (
                <div key={decade} className="glass-panel rounded-lg px-4 py-3 text-center">
                  <span className="font-heading text-lg font-bold text-primary block">{decade}</span>
                  <span className="font-body text-xs text-muted-foreground">{count} film{count !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Vault Additions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-xl p-6"
        >
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">Recent Vault Additions</h2>
          {vault.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-8">
              Your vault is empty. Start adding movies from the discovery grid!
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {vault.slice(-12).reverse().map((movie) => (
                <div key={movie.id} className="group relative">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg border border-border/50 group-hover:border-primary/50 transition-colors"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="font-body text-[10px] text-foreground leading-tight line-clamp-2">{movie.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
