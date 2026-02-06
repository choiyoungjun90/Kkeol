import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "base" | "pain";

interface ThemeState {
  mode: "base" | "pain";
  toggleMode: () => void;
  setMode: (mode: "base" | "pain") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "pain", // 기본값을 "pain"으로 변경
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "base" ? "pain" : "base" })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-storage",
    },
  ),
);
