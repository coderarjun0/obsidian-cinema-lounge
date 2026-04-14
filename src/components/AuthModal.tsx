import { useState } from "react";
import { X, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = mode === "login" ? await signIn(email, password) : await signUp(email, password);

    if (result.error) {
      setError(result.error.message);
    } else if (mode === "signup") {
      // Instead of setSuccess, we send them to the browse page
      window.location.href = "/browse";
    } else {
      onClose();
      // If the login was successful, we should also ensure they are at /browse
      window.location.href = "/browse";
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm glass-panel p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-heading text-2xl font-black italic mb-1">
          {mode === "login" ? "Welcome Back" : "Join the Stage"}
        </h2>
        <p className="font-body text-xs text-muted-foreground mb-6">
          {mode === "login" ? "Sign in to sync your Vault" : "Create an account to save your collection"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-secondary/50 border border-border px-10 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_16px_hsl(var(--gold)/0.1)] transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg bg-secondary/50 border border-border px-10 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_16px_hsl(var(--gold)/0.1)] transition-all"
            />
          </div>

          {error && <p className="font-body text-xs text-destructive">{error}</p>}
          {success && <p className="font-body text-xs text-primary">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_24px_hsl(var(--gold)/0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
            className="font-body text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
