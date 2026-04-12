import { useState, useCallback, useEffect } from "react";
import type { Movie } from "@/lib/mockData";

const VAULT_KEY = "cinesync-vault";

export function useVault() {
  const [vault, setVault] = useState<Movie[]>(() => {
    try {
      const stored = localStorage.getItem(VAULT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  }, [vault]);

  const addToVault = useCallback((movie: Movie) => {
    setVault((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromVault = useCallback((movieId: number) => {
    setVault((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isInVault = useCallback(
    (movieId: number) => vault.some((m) => m.id === movieId),
    [vault]
  );

  return { vault, addToVault, removeFromVault, isInVault };
}
