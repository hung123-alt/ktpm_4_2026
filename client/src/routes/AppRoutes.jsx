import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../shared/layout/AdminLayout";

// ============================================================
// AppRoutes — khai báo TẤT CẢ đường dẫn của app.
// ============================================================

// --- Trang công khai (không cần đăng nhập) ---
const HomePage = lazy(() => import("../features/movies/pages/HomePage"));
const MovieDetailPage = lazy(
  () => import("../features/movies/pages/MovieDetailPage"),
);
const FilterPage = lazy(() => import("../features/movies/pages/FilterPage"));
const WatchPage = lazy(() => import("../features/movies/pages/WatchPage"));
const RandomPage = lazy(() => import("../features/movies/pages/RandomPage"));
const SearchPage = lazy(() => import("../features/movies/pages/SearchPage"));
const UserManagePage = lazy(() => import("../features/admin/pages/UserManagePage"));
const ReportManagePage = lazy(() => import("../features/admin/pages/ReportManagePage"));
const CommentManagePage = lazy(() => import("../features/admin/pages/CommentManagePage"));
const GenreManagePage = lazy(() => import("../features/admin/pages/GenreManagePage"));
const CountryManagePage = lazy(() => import("../features/admin/pages/CountryManagePage"));
const ProfilePage = lazy(() => import("../features/auth/pages/ProfilePage"));

const NotFoundPage = lazy(
  () => import("../features/movies/pages/NotFoundPage.jsx"),
);
const FavoritesPage = lazy(
  () => import("../features/interactions/pages/FavoritesPage"),
);
// --- Trang xác thực ---
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));

const MovieManagePage = lazy(() => import("../features/admin/pages/MovieManagePage"));
const WatchlistPage = lazy(
  () => import("../features/interactions/pages/WatchlistPage"),
);
const HistoryPage = lazy(
  () => import("../features/interactions/pages/HistoryPage"),
);

// --- Trang admin ---
const DashboardPage = lazy(
  () => import("../features/admin/pages/DashboardPage"),
);
// const MovieManagePage = lazy(() => import('../features/admin/pages/MovieManagePage'));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>
      }
    >
      <Routes>
        {/* ===== Công khai ===== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/phim/:slug" element={<MovieDetailPage />} />
        <Route path="/loc" element={<FilterPage />} />
        <Route path="/xem/:slug" element={<WatchPage />} />
        <Route path="/random" element={<RandomPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route
          path="/yeu-thich"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
  <ProtectedRoute><ProfilePage /></ProtectedRoute>
} />
        {/* ===== Xác thực ===== */}
        {<Route path="/login" element={<LoginPage />} />}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
        <Route path="/reset-password" element={<ResetPasswordPage />} /> 

        <Route
          path="/xem-sau"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lich-su"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* ===== Admin ===== */}
       <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="phim" element={<MovieManagePage />} />
          <Route path="users" element={<UserManagePage />} /> 
          <Route path="reports" element={<ReportManagePage />} />
          <Route path="comments" element={<CommentManagePage />} />
          <Route path="genres" element={<GenreManagePage />} />
          <Route path="countries" element={<CountryManagePage />} />
        </Route>

        {/* ===== 404 — không khớp route nào ở trên ===== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
