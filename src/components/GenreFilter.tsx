import { useModeStore } from "@/store/useModeStore";

const MOVIE_GENRES = [
  { id: 0, name: "All" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

const TV_GENRES = [
  { id: 0, name: "All" },
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

interface GenreFilterProps {
  activeId: number;
  onChange: (id: number) => void;
}

export default function GenreFilter({ activeId, onChange }: GenreFilterProps) {
  const { activeMode } = useModeStore();
  const genres = activeMode === "series" ? TV_GENRES : MOVIE_GENRES;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none px-4 -mx-4 md:px-1 md:-mx-1 snap-x snap-mandatory">
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 snap-start ${
            activeId === g.id
              ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--gold)/0.3)]"
              : "glass-panel text-muted-foreground hover:text-foreground hover:border-primary/40"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
