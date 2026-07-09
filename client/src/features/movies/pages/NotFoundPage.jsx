import { Link } from 'react-router-dom';
import MainLayout from '../../../shared/layout/MainLayout';
import { useTheme } from '../../../providers/useTheme';

// ============================================================
// NotFoundPage — Trang 404
// ============================================================
export default function NotFoundPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <MainLayout>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: isDark ? '#0b0b0f' : '#ffffff',
        color: isDark ? '#e5e7eb' : '#1f2937'
      }}>
        <h1 style={{ fontSize: '120px', fontWeight: 900, margin: 0, color: '#f59e0b', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Ôi! Trang không tồn tại</h2>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '32px' }}>
          Có vẻ như liên kết bạn tìm kiếm đã bị gỡ hoặc không tồn tại.
        </p>
        <Link 
          to="/" 
          style={{ 
            background: '#f59e0b', 
            color: '#000', 
            padding: '12px 32px', 
            borderRadius: '30px', 
            fontWeight: 700, 
            textDecoration: 'none',
            fontSize: 16
          }}
        >
          ← Về Trang Chủ
        </Link>
      </div>
    </MainLayout>
  );
} 