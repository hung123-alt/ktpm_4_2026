import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

// ============================================================
// useTheme — hook đọc theme toàn cục.
// Dùng: const { theme, toggleTheme } = useTheme();
// ============================================================

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme phải dùng bên trong <ThemeProvider>");
  }
  return context;
}
