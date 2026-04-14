import { useState } from "react";
import { Film, User, LogOut, UserCircle, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useModeStore } from "@/store/useModeStore";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { activeMode, setMode } = useModeStore();
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-6 py-5 md:px-16 lg:px-24 md:py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <Film className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg font-black italic tracking-tight gold-glow">
                CINE-SYNC
              </span>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={() => setMode(activeMode === "movies" ? "series" : "movies")}
              className="relative flex items-center rounded-full p-1 shrink-0 cursor-pointer w-[120px] h-[48px] md:h-[32px]"
              style={{
                background: "hsl(var(--secondary))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <motion.div
                className="absolute top-1 bottom-1 rounded-full z-0 w-[56px]"
                animate={{ left: activeMode === "movies" ? 4 : 60 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  background: activeMode === "movies"
                    ? "linear-gradient(135deg, #FFD700cc, #00E5FF44)"
                    : "linear-gradient(135deg, #A855F7, #7C3AED)",
                  boxShadow: activeMode === "movies"
                    ? "0 0 10px #FFD70055"
                    : "0 0 10px #A855F755",
                }}
              />
              <span
                className="relative z-10 flex-1 text-center font-heading text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: activeMode === "movies" ? "#000" : "hsl(var(--muted-foreground))" }}
              >
                Films
              </span>
              <span
                className="relative z-10 flex-1 text-center font-heading text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: activeMode === "series" ? "#fff" : "hsl(var(--muted-foreground))" }}
              >
                Series
              </span>
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 min-h-[48px] md:min-h-0 transition-all hover:border-primary/50"
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
                      onClick={() => { navigate("/profile"); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full rounded-md px-3 py-2 font-body text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <UserCircle className="h-3.5 w-3.5" />
                      Profile
                    </button>
                    <button
                      onClick={() => { navigate("/settings"); setShowMenu(false); }}
                      className="flex items-center gap-2 w-full rounded-md px-3 py-2 font-body text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Settings
                    </button>
                    <div className="h-px bg-border/50 my-1" />
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
                className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 min-h-[48px] md:min-h-0 transition-all hover:border-primary/50 hover:text-primary"
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
