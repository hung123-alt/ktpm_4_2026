import { Link } from "react-router-dom";
import { MOVIE_TYPE } from "../../config/constants";

// ============================================================
// Footer — chân trang dùng chung mọi trang.
// Tách từ HomePage.
// ============================================================

export default function Footer() {
  return (
    <footer className="pp-footer">
      <div className="pp-footer-inner">
        <div className="pp-footer-col pp-footer-brand">
          <Link to="/" className="pp-logo">
            <span className="pp-logo-icon">
              <i className="bi bi-play-fill" />
            </span>
            <span className="pp-logo-text">
              PHIM<span>PLAY24</span>
            </span>
          </Link>
          <p className="pp-footer-desc">
            Kho phim trực tuyến chất lượng cao — Dự án Nhóm 4.
          </p>
          <div className="pp-socials">
            <a href="#" aria-label="Facebook">
              <i className="bi bi-facebook" />
            </a>
            <a href="#" aria-label="YouTube">
              <i className="bi bi-youtube" />
            </a>
            <a href="#" aria-label="Github">
              <i className="bi bi-github" />
            </a>
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
        © {new Date().getFullYear()} PHIMPLAY24 — Dự án học tập Nhóm 4. Chỉ dùng
        cho mục đích học tập.
      </div>
    </footer>
  );
}
