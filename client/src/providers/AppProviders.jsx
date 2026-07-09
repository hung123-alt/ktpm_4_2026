import QueryProvider from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";

// ============================================================
// AppProviders — gom tất cả provider.
// Thứ tự: QueryProvider > ThemeProvider > AuthProvider
// Theme ở ngoài Auth để cả trang login cũng có theme.
// ============================================================

export default function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
