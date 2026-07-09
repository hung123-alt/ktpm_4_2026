import { Link } from 'react-router-dom';
import MainLayout from '../../../shared/layout/MainLayout';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../../../providers/useTheme';

const FALLBACK = 'https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24';

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0b0b0f' : '#ffffff',
    headerText: isDark ? '#ffffff' : '#111111',
    subText: isDark ? '#9ca3af' : '#6b7280',
  };

   // Lấy object phim lồng trong bản ghi Favorite. Nếu không có thì bỏ qua.
  const movies = favorites?.map(fav => fav.movie).filter(m => m !== undefined && m !== null) || [];

  return (
    <MainLayout>
      <div style={{ background: colors.bg, color: colors.headerText, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '120px 40px 60px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px' }}>Phim Yêu Thích</h1>
          
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="pp-spinner" />
            </div>
          ) : movies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: colors.subText }}>
              <svg style={{ width: '80px', height: '80px', margin: '0 auto 20px', opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p>Bạn chưa có phim yêu thích nào.</p>
              <Link to="/" style={{ color: '#f59e0b', marginTop: 10, display: 'inline-block' }}>Khám phá phim ngay!</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
              {movies.map(movie => (
                <Link to={`/phim/${movie.slug}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '150%', borderRadius: '8px', overflow: 'hidden', background: '#1a1a22' }}>
                    <img 
                      src={movie.posterUrl || FALLBACK} 
                      alt={movie.title} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => (e.currentTarget.src = FALLBACK)}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', fontSize: '11px', fontWeight: 600, color: '#fff', textAlign: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                      {movie.type === 'phim_le' ? 'Phim Lẻ' : `${movie.totalEpisodes || '?'} Tập`}
                    </div>
                  </div>
                  <h3 style={{ marginTop: '8px', fontSize: '14px', fontWeight: 600, color: colors.headerText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {movie.title}
                  </h3>
                  <p style={{ marginTop: '2px', fontSize: '12px', color: colors.subText, margin: 0 }}>
                    {movie.releaseYear || 'PHIMPLAY24'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}