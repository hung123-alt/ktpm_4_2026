import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import { MOVIE_TYPE } from "../../config/constants";
import {
  useGenres,
  useCountries,
} from "../../features/admin/hooks/useAdminMeta";

// ============================================================
// Header — thanh điều hướng dùng chung mọi trang.
// Tách từ HomePage, thêm ThemeToggle.
// Cần STYLES pp-* (được load qua MainLayout).
// ============================================================

// GENRES and COUNTRIES are fetched inside the component via hooks

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");

  // ✅ LẤY DỮ LIỆU TỪ BACKEND
  const { data: genresData } = useGenres();
  const { data: countriesData } = useCountries();
  const GENRES = genresData || [];
  const COUNTRIES = countriesData || [];
  // ---------------------------

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) navigate(`/tim-kiem?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`pp-header ${scrolled ? "scrolled" : ""}`}>
      <div className="pp-header-inner">
        {/* Logo */}
        <Link to="/" className="pp-logo">
          <span className="pp-logo-icon">
            <i className="bi bi-play-fill" />
          </span>
          <span className="pp-logo-text">
            PHIM<span>PLAY24</span>
          </span>
        </Link>

        {/* Search */}
        <form className="pp-search" onSubmit={onSearch}>
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Tìm kiếm phim, diễn viên"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* Nav */}
        <nav className="pp-nav">
          <div className="pp-nav-item pp-has-menu">
            <span className="pp-nav-link">
              Thể loại <i className="bi bi-caret-down-fill" />
            </span>
            <div className="pp-menu pp-menu-genres">
              {GENRES.map((g) => (
                <Link
                  key={g.slug}
                  to={`/loc?the-loai=${g.slug}`}
                  className="pp-menu-link"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to={`/loc?loai=${MOVIE_TYPE.PHIM_LE}`} className="pp-nav-link">
            Phim Lẻ
          </Link>
          <Link to={`/loc?loai=${MOVIE_TYPE.PHIM_BO}`} className="pp-nav-link">
            Phim Bộ
          </Link>

          <div className="pp-nav-item pp-has-menu">
            <span className="pp-nav-link">
              Quốc gia <i className="bi bi-caret-down-fill" />
            </span>
            <div className="pp-menu pp-menu-countries">
              {COUNTRIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/loc?quoc-gia=${c.slug}`}
                  className="pp-menu-link"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/random" className="pp-nav-link pp-nav-random">
            <i className="bi bi-shuffle" /> Random
          </Link>
        </nav>

        {/* Right area: ThemeToggle + User */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="!px-2.5 !py-1.5 !text-[11px]" />

          {isAuthenticated ? (
            <div className="pp-nav-item pp-has-menu pp-user">
              <span className="pp-user-pill">
                <span className="pp-avatar">
                  {(user?.username || "U").charAt(0).toUpperCase()}
                </span>
                {user?.username || "Thành viên"}
                <i className="bi bi-caret-down-fill" />
              </span>
              <div className="pp-menu pp-menu-user">
                <Link to="/yeu-thich" className="pp-menu-link">
                  <i className="bi bi-heart" /> Yêu thích
                </Link>
                <Link to="/xem-sau" className="pp-menu-link">
                  <i className="bi bi-bookmark-plus" /> Xem sau
                </Link>
                <Link to="/lich-su" className="pp-menu-link">
                  <i className="bi bi-clock-history" /> Lịch sử xem
                </Link>
                <Link to="/profile" className="pp-menu-link"><i className="bi bi-person-gear"></i> Hồ sơ cá nhân</Link>
                <button className="pp-menu-link pp-logout" onClick={logout}>
                  <i className="bi bi-box-arrow-right" /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="pp-btn-member">
              <i className="bi bi-person-circle" /> Thành viên
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
