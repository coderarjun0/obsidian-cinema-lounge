import { useNavigate } from "react-router-dom";
import { Film, Star, BookMarked, Search } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center flex-1 min-h-screen overflow-hidden px-6 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <Film className="w-8 h-8 text-primary" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-wide">
            CineSync
          </span>
        </div>

        {/* Headline */}
        <h1 className="relative font-heading text-5xl md:text-7xl font-bold leading-tight max-w-3xl mb-6">
          Your personal{" "}
          <span className="text-primary">cinematic</span>{" "}
          universe
        </h1>

        <p className="relative font-body text-muted-foreground text-lg md:text-xl max-w-xl mb-10">
          Discover trending films, explore by genre, and curate your own vault of must-watch movies.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/browse")}
          className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-105 active:scale-100 border border-primary/30"
        >
          Enter the Lounge →
        </button>
      </div>

      {/* Features */}
      <div className="px-6 py-24 md:px-16 lg:px-24 bg-muted/20">
        <h2 className="font-heading text-3xl font-bold text-center mb-16">
          Everything a cinephile needs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Search className="w-6 h-6 text-primary" />,
              title: "Discover & Search",
              desc: "Explore trending movies, search by title, and filter by genre — all in one place.",
            },
            {
              icon: <Star className="w-6 h-6 text-primary" />,
              title: "Rich Movie Details",
              desc: "Ratings, cast, trailers, and everything you need to decide what to watch next.",
            },
            {
              icon: <BookMarked className="w-6 h-6 text-primary" />,
              title: "Your Vault",
              desc: "Save films to your personal vault and never lose track of your watchlist again.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-background/60 backdrop-blur gap-4"
            >
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                {icon}
              </div>
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="font-body text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-24 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          Ready to watch something great?
        </h2>
        <p className="font-body text-muted-foreground mb-8">
          Your next favourite film is just one click away.
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-105 active:scale-100 border border-primary/30"
        >
          Start Exploring →
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs font-body text-muted-foreground border-t border-border">
        CineSync · Powered by TMDB
      </footer>
    </div>
  );
}
