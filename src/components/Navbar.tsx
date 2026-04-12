import { useState } from "react";
import { Film, User, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-6 py-3 md:px-16 lg:px-24">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <Film className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg font-black italic tracking-tight gold-glow">
                CINE-SYNC
              </span>
            </div>

            {/* Auth button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:border-primary/50"
                >
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-body text-xs text-muted-foreground hidden sm:inline max-w-[100px] truncate">
                    {user.email}
                  </span>
                </button>
                {showMenu && (
                  <div className="absolute top-full left-0 mt-2 glass-panel rounded-lg p-1 min-w-[140px] animate-fade-in">
                    <button
                      onClick={() => { signOut(); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full rounded-md px-3 py-2 font-body text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:border-primary/50 hover:text-primary"
              >
                <User className="h-3.5 w-3.5" />
                <span className="font-body text-xs font-semibold">Sign In</span>
              </button>
            )}
          </div>

          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
