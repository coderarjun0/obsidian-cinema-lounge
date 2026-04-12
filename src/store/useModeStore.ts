import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MediaMode = "movies" | "series";

interface ModeStore {
  activeMode: MediaMode;
  setMode: (mode: MediaMode) => void;
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      activeMode: "movies",
      setMode: (mode) => set({ activeMode: mode }),
    }),
    { name: "cinesync-mode" }
  )
);
