import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../../shared/layout/MainLayout";
import { useMovieFilter } from "../hooks/useMovieFilter";
import { useTheme } from "../../../providers/useTheme";
import { MOVIE_TYPE } from "../../../config/constants";
import { useGenres, useCountries } from "../../admin/hooks/useAdminMeta";

// GENRES and COUNTRIES will be loaded from backend via hooks inside the component

const YEARS = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010,
];
const SORTS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Điểm IMDb", value: "imdb" },
  { label: "Lượt xem", value: "views" },
];

const FALLBACK = "https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24";

export default function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ LẤY DỮ LIỆU TỪ BACKEND
  const { data: genresData } = useGenres();
  const { data: countriesData } = useCountries();
  const GENRES = genresData || [];
  const COUNTRIES = countriesData || [];

  const genreSlug = searchParams.get("the-loai");
  const countrySlug = searchParams.get("quoc-gia");
  const typeSlug = searchParams.get("loai");
  const yearParam = searchParams.get("nam");
  const sortParam = searchParams.get("sap-xep") || "newest";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const genreId = useMemo(
    () => GENRES.find((g) => g.slug === genreSlug)?.id || null,
    [GENRES, genreSlug],
  );
  const countryId = useMemo(
    () => COUNTRIES.find((c) => c.slug === countrySlug)?.id || null,
    [COUNTRIES, countrySlug],
  );

  const filters = {
    type: typeSlug || null,
    genreIds: genreId ? [genreId] : undefined,
    countryId,
    releaseYear: yearParam ? parseInt(yearParam) : null,
    sortBy: sortParam,
    page: pageParam,
    limit: 24,
  };

  const { data, isLoading } = useMovieFilter(filters);
  const movies = data?.data || [];
  const hasMore = data?.hasMore || false;

  const [showFilter, setShowFilter] = useState(false);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const pageTitle = useMemo(() => {
    if (genreSlug)
      return `Phim ${GENRES.find((g) => g.slug === genreSlug)?.name || ""}`;
    if (countrySlug)
      return `Phim ${COUNTRIES.find((c) => c.slug === countrySlug)?.name || ""}`;
    if (typeSlug === MOVIE_TYPE.PHIM_LE) return "Phim Lẻ";
    if (typeSlug === MOVIE_TYPE.PHIM_BO) return "Phim Bộ";
    if (yearParam) return `Phim năm ${yearParam}`;
    return "Tất cả phim";
  }, [genreSlug, GENRES, countrySlug, COUNTRIES, typeSlug, yearParam]);

  return (
    <MainLayout>
      <div
        style={{
          background: isDark ? "#0b0b0f" : "#ffffff",
          color: isDark ? "#e5e7eb" : "#1f2937",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "120px 40px 60px",
          }}
        >
          {/* TIÊU ĐỀ & NÚT BỘ LỌC */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                margin: 0,
                color: isDark ? "#fff" : "#111",
              }}
            >
              {pageTitle}
            </h1>
            <button
              onClick={() => setShowFilter(!showFilter)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                alignSelf: "flex-start",
                background: showFilter
                  ? "rgba(245,158,11,0.15)"
                  : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                border: `1px solid ${showFilter ? "rgba(245,158,11,0.5)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                color: showFilter ? "#f59e0b" : isDark ? "#9ca3af" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Bộ lọc
              <svg
                style={{
                  width: "12px",
                  height: "12px",
                  transform: showFilter ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* BẢNG BỘ LỌC */}
          {showFilter && (
            <div
              style={{
                marginBottom: "32px",
                padding: "24px",
                borderRadius: "12px",
                background: isDark ? "#16171d" : "#f8f9fa",
                border: `1px solid ${isDark ? "#2a2b33" : "#e5e7eb"}`,
              }}
            >
              <FilterRow label="Quốc gia" isDark={isDark}>
                <FilterTag
                  active={!countrySlug}
                  isDark={isDark}
                  onClick={() => updateFilter("quoc-gia", null)}
                >
                  Tất cả
                </FilterTag>
                {COUNTRIES.map((c) => (
                  <FilterTag
                    key={c.id}
                    active={countrySlug === c.slug}
                    isDark={isDark}
                    onClick={() => updateFilter("quoc-gia", c.slug)}
                  >
                    {c.name}
                  </FilterTag>
                ))}
              </FilterRow>
              <FilterRow label="Loại phim" isDark={isDark}>
                <FilterTag
                  active={!typeSlug}
                  isDark={isDark}
                  onClick={() => updateFilter("loai", null)}
                >
                  Tất cả
                </FilterTag>
                <FilterTag
                  active={typeSlug === MOVIE_TYPE.PHIM_LE}
                  isDark={isDark}
                  onClick={() => updateFilter("loai", MOVIE_TYPE.PHIM_LE)}
                >
                  Phim lẻ
                </FilterTag>
                <FilterTag
                  active={typeSlug === MOVIE_TYPE.PHIM_BO}
                  isDark={isDark}
                  onClick={() => updateFilter("loai", MOVIE_TYPE.PHIM_BO)}
                >
                  Phim bộ
                </FilterTag>
              </FilterRow>
              <FilterRow label="Thể loại" isDark={isDark}>
                <FilterTag
                  active={!genreSlug}
                  isDark={isDark}
                  onClick={() => updateFilter("the-loai", null)}
                >
                  Tất cả
                </FilterTag>
                {GENRES.map((g) => (
                  <FilterTag
                    key={g.id}
                    active={genreSlug === g.slug}
                    isDark={isDark}
                    onClick={() => updateFilter("the-loai", g.slug)}
                  >
                    {g.name}
                  </FilterTag>
                ))}
              </FilterRow>
              <FilterRow label="Năm" isDark={isDark}>
                <FilterTag
                  active={!yearParam}
                  isDark={isDark}
                  onClick={() => updateFilter("nam", null)}
                >
                  Tất cả
                </FilterTag>
                {YEARS.map((y) => (
                  <FilterTag
                    key={y}
                    active={parseInt(yearParam) === y}
                    isDark={isDark}
                    onClick={() => updateFilter("nam", y.toString())}
                  >
                    {y}
                  </FilterTag>
                ))}
              </FilterRow>
              <FilterRow label="Sắp xếp" isDark={isDark} isLast={true}>
                {SORTS.map((s) => (
                  <FilterTag
                    key={s.value}
                    active={sortParam === s.value}
                    isDark={isDark}
                    onClick={() => updateFilter("sap-xep", s.value)}
                  >
                    {s.label}
                  </FilterTag>
                ))}
              </FilterRow>

              <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
                <button
                  onClick={() => setShowFilter(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    background: "#f59e0b",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Lọc kết quả
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setShowFilter(false);
                  }}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    background: isDark ? "#2e2e3a" : "#e5e7eb",
                    color: isDark ? "#fff" : "#111",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {/* LƯỚI PHIM */}
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "80px 0",
              }}
            >
              <div className="pp-spinner"></div>
            </div>
          ) : movies.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: isDark ? "#6b7280" : "#9ca3af",
              }}
            >
              Không tìm thấy phim nào phù hợp.
            </div>
          ) : (
            <>
              {/* Dùng CSS Grid thuần túy để tránh lỗi Tailwind */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "20px",
                }}
              >
                {movies.map((movie) => (
                  <Link
                    to={`/phim/${movie.slug}`}
                    key={movie.id}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "150%",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#1a1a22",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(0,0,0,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
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
                        onError={(e) => (e.currentTarget.src = FALLBACK)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#fff",
                          textAlign: "center",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                        }}
                      >
                        {movie.type === "phim_le"
                          ? "Phim Lẻ"
                          : `${movie.totalEpisodes || "?"} Tập`}
                      </div>
                    </div>
                    <h3
                      style={{
                        marginTop: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isDark ? "#fff" : "#111",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        margin: 0,
                      }}
                    >
                      {movie.title}
                    </h3>
                    <p
                      style={{
                        marginTop: "2px",
                        fontSize: "12px",
                        color: isDark ? "#6b7280" : "#9ca3af",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        margin: 0,
                      }}
                    >
                      {movie.releaseYear || "PHIMPLAY24"}
                    </p>
                  </Link>
                ))}
              </div>

              {/* PHÂN TRANG */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "48px",
                }}
              >
                <button
                  onClick={() =>
                    updateFilter(
                      "page",
                      pageParam > 1 ? (pageParam - 1).toString() : null,
                    )
                  }
                  disabled={pageParam <= 1}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    color: isDark ? "#fff" : "#111",
                    background: "transparent",
                    cursor: "pointer",
                    opacity: pageParam <= 1 ? 0.3 : 1,
                  }}
                >
                  ← Trang trước
                </button>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: isDark ? "#fff" : "#111",
                  }}
                >
                  Trang {pageParam}
                </span>
                <button
                  onClick={() =>
                    updateFilter("page", (pageParam + 1).toString())
                  }
                  disabled={!hasMore}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    color: isDark ? "#fff" : "#111",
                    background: "transparent",
                    cursor: "pointer",
                    opacity: !hasMore ? 0.3 : 1,
                  }}
                >
                  Trang sau →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// --- Components phụ trợ ---
function FilterRow({ label, isDark, isLast, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        padding: "12px 0",
        borderBottom: isLast
          ? "none"
          : `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      <div
        style={{
          width: "100px",
          flexShrink: 0,
          fontSize: "14px",
          fontWeight: 700,
          paddingTop: "4px",
          color: isDark ? "#9ca3af" : "#6b7280",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function FilterTag({ active, isDark, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        transition: "all 0.2s",
        cursor: "pointer",
        border: active ? "1px solid #f59e0b" : "1px solid transparent",
        color: active ? "#f59e0b" : isDark ? "#cbd5e1" : "#4b5563",
        background: active ? "rgba(245,158,11,0.1)" : "transparent",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}
