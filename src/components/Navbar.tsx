import { useState, useRef, useEffect } from "react";
import { Film, User, LogOut, UserCircle, Settings, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const [showSearch, setShowSearch] = useState(false);
  const { activeMode, setMode } = useModeStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-4 py-2 md:px-16 lg:px-24 md:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo + Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Film className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-heading text-sm sm:text-lg font-black italic tracking-tight gold-glow">
                CINE-SYNC
              </span>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={() => setMode(activeMode === "movies" ? "series" : "movies")}
              className="relative flex items-center rounded-full p-1 shrink-0 cursor-pointer w-[96px] h-[28px] sm:w-[120px] sm:h-[32px]"
              style={{
                background: "hsl(var(--secondary))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <motion.div
                className="absolute top-[3px] bottom-[3px] rounded-full z-0 w-[44px] sm:w-[56px]"
                animate={{ left: activeMode === "movies" ? 4 : (typeof window !== "undefined" && window.innerWidth < 640 ? 48 : 60) }}
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
                className="relative z-10 flex-1 text-center font-heading text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: activeMode === "movies" ? "#000" : "hsl(var(--muted-foreground))" }}
              >
                Films
              </span>
              <span
                className="relative z-10 flex-1 text-center font-heading text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: activeMode === "series" ? "#fff" : "hsl(var(--muted-foreground))" }}
              >
                Series
              </span>
            </button>
          </div>

          {/* Right: Search (desktop), Search toggle (mobile), Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop search */}
            <div className="hidden sm:block">
              <div className="glass-panel flex items-center gap-3 px-4 py-2 max-w-xs w-full transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_20px_hsl(var(--gold)/0.1)]">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none w-32 lg:w-48"
                />
                {searchQuery && (
                  <button onClick={() => onSearchChange("")} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden glass-panel rounded-full p-2 transition-all hover:border-primary/50"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="glass-panel flex items-center gap-1.5 rounded-full px-2 py-1.5 sm:px-3 transition-all hover:border-primary/50"
                >
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-body text-xs text-muted-foreground hidden md:inline max-w-[100px] truncate">
                    {user.email}
                  </span>
                </button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 glass-panel rounded-lg p-1 min-w-[140px]"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="glass-panel flex items-center gap-1.5 rounded-full px-2 py-1.5 sm:px-3 transition-all hover:border-primary/50 hover:text-primary"
              >
                <User className="h-3.5 w-3.5" />
                <span className="font-body text-xs font-semibold hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search bar - expandable */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="pt-2 pb-1">
                <div className="glass-panel flex items-center gap-3 px-4 py-2.5 w-full transition-all focus-within:border-primary/50">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search the stage..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button
                    onClick={() => { onSearchChange(""); setShowSearch(false); }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
