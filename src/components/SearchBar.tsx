import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="glass-panel flex items-center gap-3 px-5 py-3 max-w-md w-full transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_20px_hsl(var(--gold)/0.1)]">
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        type="text"
        placeholder="Search the stage..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
