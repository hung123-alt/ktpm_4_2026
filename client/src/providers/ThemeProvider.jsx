import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

// ============================================================
// ThemeProvider — quản lý Sáng/Tối TOÀN CỤC.
// Lưu vào localStorage, thêm class "dark"/"light" vào <html>.
// Mọi trang dùng useTheme() → { theme, toggleTheme }
// KHÔNG bao giờ dùng useState isLightMode trong từng page nữa.
// ============================================================

function getStoredTheme() {
  return localStorage.getItem("theme") || "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
