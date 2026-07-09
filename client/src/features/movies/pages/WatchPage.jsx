import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import MainLayout from "../../../shared/layout/MainLayout";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useEpisodes } from "../hooks/useEpisodes";
import { useAuth } from "../../../providers/useAuth";
import { useTheme } from "../../../providers/useTheme";

const FALLBACK = "https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24";

export default function WatchPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const currentTap = parseInt(searchParams.get("tap")) || 1;

  const { data: movie, isLoading: movieLoading } = useMovieDetail(slug);
  const { data: episodes, isLoading: epLoading } = useEpisodes(movie?.id);

  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State quản lý các nút toggle (ON/OFF)
  const [toggles, setToggles] = useState({
    autoNext: true,
    skipIntro: false,
    cinemaMode: false,
  });

  const currentEpisode = episodes?.find(
    (ep) => ep.episodeNumber === currentTap,
  );
  const embedUrl = currentEpisode?.embedUrl;

  if (movieLoading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDark ? "#0b0b0f" : "#fff",
          }}
        >
          <div className="pp-spinner" />
        </div>
      </MainLayout>
    );
  }

  if (!movie) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: isDark ? "#fff" : "#000",
            background: isDark ? "#0b0b0f" : "#fff",
          }}
        >
          <p>Không tìm thấy phim.</p>
          <Link to="/" style={{ color: "#f59e0b", marginTop: 10 }}>
            Về trang chủ
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Cài đặt màu sắc theo theme
  const colors = {
    bg: isDark ? "#0b0b0f" : "#ffffff",
    text: isDark ? "#e5e7eb" : "#1f2937",
    headerText: isDark ? "#ffffff" : "#111111",
    subText: isDark ? "#9ca3af" : "#6b7280",
    boxBg: isDark ? "#16171d" : "#f8f9fa",
    border: isDark ? "#2a2b33" : "#e5e7eb",
  };

  return (
    <MainLayout>
      <div
        style={{
          background: colors.bg,
          color: colors.text,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "100px 20px 60px",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{ marginBottom: 16, fontSize: 14, color: colors.subText }}
          >
            <Link
              to="/"
              style={{ color: colors.subText, textDecoration: "none" }}
            >
              Trang chủ
            </Link>
            <span style={{ margin: "0 8px" }}>»</span>
            <Link
              to={`/phim/${movie.slug}`}
              style={{ color: "#f59e0b", textDecoration: "none" }}
            >
              {movie.title}
            </Link>
            <span style={{ margin: "0 8px" }}>»</span>
            <span>Tập {currentTap}</span>
          </div>

          {/* ===== 1. VIDEO PLAYER ===== */}
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              backgroundColor: "#000",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${movie.title} - Tập ${currentTap}`}
                frameBorder="0"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {epLoading
                  ? "Đang tải tập phim..."
                  : "Không tìm thấy link xem phim."}
              </div>
            )}
          </div>

          {/* ===== 2. THANH CÔNG CỤ (ACTION TOOLBAR) ===== */}
          <div
            style={{
              background: "#000",
              borderRadius: 8,
              marginTop: 16,
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* Cụm trái */}
            <div style={{ display: "flex", gap: 20 }}>
              <ToolbarButton icon="❤️" text="Yêu thích" />
              <ToolbarButton icon="➕" text="Thêm vào" />
            </div>

            {/* Cụm giữa */}
            <div style={{ display: "flex", gap: 20 }}>
              <ToggleBtn
                label="Chuyển tập"
                active={toggles.autoNext}
                onClick={() =>
                  setToggles((t) => ({ ...t, autoNext: !t.autoNext }))
                }
              />
              <ToggleBtn
                label="Bỏ qua giới thiệu"
                active={toggles.skipIntro}
                onClick={() =>
                  setToggles((t) => ({ ...t, skipIntro: !t.skipIntro }))
                }
              />
              <ToggleBtn
                label="Rạp phim"
                active={toggles.cinemaMode}
                onClick={() =>
                  setToggles((t) => ({ ...t, cinemaMode: !t.cinemaMode }))
                }
              />
            </div>

            {/* Cụm phải */}
            <div style={{ display: "flex", gap: 20 }}>
              <ToolbarButton icon="↗️" text="Chia sẻ" />
              <ToolbarButton icon="📡" text="Xem chung" />
              <ToolbarButton icon="🚩" text="Báo lỗi" />
            </div>
          </div>

          {/* ===== 3. KHỐI THÔNG TIN CHI TIẾT (GRID 4 CỘT) ===== */}
          <div
            style={{
              background: colors.boxBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              marginTop: 24,
              padding: 24,
              display: "grid",
              gridTemplateColumns: "15% 25% 40% 20%",
              gap: 24,
            }}
          >
            {/* Cột 1: Ảnh bìa */}
            <div
              style={{
                position: "relative",
                paddingTop: "150%",
                borderRadius: 8,
                overflow: "hidden",
                background: "#1a1a22",
              }}
            >
              <img
                src={movie.posterUrl || FALLBACK}
                alt={movie.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 8,
                }}
              >
                <span
                  style={{
                    color: "#ef4444",
                    fontWeight: 800,
                    fontSize: 14,
                    textShadow: "0 2px 4px #000",
                  }}
                >
                  {movie.title}
                </span>
              </div>
            </div>

            {/* Cột 2: Tiêu đề & Phân loại */}
            <div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  margin: 0,
                  color: colors.headerText,
                }}
              >
                {movie.title}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#f59e0b",
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                {movie.originName || movie.title}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <InfoTag>
                  IMDb {Number(movie.avgRating || 0).toFixed(1)}
                </InfoTag>
                <InfoTag>T16</InfoTag>
                <InfoTag>{movie.releaseYear || "2026"}</InfoTag>
                <InfoTag>1h 34m</InfoTag>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    style={{ fontSize: 14, color: colors.subText }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Cột 3: Tóm tắt nội dung */}
            <div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: colors.subText,
                  textAlign: "justify",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{
                  __html: movie.description || "Chưa có mô tả.",
                }}
              />
              <Link
                to={`/phim/${movie.slug}`}
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  color: "#f59e0b",
                  fontSize: 14,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Thông tin phim &gt;
              </Link>
            </div>

            {/* Cột 4: Hành động & Thống kê */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", gap: 30 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>⭐</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.subText,
                      marginTop: 4,
                    }}
                  >
                    Đánh giá
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>💬</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.subText,
                      marginTop: 4,
                    }}
                  >
                    Bình luận
                  </div>
                </div>
              </div>
              <button
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                ⭐ {movie.ratingCount || 0} Đánh giá
              </button>
            </div>
          </div>

          {/* ===== 4. DANH SÁCH TẬP & BÌNH LUẬN ===== */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginTop: 24,
            }}
          >
            {/* Danh sách tập (Cột trái) */}
            <div style={{ flex: "1 1 30%", minWidth: 300 }}>
              <div
                style={{
                  background: colors.boxBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: 20,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: colors.headerText,
                  }}
                >
                  Danh sách tập
                </h3>
                {epLoading ? (
                  <p>Đang tải...</p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(40px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {episodes?.map((ep) => {
                      const isActive = ep.episodeNumber === currentTap;
                      return (
                        <Link
                          key={ep.id}
                          to={`/xem/${movie.slug}?tap=${ep.episodeNumber}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 0",
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            background: isActive
                              ? "#22c55e"
                              : isDark
                                ? "#22222e"
                                : "#fff",
                            color: isActive ? "#fff" : colors.subText,
                            border: isActive
                              ? "1px solid #22c55e"
                              : `1px solid ${colors.border}`,
                          }}
                        >
                          {ep.episodeNumber}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bình luận (Cột phải) */}
            <div style={{ flex: "1 1 65%", minWidth: 300 }}>
              <div
                style={{
                  background: colors.boxBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  minHeight: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: colors.headerText,
                    textAlign: "left",
                  }}
                >
                  Bình luận (0)
                </h3>
                {!isAuthenticated ? (
                  <>
                    <p
                      style={{
                        marginBottom: 12,
                        fontSize: 14,
                        color: colors.subText,
                      }}
                    >
                      Đăng nhập để bình luận
                    </p>
                    <Link
                      to="/login"
                      style={{
                        display: "inline-block",
                        margin: "0 auto",
                        padding: "8px 20px",
                        borderRadius: 24,
                        background: "#f59e0b",
                        color: "#000",
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Đăng nhập ngay
                    </Link>
                  </>
                ) : (
                  <p style={{ fontSize: 14, color: colors.subText }}>
                    Tính năng bình luận đang được phát triển.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// --- Components phụ trợ cho Thanh công cụ ---
function ToolbarButton({ icon, text }) {
  return (
    <button
      style={{
        background: "none",
        border: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        fontSize: 14,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
    >
      <span style={{ fontSize: 16 }}>{icon}</span> {text}
    </button>
  );
}

function ToggleBtn({ label, active, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14, color: "#fff" }}>{label}</span>
      <button
        onClick={onClick}
        style={{
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 700,
          cursor: "pointer",
          background: active ? "#fff" : "transparent",
          color: active ? "#000" : "#9ca3af",
          border: active ? "1px solid #fff" : "1px solid #555",
        }}
      >
        {active ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function InfoTag({ children }) {
  return (
    <span
      style={{
        border: "1px solid #555",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 12,
        color: "#fff",
      }}
    >
      {children}
    </span>
  );
}
