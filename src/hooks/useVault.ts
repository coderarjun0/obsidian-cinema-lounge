import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Movie } from "@/lib/tmdb";

const VAULT_KEY = "cinesync-vault";

export function useVault() {
  const { user } = useAuth();
  const [vault, setVault] = useState<Movie[]>(() => {
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (!user) return;
    supabase
      .from("vault")
      .select("movie_data")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const movies = data.map((row: any) => row.movie_data as Movie);
          setVault(movies);
          localStorage.setItem(VAULT_KEY, JSON.stringify(movies));
        }
      });
  }, [user]);

  // Also persist to localStorage
  useEffect(() => {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  }, [vault]);

  const syncToSupabase = useCallback(async (updatedVault: Movie[]) => {
    if (!user) return;
    // Delete all then re-insert (simple sync)
    await supabase.from("vault").delete().eq("user_id", user.id);
    if (updatedVault.length > 0) {
      await supabase.from("vault").insert(
        updatedVault.map((m) => ({
          user_id: user.id,
          movie_id: m.id,
          movie_data: m as any,
        }))
      );
    }
  }, [user]);

  const addToVault = useCallback((movie: Movie) => {
    setVault((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const next = [...prev, movie];
      syncToSupabase(next);
      return next;
    });
  }, [syncToSupabase]);

  const removeFromVault = useCallback((movieId: number) => {
    setVault((prev) => {
      const next = prev.filter((m) => m.id !== movieId);
      syncToSupabase(next);
      return next;
    });
  }, [syncToSupabase]);

  const isInVault = useCallback(
    (movieId: number) => vault.some((m) => m.id === movieId),
    [vault]
  );

  return { vault, addToVault, removeFromVault, isInVault };
}
