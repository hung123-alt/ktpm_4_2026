import { Link } from 'react-router-dom';
import MainLayout from '../../../shared/layout/MainLayout';
import { useWatchlist } from '../hooks/useWatchlist';
import { useTheme } from '../../../providers/useTheme';

const FALLBACK = 'https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24';

export default function WatchlistPage() {
  const { data: watchlist, isLoading } = useWatchlist();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0b0b0f' : '#ffffff',
    headerText: isDark ? '#ffffff' : '#111111',
    subText: isDark ? '#9ca3af' : '#6b7280',
  };

  const movies = watchlist?.map(w => w.movie).filter(Boolean) || [];

  return (
    <MainLayout>
      <div style={{ background: colors.bg, color: colors.headerText, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '120px 40px 60px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px' }}>Danh Sách Xem Sau</h1>
          
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="pp-spinner" />
            </div>
          ) : movies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: colors.subText }}>
              <p>Bạn chưa có phim nào trong danh sách xem sau.</p>
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