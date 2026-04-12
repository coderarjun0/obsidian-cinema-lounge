import { Film } from "lucide-react";
import SearchBar from "./SearchBar";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-6 py-3 md:px-16 lg:px-24">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 shrink-0">
          <Film className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-black italic tracking-tight gold-glow">
            CINE-SYNC
          </span>
        </div>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
    </nav>
  );
}
