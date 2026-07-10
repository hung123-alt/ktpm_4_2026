import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import MainLayout from "../../../shared/layout/MainLayout";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useEpisodes } from "../hooks/useEpisodes";
import { useAuth } from "../../../providers/useAuth";
import { useTheme } from "../../../providers/useTheme";
import { useCreateReport } from "../../reports/hooks/useReports";
import {
  useMovieComments,
  useCreateComment,
} from "../../interactions/hooks/useComments";
import { useSaveWatchHistory } from "../../interactions/hooks/useWatchHistory";

const FALLBACK = "https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24";

export default function WatchPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const currentTap = parseInt(searchParams.get("tap")) || 1;

  const { data: movie, isLoading: movieLoading } = useMovieDetail(slug);
  const { data: episodes, isLoading: epLoading } = useEpisodes(movie?.id);

  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const saveHistoryMut = useSaveWatchHistory();

  const createReportMut = useCreateReport();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("video_not_load");
  const [reportDesc, setReportDesc] = useState("");

  // === HOOKS BÌNH LUẬN ===
  const { data: comments, isLoading: cmtLoading } = useMovieComments(movie?.id);
  const createCmtMut = useCreateComment();
  const [commentText, setCommentText] = useState("");

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createCmtMut.mutate(
      { movieId: movie.id, content: commentText },
      {
        onSuccess: () => setCommentText(""),
      },
    );
  };
  // =======================

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

  useEffect(() => {
    if (isAuthenticated && movie?.id && currentEpisode?.id && embedUrl) {
      saveHistoryMut.mutate({
        movieId: movie.id,
        episodeId: currentEpisode.id,
        progressSeconds: 0,
      });
    }
  }, [
    isAuthenticated,
    movie?.id,
    currentEpisode?.id,
    embedUrl,
    saveHistoryMut,
  ]);

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
              <button
                onClick={() =>
                  isAuthenticated
                    ? setShowReportModal(true)
                    : alert("Vui lòng đăng nhập để báo lỗi")
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                🚩 Báo lỗi
              </button>
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
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: isDark ? "#fff" : "#111",
                }}
              >
                Bình luận ({comments?.length || 0})
              </h3>

              {isAuthenticated ? (
                <form
                  onSubmit={handlePostComment}
                  style={{ display: "flex", gap: 12, marginBottom: 24 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Bình luận về tập phim này..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 8,
                        background: isDark ? "#16171d" : "#f8f9fa",
                        border: `1px solid ${isDark ? "#2a2b33" : "#e5e7eb"}`,
                        color: isDark ? "#fff" : "#000",
                        resize: "vertical",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={createCmtMut.isPending}
                      style={{
                        marginTop: 8,
                        background: "#3c50e0",
                        color: "#fff",
                        border: "none",
                        padding: "8px 20px",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {createCmtMut.isPending ? "Đang gửi..." : "Gửi bình luận"}
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  style={{
                    padding: 24,
                    background: isDark ? "#16171d" : "#f8f9fa",
                    borderRadius: 12,
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  <Link
                    to="/login"
                    style={{ color: "#f59e0b", fontWeight: 600 }}
                  >
                    Đăng nhập
                  </Link>{" "}
                  để bình luận
                </div>
              )}

              {/* Danh sách bình luận */}
              {cmtLoading ? (
                <p>Đang tải...</p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {comments?.map((cmt) => (
                    <div key={cmt.id} style={{ display: "flex", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: `hsl(${(cmt.userId * 67) % 360}, 60%, 50%)`,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {cmt.user?.username?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "#f8f9fa",
                          padding: 12,
                          borderRadius: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              color: isDark ? "#fff" : "#111",
                              fontSize: 14,
                            }}
                          >
                            {cmt.user?.username || "Ẩn danh"}
                          </span>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            {new Date(cmt.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            color: isDark ? "#cbd5e1" : "#475569",
                            fontSize: 14,
                          }}
                        >
                          {cmt.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Báo lỗi */}
        {showReportModal && (
          <div style={modalOverlay} onClick={() => setShowReportModal(false)}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>Báo lỗi phim</h2>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                Phim: {movie.title} - Tập {currentTap}
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <option value="video_not_load">
                    Video không chạy / Đen màn hình
                  </option>
                  <option value="wrong_episode">Sai tập phim</option>
                  <option value="audio_error">Lỗi âm thanh (mất tiếng)</option>
                  <option value="subtitle_error">Lỗi phụ đề</option>
                  <option value="other">Lỗi khác</option>
                </select>

                <textarea
                  placeholder="Mô tả chi tiết lỗi (nếu có)..."
                  rows="3"
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    resize: "vertical",
                  }}
                />

                <button
                  onClick={() => {
                    createReportMut.mutate(
                      {
                        movieId: movie.id,
                        episodeId: currentEpisode?.id,
                        errorType: reportType || "other",
                        description: reportDesc || "",
                      },
                      {
                        onSuccess: () => {
                          alert("Cảm ơn bạn đã báo lỗi! Admin sẽ xử lý sớm.");
                          setShowReportModal(false);
                          setReportDesc("");
                          setReportType("video_not_load");
                        },
                        onError: () => alert("Gửi báo lỗi thất bại."),
                      },
                    );
                  }}
                  style={{
                    background: "#3c50e0",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: 8,
                  }}
                >
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// --- Modal Styles ---
const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
const modalContent = {
  background: "#fff",
  padding: 32,
  borderRadius: 12,
  width: "100%",
  maxWidth: 450,
};

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
