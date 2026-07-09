import { Link } from 'react-router-dom';
import MainLayout from '../../../shared/layout/MainLayout';
import { useTheme } from '../../../providers/useTheme';
// Lưu ý: Bạn cần tạo hook useWatchHistory nếu chưa có
import { useWatchHistory } from '../hooks/useWatchHistory'; 

const FALLBACK = 'https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24';

export default function HistoryPage() {
  const { data: history, isLoading } = useWatchHistory();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0b0b0f' : '#ffffff',
    headerText: isDark ? '#ffffff' : '#111111',
    subText: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#2a2b33' : '#e5e7eb',
    boxBg: isDark ? '#16171d' : '#f8f9fa',
  };

  // Giả định API trả về mảng các object chứa movie và episode
  const items = history || [];

  return (
    <MainLayout>
      <div style={{ background: colors.bg, color: colors.headerText, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '120px 40px 60px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px' }}>Lịch Sử Xem Phim</h1>
          
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="pp-spinner" />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: colors.subText }}>
              <p>Bạn chưa xem bộ phim nào.</p>
              <Link to="/" style={{ color: '#f59e0b', marginTop: 10, display: 'inline-block' }}>Khám phá phim ngay!</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '20px', background: colors.boxBg, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', padding: '16px' }}>
                  {/* Ảnh poster phim */}
                  <img 
                    src={item.movie?.posterUrl || FALLBACK} 
                    alt={item.movie?.title} 
                    style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  {/* Thông tin tập phim đang xem */}
                  <div style={{ flex: 1 }}>
                    <Link to={`/phim/${item.movie?.slug}`} style={{ color: colors.headerText, fontSize: '18px', fontWeight: 700, textDecoration: 'none' }}>
                      {item.movie?.title}
                    </Link>
                    <p style={{ color: colors.subText, fontSize: '14px', marginTop: '4px' }}>
                      Đang xem: Tập {item.episode?.episodeNumber} - {item.episode?.title}
                    </p>
                    {/* Thanh tiến độ xem (ví dụ 40%) */}
                    <div style={{ marginTop: '12px', background: isDark ? '#2a2b33' : '#e5e7eb', height: '6px', borderRadius: '3px', width: '100%' }}>
                      <div style={{ width: '40%', background: '#22c55e', height: '100%', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                  {/* Nút xem tiếp */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link 
                      to={`/xem/${item.movie?.slug}?tap=${item.episode?.episodeNumber}`}
                      style={{ 
                        background: '#f59e0b', color: '#000', padding: '10px 24px', 
                        borderRadius: '20px', fontWeight: 700, fontSize: 14, textDecoration: 'none' 
                      }}
                    >
                      Xem tiếp
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}