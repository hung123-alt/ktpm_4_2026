import { useParams, Link, useSearchParams } from 'react-router-dom';
import MainLayout from '../../../shared/layout/MainLayout';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useEpisodes } from '../hooks/useEpisodes';
import { useAuth } from '../../../providers/useAuth';
import { useTheme } from '../../../providers/useTheme';
import ThemeToggle from '../../../shared/components/ThemeToggle';
import { useFavorites, useToggleFavorite } from '../../interactions/hooks/useFavorites';
import { MOVIE_STATUS_LABEL } from '../../../config/constants';
import { useWatchlist, useToggleWatchlist } from '../../interactions/hooks/useWatchlist';

const FALLBACK = 'https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24';
const bannerOf = (m) => m?.bannerUrl || m?.posterUrl || FALLBACK;
const posterOf = (m) => m?.posterUrl || FALLBACK;

export default function MovieDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const currentTap = parseInt(searchParams.get('tap')) || 1;

  const { data: movie, isLoading, isError } = useMovieDetail(slug);
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // === HOOKS YÊU THÍCH ===
   const { data: favoritesData } = useFavorites();
  const toggleFavMutation = useToggleFavorite();
  // ✅ Sửa lại: Phải check theo movieId (vì favoritesData là mảng các bản ghi Favorite)
  const isFavorite = favoritesData?.some(fav => fav.movieId === movie?.id)

  const handleToggleFavorite = () => {
    if (!movie) return;
    toggleFavMutation.mutate({ movieId: movie.id, isFavorite });
  };
  // ========================
    // === HOOKS XEM SAU ===
  const { data: watchlistData } = useWatchlist();
  const toggleWatchlistMutation = useToggleWatchlist();
  const inWatchlist = watchlistData?.some(w => w.movieId === movie?.id);

  const handleToggleWatchlist = () => {
    if (!movie) return;
    toggleWatchlistMutation.mutate({ movieId: movie.id, inWatchlist });
  };
  const movieId = movie?.id;
  const { data: episodes, isLoading: epLoading } = useEpisodes(movieId);

  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="pp-spinner" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !movie) {
    return (
      <MainLayout>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p>Không tìm thấy phim này.</p>
          <Link to="/" style={{ marginTop: 20, padding: '10px 20px', background: '#f59e0b', color: '#000', borderRadius: 20, fontWeight: 600 }}>
            ← Quay lại trang chủ
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isSeries = movie.type !== 'phim_le';
  const totalEp = movie.totalEpisodes || 0;
  const genresText = movie.genres?.map(g => g.name).join(', ');
  const countriesText = movie.countries?.map(c => c.name).join(', ');

  return (
    <MainLayout>
      <div style={{ background: isDark ? '#0b0b0f' : '#ffffff', color: isDark ? '#e5e7eb' : '#1f2937' }}>
        
        {/* ===== BANNER ===== */}
        <div style={{ position: 'relative', width: '100%', minHeight: '70vh', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${bannerOf(movie)})`, backgroundSize: 'cover', backgroundPosition: 'center'
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: isDark
              ? 'linear-gradient(to top, #0b0b0f 10%, rgba(11,11,15,0.6) 50%, rgba(11,11,15,0.3) 100%), linear-gradient(to right, rgba(11,11,15,0.9) 0%, rgba(11,11,15,0.4) 50%, transparent 100%)'
              : 'linear-gradient(to top, #ffffff 10%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 100%), linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
          }} />
          
          <div style={{ position: 'absolute', top: 90, right: 20, zIndex: 20 }}>
            <ThemeToggle />
          </div>

          {/* Nội dung phim trên Banner */}
          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '0 40px 40px' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
              <img
                src={posterOf(movie)}
                alt={movie.title}
                style={{ display: 'block', width: 180, flexShrink: 0, borderRadius: 12, objectFit: 'cover', aspectRatio: '2/3', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
              />
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, marginBottom: 8, color: isDark ? '#fff' : '#111', textShadow: isDark ? '0 4px 20px rgba(0,0,0,0.6)' : 'none' }}>
                  {movie.title || movie.name}
                </h1>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  {movie.avgRating > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#f5c518' }}>
                      <svg style={{ width: 16, height: 16 }} fill="#f5c518" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {Number(movie.avgRating).toFixed(1)} ({movie.ratingCount || 0} đánh giá)
                    </span>
                  )}
                  <span style={{ fontSize: 14, color: isDark ? '#9ca3af' : '#6b7280' }}>{movie.viewCount?.toLocaleString()} lượt xem</span>
                </div>

                {/* ===== CỤM NÚT BẤM ===== */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <Link
                    to={`/xem/${movie.slug}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '13px 28px', height: 48, borderRadius: 24,
                      fontWeight: 700, fontSize: 15, color: '#fff',
                      background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                      boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 28px rgba(34,197,94,0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,0.35)';
                    }}
                  >
                    <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Chiếu Phát
                  </Link>

                  <button
                    onClick={handleToggleFavorite}
                    disabled={toggleFavMutation.isPending}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '13px 22px', height: 48, borderRadius: 24,
                      fontSize: 15, fontWeight: 600,
                      cursor: toggleFavMutation.isPending ? 'not-allowed' : 'pointer',
                      opacity: toggleFavMutation.isPending ? 0.6 : 1,
                      transition: 'all 0.2s',
                      border: isFavorite ? '1px solid #ef4444' : `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                      background: isFavorite ? 'rgba(239,68,68,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                      color: isFavorite ? '#ef4444' : (isDark ? '#d1d5db' : '#4b5563')
                    }}
                    onMouseEnter={(e) => {
                      if (!toggleFavMutation.isPending) e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg
                      style={{ width: 18, height: 18, transition: 'transform 0.2s' }}
                      fill={isFavorite ? '#ef4444' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {toggleFavMutation.isPending ? 'Đang xử lý...' : (isFavorite ? 'Đã thích' : 'Yêu thích')}
                  </button>
                  {/* ✅ THÊM NÚT XEM SAU */}
<button
  onClick={handleToggleWatchlist}
  disabled={toggleWatchlistMutation.isPending}
  style={{
    display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '13px 22px', borderRadius: 24,
    fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
    border: inWatchlist ? '1px solid #3b82f6' : `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
    background: inWatchlist ? 'rgba(59,130,246,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
    color: inWatchlist ? '#3b82f6' : (isDark ? '#d1d5db' : '#4b5563')
  }}
>
  <svg style={{ width: 18, height: 18 }} fill={inWatchlist ? '#3b82f6' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
  {inWatchlist ? 'Đã lưu' : 'Xem sau'}
</button>
                </div>
                {/* ========================== */}
              </div>
            </div>
          </div>
        </div>

        {/* ===== NỘI DUNG CHÍNH: 2 CỘT ===== */}
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '32px 40px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 32 }}>
            
            {/* CỘT TRÁI (Chiếm 2/3 chiều rộng) */}
            <div style={{ gridColumn: 'span 2 / span 2', display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* 1. Mô tả phim (Nội dung) */}
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: isDark ? '#fff' : '#111' }}>Nội dung phim</h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'justify' }}>
                  {movie.description || 'Chưa có mô tả cho bộ phim này.'}
                </p>
              </div>

              {/* 2. Danh sách tập phim */}
              {isSeries && (
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: isDark ? '#fff' : '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Danh sách tập 
                    {episodes?.length > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: isDark ? '#6b7280' : '#9ca3af' }}>({episodes.length} tập)</span>}
                  </h2>

                  {!isAuthenticated ? (
                    <div style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(26,26,36,0.5)' : 'rgba(243,244,246,0.8)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                      <p style={{ marginBottom: 16, fontSize: 14 }}>Đăng nhập để xem danh sách tập phim</p>
                      <Link to="/login" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 24, background: '#f59e0b', color: '#000', fontWeight: 700, fontSize: 14 }}>Đăng nhập ngay</Link>
                    </div>
                  ) : (
                    <div style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(18,18,26,0.6)' : 'rgba(249,250,251,0.6)', borderRadius: 12, padding: 20 }}>
                      {epLoading ? <div style={{ textAlign: 'center', padding: 32 }}>Đang tải tập phim...</div> 
                      : episodes?.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
                          {episodes.map((ep) => {
                            const isActive = ep.episodeNumber === currentTap;
                            return (
                              <Link key={ep.id} to={`/xem/${movie.slug}?tap=${ep.episodeNumber}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, background: isActive ? '#22c55e' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'), color: isActive ? '#fff' : (isDark ? '#9ca3af' : '#6b7280'), border: isActive ? '1px solid #22c55e' : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                                {ep.episodeNumber}
                              </Link>
                            );
                          })}
                        </div>
                      ) : <p style={{ textAlign: 'center', padding: 16 }}>Chưa có tập phim nào.</p>}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Bình luận */}
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: isDark ? '#fff' : '#111' }}>Bình luận (0)</h2>
                <div style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(26,26,36,0.5)' : 'rgba(243,244,246,0.8)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                  {!isAuthenticated ? (
                    <>
                      <p style={{ marginBottom: 12, fontSize: 14 }}>Đăng nhập để bình luận</p>
                      <Link to="/login" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 24, background: '#f59e0b', color: '#000', fontWeight: 700, fontSize: 14 }}>Đăng nhập ngay</Link>
                    </>
                  ) : <p style={{ fontSize: 14 }}>Tính năng bình luận đang được phát triển.</p>}
                </div>
              </div>

            </div>

            {/* CỘT PHẢI: Thông tin chi tiết (Chiếm 1/3 chiều rộng) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(18,18,26,0.6)' : 'rgba(249,250,251,0.6)', borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: isDark ? '#fff' : '#111' }}>Thông tin phim</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                  <InfoRow label="Đạo diễn" value="Đang cập nhật" isDark={isDark} />
                  <InfoRow label="Diễn viên" value="Đang cập nhật" isDark={isDark} />
                  <InfoRow label="Thể loại" value={genresText || 'Đang cập nhật'} isDark={isDark} />
                  <InfoRow label="Quốc gia" value={countriesText || 'Đang cập nhật'} isDark={isDark} />
                  <InfoRow label="Năm phát hành" value={movie.releaseYear || 'Đang cập nhật'} isDark={isDark} />
                  <InfoRow label="Thời lượng" value={isSeries ? `${totalEp} tập` : '90 phút'} isDark={isDark} />
                  <InfoRow label="Chất lượng" value="HD" isDark={isDark} />
                  <InfoRow label="Phụ đề" value="Vietsub" isDark={isDark} />
                  <InfoRow label="Trạng thái" value={MOVIE_STATUS_LABEL[movie.status] || 'Đang chiếu'} isDark={isDark} />
                </div>
              </div>

              {/* Thẻ Thể loại (Nút bấm) */}
              {movie.genres?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: isDark ? '#fff' : '#111' }}>Thể loại</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {movie.genres.map((g) => (
                      <Link key={g.id} to={`/loc?the-loai=${g.slug}`} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: isDark ? '#d1d5db' : '#4b5563' }}>
                        {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Component nhỏ hiển thị 1 dòng thông tin
function InfoRow({ label, value, isDark }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <span style={{ fontWeight: 500, color: isDark ? '#9ca3af' : '#6b7280', minWidth: 100 }}>{label}:</span>
      <span style={{ color: isDark ? '#e5e7eb' : '#1f2937', flex: 1 }}>{value}</span>
    </div>
  );
}