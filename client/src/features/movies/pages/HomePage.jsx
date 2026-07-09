import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { useAuth } from '../../../providers/useAuth';
import {
  MOVIE_TYPE,
  MOVIE_TYPE_LABEL,
  MOVIE_STATUS_LABEL,
} from '../../../config/constants';

// ============================================================
// HomePage — Trang chủ PHIMPLAY24 (phong cách RoPhim / Onflix)
// Cấu trúc: Header (search + thể loại + quốc gia + random) → Hero banner
//           → nhiều dải phim cuộn ngang → Footer.
// Dữ liệu lấy qua hook useMovies() (đúng luồng page → hook → api).
// ============================================================

// --- Danh sách thể loại (khớp seed genres Backend) — dùng cho dropdown "Thể loại" ---
const GENRES = [
  { name: 'Hành Động', slug: 'hanh-dong' }, { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' }, { name: 'Cổ Trang', slug: 'co-trang' },
  { name: 'Tâm Lý', slug: 'tam-ly' }, { name: 'Hình Sự', slug: 'hinh-su' },
  { name: 'Chiến Tranh', slug: 'chien-tranh' }, { name: 'Thể Thao', slug: 'the-thao' },
  { name: 'Võ Thuật', slug: 'vo-thuat' }, { name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { name: 'Phiêu Lưu', slug: 'phieu-luu' }, { name: 'Khoa Học', slug: 'khoa-hoc' },
  { name: 'Kinh Dị', slug: 'kinh-di' }, { name: 'Âm Nhạc', slug: 'am-nhac' },
  { name: 'Thần Thoại', slug: 'than-thoai' }, { name: 'Chính Kịch', slug: 'chinh-kich' },
  { name: 'Học Đường', slug: 'hoc-duong' }, { name: 'Gia Đình', slug: 'gia-dinh' },
  { name: 'Bí Ẩn', slug: 'bi-an' }, { name: 'Tài Liệu', slug: 'tai-lieu' },
  { name: 'Gây Cấn', slug: 'gay-can' }, { name: 'Lịch Sử', slug: 'lich-su' },
  { name: 'Hoạt Hình', slug: 'hoat-hinh' }, { name: 'Kiếm Hiệp', slug: 'kiem-hiep' },
  { name: 'Khoa Huyễn', slug: 'khoa-huyen' }, { name: 'Chính Trị', slug: 'chinh-tri' },
  { name: 'Kinh Điển', slug: 'kinh-dien' }, { name: 'Đời Thường', slug: 'doi-thuong' },
  { name: 'Tội Phạm', slug: 'toi-pham' }, { name: 'Siêu Anh Hùng', slug: 'sieu-anh-hung' },
];

// --- Danh sách quốc gia (khớp seed countries Backend) — dùng cho dropdown "Quốc gia" ---
const COUNTRIES = [
  { name: 'Việt Nam', slug: 'viet-nam' }, { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Trung Quốc', slug: 'trung-quoc' }, { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Thái Lan', slug: 'thai-lan' }, { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Đài Loan', slug: 'dai-loan' }, { name: 'Hồng Kông', slug: 'hong-kong' },
  { name: 'Ấn Độ', slug: 'an-do' }, { name: 'Anh', slug: 'anh' },
];

// Ảnh thay thế khi phim chưa có poster/banner
const FALLBACK_POSTER =
  'https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24';
const posterOf = (m) => m?.posterUrl || FALLBACK_POSTER;
const backdropOf = (m) => m?.bannerUrl || m?.posterUrl || FALLBACK_POSTER;

// Dòng mô tả ngắn cho tập/loại phim (hiển thị ở hero + card)
function episodeLabel(m) {
  if (m.type === MOVIE_TYPE.PHIM_LE) return 'Phim lẻ';
  if (m.totalEpisodes > 0) return `Tập ${m.totalEpisodes}`;
  return MOVIE_TYPE_LABEL[m.type] || 'Đang cập nhật';
}

// ============================================================
// MovieCard — 1 thẻ poster (badge IMDb + VIP + loại phim)
// ============================================================
function MovieCard({ movie }) {
  return (
    <Link to={`/phim/${movie.slug}`} className="pp-card">
      <div className="pp-card-thumb">
        <img
          src={posterOf(movie)}
          alt={movie.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK_POSTER)}
        />
        {/* Badge điểm IMDb (chỉ hiện khi có điểm) */}
        {movie.avgRating > 0 && (
          <span className="pp-badge-imdb">IMDb {Number(movie.avgRating).toFixed(1)}</span>
        )}
        {/* Badge VIP cho phim nổi bật */}
        {movie.isFeatured && <span className="pp-badge-vip">VIP</span>}
        {/* Badge loại/tập ở đáy */}
        <span className="pp-badge-type">{episodeLabel(movie)}</span>
        <div className="pp-card-overlay">
          <i className="bi bi-play-circle-fill" />
        </div>
      </div>
      <div className="pp-card-title">{movie.title}</div>
      <div className="pp-card-sub">
        {MOVIE_TYPE_LABEL[movie.type]}
        {movie.releaseYear ? ` • ${movie.releaseYear}` : ''}
      </div>
    </Link>
  );
}

// ============================================================
// MovieRow — 1 dải phim cuộn ngang, có nút ‹ › và "Xem tất cả"
// ============================================================
function MovieRow({ title, icon, movies, to = '/loc' }) {
  const scrollerRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="pp-row">
      <div className="pp-row-head">
        <h3 className="pp-row-title">
          {icon && <i className={`bi ${icon}`} />} {title}
        </h3>
        <Link to={to} className="pp-row-more">
          Xem tất cả <i className="bi bi-chevron-right" />
        </Link>
      </div>

      <div className="pp-row-wrap">
        <button className="pp-row-arrow pp-left" onClick={() => scrollBy(-1)} aria-label="Trước">
          <i className="bi bi-chevron-left" />
        </button>
        <div className="pp-row-scroller" ref={scrollerRef}>
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
        <button className="pp-row-arrow pp-right" onClick={() => scrollBy(1)} aria-label="Sau">
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </section>
  );
}

// ============================================================
// Hero — banner lớn, tự chuyển slide, có chấm điều hướng
// ============================================================
function Hero({ movies }) {
  const [index, setIndex] = useState(0);
  const slides = movies.slice(0, 8);

  // Tự chuyển slide mỗi 6 giây
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const movie = slides[index];

  return (
    <div className="pp-hero">
      {/* Ảnh nền đổi theo slide hiện tại */}
      <div
        key={movie.id}
        className="pp-hero-bg"
        style={{ backgroundImage: `url(${backdropOf(movie)})` }}
      />
      <div className="pp-hero-shade" />

      <div className="pp-hero-inner">
        <h1 className="pp-hero-title">{movie.title}</h1>

        <div className="pp-hero-meta">
          {movie.isFeatured && <span className="pp-top10">TOP 10</span>}
          {movie.releaseYear && <span>{movie.releaseYear}</span>}
          <span className="pp-dot-sep">•</span>
          <span>{MOVIE_TYPE_LABEL[movie.type]}</span>
          <span className="pp-dot-sep">•</span>
          <span>{episodeLabel(movie)}</span>
        </div>

        <div className="pp-hero-chips">
          <span className="pp-chip">{MOVIE_TYPE_LABEL[movie.type]}</span>
          <span className="pp-chip">{MOVIE_STATUS_LABEL[movie.status]}</span>
        </div>

        {movie.description && (
          <p className="pp-hero-desc">{movie.description}</p>
        )}

        <div className="pp-hero-actions">
          <Link to={`/phim/${movie.slug}`} className="pp-btn-play">
            <i className="bi bi-play-fill" /> Xem Ngay
          </Link>
          <button className="pp-btn-mute" aria-label="Tắt tiếng">
            <i className="bi bi-volume-mute" />
          </button>
        </div>
      </div>

      {/* Chấm điều hướng */}
      <div className="pp-hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`pp-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Header — thanh điều hướng (đọc trạng thái đăng nhập qua useAuth)
// ============================================================
function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState('');

  // Header trong suốt khi ở đỉnh trang, đặc lại khi cuộn xuống
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) navigate(`/tim-kiem?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`pp-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="pp-header-inner">
        {/* Logo */}
        <Link to="/" className="pp-logo">
          <span className="pp-logo-icon"><i className="bi bi-play-fill" /></span>
          <span className="pp-logo-text">
            PHIM<span>PLAY24</span>
          </span>
        </Link>

        {/* Ô tìm kiếm */}
        <form className="pp-search" onSubmit={onSearch}>
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Tìm kiếm phim, diễn viên"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* Menu chính */}
        <nav className="pp-nav">
          {/* Thể loại — mega menu */}
          <div className="pp-nav-item pp-has-menu">
            <span className="pp-nav-link">
              Thể loại <i className="bi bi-caret-down-fill" />
            </span>
            <div className="pp-menu pp-menu-genres">
              {GENRES.map((g) => (
                <Link key={g.slug} to={`/loc?the-loai=${g.slug}`} className="pp-menu-link">
                  {g.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to={`/loc?loai=${MOVIE_TYPE.PHIM_LE}`} className="pp-nav-link">Phim Lẻ</Link>
          <Link to={`/loc?loai=${MOVIE_TYPE.PHIM_BO}`} className="pp-nav-link">Phim Bộ</Link>

          {/* Quốc gia — dropdown */}
          <div className="pp-nav-item pp-has-menu">
            <span className="pp-nav-link">
              Quốc gia <i className="bi bi-caret-down-fill" />
            </span>
            <div className="pp-menu pp-menu-countries">
              {COUNTRIES.map((c) => (
                <Link key={c.slug} to={`/loc?quoc-gia=${c.slug}`} className="pp-menu-link">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Random — có icon xúc xắc/đổi ngẫu nhiên */}
          <Link to="/random" className="pp-nav-link pp-nav-random">
            <i className="bi bi-shuffle" /> Random
          </Link>
        </nav>

        {/* Khu vực thành viên */}
        {isAuthenticated ? (
          <div className="pp-nav-item pp-has-menu pp-user">
            <span className="pp-user-pill">
              <span className="pp-avatar">
                {(user?.username || 'U').charAt(0).toUpperCase()}
              </span>
              {user?.username || 'Thành viên'}
              <i className="bi bi-caret-down-fill" />
            </span>
            <div className="pp-menu pp-menu-user">
              <Link to="/yeu-thich" className="pp-menu-link"><i className="bi bi-heart" /> Yêu thích</Link>
              <Link to="/xem-sau" className="pp-menu-link"><i className="bi bi-bookmark-plus" /> Xem sau</Link>
              <Link to="/lich-su" className="pp-menu-link"><i className="bi bi-clock-history" /> Lịch sử xem</Link>
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
    </header>
  );
}

// ============================================================
// Footer — chân trang
// ============================================================
function Footer() {
  return (
    <footer className="pp-footer">
      <div className="pp-footer-inner">
        <div className="pp-footer-col pp-footer-brand">
          <Link to="/" className="pp-logo">
            <span className="pp-logo-icon"><i className="bi bi-play-fill" /></span>
            <span className="pp-logo-text">PHIM<span>PLAY24</span></span>
          </Link>
          <p className="pp-footer-desc">Kho phim trực tuyến chất lượng cao — Dự án Nhóm 4.</p>
          <div className="pp-socials">
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
            <a href="#" aria-label="YouTube"><i className="bi bi-youtube" /></a>
            <a href="#" aria-label="Github"><i className="bi bi-github" /></a>
          </div>
        </div>

        <div className="pp-footer-col">
          <h4>Sản phẩm & Dịch vụ</h4>
          <a href="#">Giới thiệu</a>
          <a href="#">Trung tâm hỗ trợ</a>
          <a href="#">Điều khoản sử dụng</a>
        </div>

        <div className="pp-footer-col">
          <h4>Khám phá</h4>
          <Link to={`/loc?loai=${MOVIE_TYPE.PHIM_LE}`}>Phim lẻ</Link>
          <Link to={`/loc?loai=${MOVIE_TYPE.PHIM_BO}`}>Phim bộ</Link>
          <Link to="/random">Random phim</Link>
        </div>

        <div className="pp-footer-col">
          <h4>Liên hệ</h4>
          <a href="#">Hotline: 1900 6600</a>
          <a href="#">Email: support@phimplay24.vn</a>
          <p className="pp-footer-desc">Hà Nội, Việt Nam</p>
        </div>
      </div>
      <div className="pp-footer-bottom">
        © {new Date().getFullYear()} PHIMPLAY24 — Dự án học tập Nhóm 4. Chỉ dùng cho mục đích học tập.
      </div>
    </footer>
  );
}

// ============================================================
// HomePage — lắp ráp tất cả
// ============================================================
export default function HomePage() {
  const { data, isLoading, isError, error } = useMovies();
  const movies = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Chia phim thành các dải theo tiêu chí (client-side, từ cùng 1 danh sách)
  const rows = useMemo(() => {
    const byView = [...movies].sort((a, b) => b.viewCount - a.viewCount);
    const byRating = [...movies].sort((a, b) => b.avgRating - a.avgRating);
    const featured = movies.filter((m) => m.isFeatured);
    const phimBo = movies.filter((m) => m.type === MOVIE_TYPE.PHIM_BO);
    const phimLe = movies.filter((m) => m.type === MOVIE_TYPE.PHIM_LE);
    const anime = movies.filter(
      (m) => m.type === MOVIE_TYPE.ANIME || m.type === MOVIE_TYPE.HOAT_HINH,
    );
    return { byView, byRating, featured, phimBo, phimLe, anime };
  }, [movies]);

  // Phim cho hero: ưu tiên phim nổi bật, không có thì lấy phim điểm cao
  const heroMovies = rows.featured.length > 0 ? rows.featured : rows.byRating;

  return (
    <div className="pp-app">
      <style>{STYLES}</style>
      <Header />

      {/* Trạng thái tải / lỗi */}
      {isLoading && (
        <div className="pp-state">
          <div className="pp-spinner" />
          <p>Đang tải phim...</p>
        </div>
      )}
      {isError && (
        <div className="pp-state pp-error">
          <i className="bi bi-exclamation-triangle-fill" />
          <p>Lỗi tải dữ liệu: {error?.message || 'Không kết nối được máy chủ'}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Hero movies={heroMovies} />

          <main className="pp-main">
            <MovieRow title="Đề Xuất Cho Bạn" icon="bi-fire" movies={rows.byRating} />
            <MovieRow title="Phim Xem Nhiều" icon="bi-graph-up-arrow" movies={rows.byView} />
            <MovieRow title="Phim Bộ Mới" icon="bi-collection-play" movies={rows.phimBo} to={`/loc?loai=${MOVIE_TYPE.PHIM_BO}`} />
            <MovieRow title="Phim Lẻ Chọn Lọc" icon="bi-film" movies={rows.phimLe} to={`/loc?loai=${MOVIE_TYPE.PHIM_LE}`} />
            <MovieRow title="Hoạt Hình & Anime" icon="bi-stars" movies={rows.anime} />

            {movies.length === 0 && (
              <div className="pp-state">
                <i className="bi bi-inbox" style={{ fontSize: 48 }} />
                <p>Chưa có phim nào trong cơ sở dữ liệu</p>
              </div>
            )}
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}

// ============================================================
// STYLES — CSS gói riêng cho trang chủ (tránh đụng CSS chung).
// Override luôn #root (rác từ template Vite bóp trang vào 1126px).
// ============================================================
const STYLES = `
  #root { width: 100% !important; max-width: 100% !important; margin: 0 !important;
          text-align: left !important; border: none !important; }
  body { margin: 0; background: #0b0b0f; }

  .pp-app {
    background: #0b0b0f;
    color: #e5e7eb;
    min-height: 100vh;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  .pp-app a { text-decoration: none; color: inherit; }

  /* ---------- HEADER ---------- */
  .pp-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    transition: background .3s ease, box-shadow .3s ease;
    background: linear-gradient(180deg, rgba(0,0,0,.75), rgba(0,0,0,0));
  }
  .pp-header.scrolled {
    background: rgba(11,11,15,.96);
    box-shadow: 0 4px 20px rgba(0,0,0,.5);
    backdrop-filter: blur(8px);
  }
  .pp-header-inner {
    display: flex; align-items: center; gap: 24px;
    padding: 14px 40px; max-width: 1600px; margin: 0 auto;
  }
  .pp-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .pp-logo-icon {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    display: grid; place-items: center; color: #111; font-size: 22px;
    box-shadow: 0 4px 12px rgba(245,158,11,.4);
  }
  .pp-logo-text { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: .5px; }
  .pp-logo-text span { color: #f59e0b; }

  .pp-search {
    flex: 1; max-width: 460px; display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12);
    border-radius: 24px; padding: 10px 18px; transition: background .2s;
  }
  .pp-search:focus-within { background: rgba(255,255,255,.16); }
  .pp-search i { color: #9ca3af; font-size: 18px; }
  .pp-search input {
    flex: 1; background: none; border: none; outline: none;
    color: #fff; font-size: 15px;
  }
  .pp-search input::placeholder { color: #9ca3af; }

  .pp-nav { display: flex; align-items: center; gap: 6px; margin-left: auto; }
  .pp-nav-link {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 8px; color: #e5e7eb;
    font-size: 15px; font-weight: 500; cursor: pointer; white-space: nowrap;
    transition: color .2s, background .2s;
  }
  .pp-nav-link:hover { color: #f59e0b; }
  .pp-nav-link i.bi-caret-down-fill { font-size: 10px; opacity: .7; }
  .pp-nav-random { color: #22c55e; }
  .pp-nav-random:hover { color: #4ade80; }

  /* Dropdown / mega menu */
  .pp-nav-item { position: relative; }
  .pp-menu {
    position: absolute; top: 100%; left: 0; margin-top: 6px;
    background: #16171d; border: 1px solid #2a2b33; border-radius: 12px;
    padding: 14px; box-shadow: 0 20px 50px rgba(0,0,0,.6);
    opacity: 0; visibility: hidden; transform: translateY(8px);
    transition: all .2s ease; z-index: 1100;
  }
  .pp-has-menu:hover .pp-menu { opacity: 1; visibility: visible; transform: translateY(0); }
  .pp-menu-genres {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px 8px;
    width: 520px;
  }
  .pp-menu-countries { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 8px; width: 260px; }
  .pp-menu-user { right: 0; left: auto; min-width: 200px; display: flex; flex-direction: column; }
  .pp-menu-link {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 8px; color: #cbd5e1;
    font-size: 14px; white-space: nowrap;
    background: none; border: none; text-align: left; cursor: pointer; width: 100%;
    transition: background .15s, color .15s;
  }
  .pp-menu-link:hover { background: rgba(245,158,11,.15); color: #f59e0b; }
  .pp-logout:hover { background: rgba(239,68,68,.15); color: #f87171; }

  .pp-btn-member {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px; border-radius: 24px; font-weight: 600; font-size: 15px;
    color: #fff; background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.18); white-space: nowrap;
    transition: background .2s;
  }
  .pp-btn-member:hover { background: rgba(255,255,255,.22); }
  .pp-user-pill {
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    padding: 6px 14px; border-radius: 24px; background: rgba(255,255,255,.12);
    color: #fff; font-weight: 600; font-size: 15px;
  }
  .pp-avatar {
    width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
    background: linear-gradient(135deg,#f59e0b,#f97316); color: #111; font-weight: 800;
  }

  /* ---------- HERO ---------- */
  .pp-hero { position: relative; height: 88vh; min-height: 560px; overflow: hidden; }
  .pp-hero-bg {
    position: absolute; inset: 0; background-size: cover; background-position: center 20%;
    animation: ppFade .8s ease;
  }
  @keyframes ppFade { from { opacity: .3; } to { opacity: 1; } }
  .pp-hero-shade {
    position: absolute; inset: 0;
    background:
      linear-gradient(90deg, rgba(11,11,15,.95) 0%, rgba(11,11,15,.6) 45%, rgba(11,11,15,.1) 100%),
      linear-gradient(0deg, #0b0b0f 2%, rgba(11,11,15,0) 40%);
  }
  .pp-hero-inner {
    position: relative; z-index: 2; max-width: 1600px; margin: 0 auto;
    height: 100%; padding: 0 40px; display: flex; flex-direction: column;
    justify-content: center; max-width: 720px;
  }
  .pp-hero-title {
    font-size: 56px; font-weight: 900; color: #fff; margin: 0 0 18px;
    line-height: 1.05; text-shadow: 0 4px 20px rgba(0,0,0,.6);
  }
  .pp-hero-meta {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    color: #d1d5db; font-size: 15px; margin-bottom: 16px;
  }
  .pp-dot-sep { opacity: .5; }
  .pp-top10 {
    background: #22c55e; color: #05270f; font-weight: 800; font-size: 12px;
    padding: 3px 8px; border-radius: 5px; letter-spacing: .5px;
  }
  .pp-hero-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .pp-chip {
    border: 1px solid rgba(255,255,255,.25); color: #e5e7eb;
    padding: 5px 14px; border-radius: 18px; font-size: 13px;
    background: rgba(255,255,255,.06);
  }
  .pp-hero-desc {
    color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 26px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .pp-hero-actions { display: flex; align-items: center; gap: 16px; }
  .pp-btn-play {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg,#16a34a,#22c55e); color: #fff;
    font-weight: 700; font-size: 17px; padding: 13px 30px; border-radius: 30px;
    box-shadow: 0 8px 24px rgba(34,197,94,.4); transition: transform .15s, box-shadow .2s;
  }
  .pp-btn-play:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(34,197,94,.5); }
  .pp-btn-play i { font-size: 22px; }
  .pp-btn-mute {
    width: 48px; height: 48px; border-radius: 50%; cursor: pointer;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.3);
    color: #fff; font-size: 20px; transition: background .2s;
  }
  .pp-btn-mute:hover { background: rgba(255,255,255,.25); }
  .pp-hero-dots {
    position: absolute; right: 40px; bottom: 40px; z-index: 3;
    display: flex; gap: 8px;
  }
  .pp-dot {
    width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(255,255,255,.4); transition: all .3s;
  }
  .pp-dot.active { width: 26px; border-radius: 6px; background: #22c55e; }

  /* ---------- ROWS ---------- */
  .pp-main { max-width: 1600px; margin: 0 auto; padding: 10px 40px 40px; }
  .pp-row { margin-top: 38px; }
  .pp-row-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .pp-row-title { font-size: 24px; font-weight: 800; color: #fff; margin: 0; }
  .pp-row-title i { color: #f59e0b; margin-right: 6px; }
  .pp-row-more { color: #9ca3af; font-size: 14px; display: inline-flex; align-items: center; gap: 4px; }
  .pp-row-more:hover { color: #f59e0b; }

  .pp-row-wrap { position: relative; }
  .pp-row-scroller {
    display: flex; gap: 16px; overflow-x: auto; scroll-behavior: smooth;
    padding: 4px; scrollbar-width: none; -ms-overflow-style: none;
  }
  .pp-row-scroller::-webkit-scrollbar { display: none; }
  .pp-row-arrow {
    position: absolute; top: 50%; transform: translateY(-60%);
    width: 44px; height: 44px; border-radius: 50%; z-index: 5; cursor: pointer;
    background: rgba(0,0,0,.65); border: 1px solid rgba(255,255,255,.2); color: #fff;
    font-size: 20px; display: grid; place-items: center;
    opacity: 0; transition: opacity .2s, background .2s;
  }
  .pp-row-wrap:hover .pp-row-arrow { opacity: 1; }
  .pp-row-arrow:hover { background: #f59e0b; color: #111; }
  .pp-row-arrow.pp-left { left: -14px; }
  .pp-row-arrow.pp-right { right: -14px; }

  /* ---------- CARD ---------- */
  .pp-card { flex: 0 0 auto; width: 180px; }
  .pp-card-thumb {
    position: relative; width: 100%; aspect-ratio: 2/3; border-radius: 10px;
    overflow: hidden; background: #1a1a22; box-shadow: 0 6px 16px rgba(0,0,0,.4);
    transition: transform .2s, box-shadow .2s;
  }
  .pp-card:hover .pp-card-thumb { transform: translateY(-6px); box-shadow: 0 14px 30px rgba(0,0,0,.6); }
  .pp-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pp-badge-imdb {
    position: absolute; top: 8px; left: 8px; z-index: 2;
    background: #f5c518; color: #000; font-weight: 800; font-size: 11px;
    padding: 2px 6px; border-radius: 4px;
  }
  .pp-badge-vip {
    position: absolute; top: 8px; right: 8px; z-index: 2;
    background: #000; color: #f5c518; font-weight: 800; font-size: 11px;
    padding: 2px 7px; border-radius: 4px; border: 1px solid #f5c518;
  }
  .pp-badge-type {
    position: absolute; bottom: 8px; left: 8px; z-index: 2;
    background: rgba(22,163,74,.9); color: #fff; font-weight: 600; font-size: 11px;
    padding: 2px 8px; border-radius: 4px;
  }
  .pp-card-overlay {
    position: absolute; inset: 0; display: grid; place-items: center;
    background: rgba(0,0,0,.45); opacity: 0; transition: opacity .2s;
    color: #fff; font-size: 46px;
  }
  .pp-card:hover .pp-card-overlay { opacity: 1; }
  .pp-card-title {
    margin-top: 10px; color: #f3f4f6; font-size: 15px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pp-card-sub {
    color: #9ca3af; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pp-card:hover .pp-card-title { color: #f59e0b; }

  /* ---------- STATES ---------- */
  .pp-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 14px; color: #9ca3af; padding: 120px 20px; text-align: center;
  }
  .pp-state.pp-error { color: #f87171; }
  .pp-state i { font-size: 42px; }
  .pp-spinner {
    width: 46px; height: 46px; border-radius: 50%;
    border: 4px solid rgba(245,158,11,.25); border-top-color: #f59e0b;
    animation: ppSpin 1s linear infinite;
  }
  @keyframes ppSpin { to { transform: rotate(360deg); } }

  /* ---------- FOOTER ---------- */
  .pp-footer { background: #08080b; border-top: 1px solid #1f2028; margin-top: 30px; }
  .pp-footer-inner {
    max-width: 1600px; margin: 0 auto; padding: 44px 40px 24px;
    display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 30px;
  }
  .pp-footer-col h4 { color: #fff; font-size: 15px; margin: 0 0 14px; font-weight: 700; }
  .pp-footer-col a, .pp-footer-desc { display: block; color: #9ca3af; font-size: 14px; margin-bottom: 9px; }
  .pp-footer-col a:hover { color: #f59e0b; }
  .pp-footer-brand .pp-logo { margin-bottom: 14px; }
  .pp-socials { display: flex; gap: 12px; margin-top: 6px; }
  .pp-socials a {
    width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
    background: #16171d; color: #cbd5e1; font-size: 18px; transition: all .2s;
  }
  .pp-socials a:hover { background: #f59e0b; color: #111; }
  .pp-footer-bottom {
    text-align: center; color: #6b7280; font-size: 13px;
    padding: 18px 20px; border-top: 1px solid #1f2028;
  }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 1024px) {
    .pp-header-inner { flex-wrap: wrap; padding: 12px 20px; gap: 12px; }
    .pp-search { order: 3; max-width: none; flex-basis: 100%; }
    .pp-nav { gap: 2px; }
    .pp-menu-genres { grid-template-columns: repeat(2, 1fr); width: 300px; }
    .pp-hero-title { font-size: 38px; }
    .pp-main, .pp-footer-inner { padding-left: 20px; padding-right: 20px; }
    .pp-footer-inner { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .pp-nav { display: none; }
    .pp-card { width: 140px; }
    .pp-hero-title { font-size: 30px; }
    .pp-footer-inner { grid-template-columns: 1fr; }
  }
`;
