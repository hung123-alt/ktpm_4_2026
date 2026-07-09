import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import { MOVIE_TYPE } from "../../config/constants";

// ============================================================
// Header — thanh điều hướng dùng chung mọi trang.
// Tách từ HomePage, thêm ThemeToggle.
// Cần STYLES pp-* (được load qua MainLayout).
// ============================================================

const GENRES = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Tình Cảm", slug: "tinh-cam" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Cổ Trang", slug: "co-trang" },
  { name: "Tâm Lý", slug: "tam-ly" },
  { name: "Hình Sự", slug: "hinh-su" },
  { name: "Chiến Tranh", slug: "chien-tranh" },
  { name: "Thể Thao", slug: "the-thao" },
  { name: "Võ Thuật", slug: "vo-thuat" },
  { name: "Viễn Tưởng", slug: "vien-tuong" },
  { name: "Phiêu Lưu", slug: "phieu-luu" },
  { name: "Khoa Học", slug: "khoa-hoc" },
  { name: "Kinh Dị", slug: "kinh-di" },
  { name: "Âm Nhạc", slug: "am-nhac" },
  { name: "Thần Thoại", slug: "than-thoai" },
  { name: "Chính Kịch", slug: "chinh-kich" },
  { name: "Học Đường", slug: "hoc-duong" },
  { name: "Gia Đình", slug: "gia-dinh" },
  { name: "Bí Ẩn", slug: "bi-an" },
  { name: "Tài Liệu", slug: "tai-lieu" },
  { name: "Gây Cấn", slug: "gay-can" },
  { name: "Lịch Sử", slug: "lich-su" },
  { name: "Hoạt Hình", slug: "hoat-hinh" },
  { name: "Kiếm Hiệp", slug: "kiem-hiep" },
  { name: "Khoa Huyễn", slug: "khoa-huyen" },
  { name: "Chính Trị", slug: "chinh-tri" },
  { name: "Kinh Điển", slug: "kinh-dien" },
  { name: "Đời Thường", slug: "doi-thuong" },
  { name: "Tội Phạm", slug: "toi-pham" },
  { name: "Siêu Anh Hùng", slug: "sieu-anh-hung" },
];

const COUNTRIES = [
  { name: "Việt Nam", slug: "viet-nam" },
  { name: "Hàn Quốc", slug: "han-quoc" },
  { name: "Trung Quốc", slug: "trung-quoc" },
  { name: "Nhật Bản", slug: "nhat-ban" },
  { name: "Thái Lan", slug: "thai-lan" },
  { name: "Âu Mỹ", slug: "au-my" },
  { name: "Đài Loan", slug: "dai-loan" },
  { name: "Hồng Kông", slug: "hong-kong" },
  { name: "Ấn Độ", slug: "an-do" },
  { name: "Anh", slug: "anh" },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");

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
                <Link to="/xem-sau" className="pp-menu-link"><i className="bi bi-bookmark-plus" /> Xem sau</Link>
                <Link to="/lich-su" className="pp-menu-link">
                  <i className="bi bi-clock-history" /> Lịch sử xem
                </Link>
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
