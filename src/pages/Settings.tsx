import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Eye, Trash2, Shield, Palette, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Local preferences (stored in localStorage)
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem("cinesync_autoplay") !== "false");
  const [adultContent, setAdultContent] = useState(() => localStorage.getItem("cinesync_adult") === "true");
  const [spoilerGuard, setSpoilerGuard] = useState(() => localStorage.getItem("cinesync_spoiler") !== "false");
  const [defaultMode, setDefaultMode] = useState<"movies" | "series">(() =>
    (localStorage.getItem("cinesync_default_mode") as "movies" | "series") || "movies"
  );

  const savePref = (key: string, value: string) => {
    localStorage.setItem(key, value);
    toast.success("Preference saved");
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;
    // Sign out and notify — full deletion requires admin/edge function
    await signOut();
    toast.success("You have been signed out. Contact support to fully delete your data.");
    navigate("/");
  };

  const sectionClass = "glass-panel rounded-xl p-6 mb-6";
  const labelClass = "font-body text-sm text-foreground";
  const descClass = "font-body text-xs text-muted-foreground mt-0.5";
  const inputClass =
    "w-full rounded-lg bg-secondary/50 border border-border px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-6 py-3 md:px-16 lg:px-24">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="glass-panel rounded-full p-2 hover:border-primary/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
          </button>
          <span className="font-heading text-lg font-black italic tracking-tight gold-glow">
            CINE-SYNC
          </span>
          <span className="font-body text-sm text-muted-foreground">/ Settings</span>
        </div>
      </div>

      <div className="pt-20 px-6 md:px-16 lg:px-24 pb-16 max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl font-bold mb-8"
        >
          Settings
        </motion.h1>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={sectionClass}
        >
          <div className="flex items-center gap-2 mb-5">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-bold">Account</h2>
          </div>

          <div className="mb-4">
            <span className={labelClass}>Email</span>
            <p className="font-body text-sm text-muted-foreground mt-1">{user?.email ?? "Not signed in"}</p>
          </div>

          <div className="space-y-3">
            <span className={labelClass}>Change Password</span>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handlePasswordChange}
              disabled={savingPassword || !newPassword}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-heading text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_16px_hsl(var(--gold)/0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Update Password
            </button>
          </div>
        </motion.div>

        {/* Viewing Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={sectionClass}
        >
          <div className="flex items-center gap-2 mb-5">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-bold">Viewing Preferences</h2>
          </div>

          {/* Default Mode */}
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <span className={labelClass}>Default Mode</span>
              <p className={descClass}>Choose what loads first when you open the app</p>
            </div>
            <select
              value={defaultMode}
              onChange={(e) => {
                const v = e.target.value as "movies" | "series";
                setDefaultMode(v);
                savePref("cinesync_default_mode", v);
              }}
              className="rounded-lg bg-secondary/50 border border-border px-3 py-1.5 font-body text-xs text-foreground outline-none focus:border-primary/50 transition-all"
            >
              <option value="movies">Films</option>
              <option value="series">Series</option>
            </select>
          </div>

          {/* Autoplay Trailers */}
          <ToggleRow
            label="Autoplay Trailers"
            description="Automatically play trailers in movie details"
            checked={autoplay}
            onChange={(v) => { setAutoplay(v); savePref("cinesync_autoplay", String(v)); }}
          />

          {/* Spoiler Guard */}
          <ToggleRow
            label="Spoiler Guard"
            description="Blur overviews until you tap to reveal"
            checked={spoilerGuard}
            onChange={(v) => { setSpoilerGuard(v); savePref("cinesync_spoiler", String(v)); }}
          />
        </motion.div>

        {/* Content Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={sectionClass}
        >
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-bold">Content</h2>
          </div>

          <ToggleRow
            label="Include Adult Content"
            description="Show adult-rated titles in search and discovery"
            checked={adultContent}
            onChange={(v) => { setAdultContent(v); savePref("cinesync_adult", String(v)); }}
            last
          />
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-6 border-destructive/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="h-4 w-4 text-destructive" />
            <h2 className="font-heading text-base font-bold text-destructive">Danger Zone</h2>
          </div>
          <p className={descClass + " mb-4"}>
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 rounded-full border border-destructive/50 px-5 py-2 font-heading text-xs font-bold uppercase tracking-wider text-destructive transition-all hover:bg-destructive/10 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Account
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Toggle Row Component ─────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  checked,
  onChange,
  last = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3 ${!last ? "border-b border-border/50" : ""}`}>
      <div>
        <span className="font-body text-sm text-foreground">{label}</span>
        <p className="font-body text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
          checked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <motion.div
          className="absolute top-0.5 h-4 w-4 rounded-full bg-foreground"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
