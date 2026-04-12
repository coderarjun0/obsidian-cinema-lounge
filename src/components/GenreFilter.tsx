const GENRE_FILTERS = [
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

interface GenreFilterProps {
  activeId: number;
  onChange: (id: number) => void;
}

export default function GenreFilter({ activeId, onChange }: GenreFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
      {GENRE_FILTERS.map((g) => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
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
