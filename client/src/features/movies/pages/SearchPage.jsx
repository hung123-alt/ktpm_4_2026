import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../../../shared/layout/MainLayout';
import { useTheme } from '../../../providers/useTheme';
import { moviesApi } from '../api/moviesApi';

const FALLBACK = 'https://placehold.co/300x450/1a1a22/f59e0b?text=PHIMPLAY24';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [inputValue, setInputValue] = useState(keyword);

  const [prevKeyword, setPrevKeyword] = useState(keyword);

  // ✅ SỬA Ở ĐÂY: Xóa bỏ useEffect và cập nhật state trực tiếp
  if (keyword !== prevKeyword) {
    setPrevKeyword(keyword);
    setInputValue(keyword);
  }

  // ✅ SỬA Ở ĐÂY: Dùng moviesApi.getAll có sẵn, truyền params là keyword
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', keyword],
    queryFn: () => moviesApi.getAll({ keyword }),
    enabled: !!keyword,
  });

  const movies = Array.isArray(data) ? data : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const colors = {
    bg: isDark ? '#0b0b0f' : '#ffffff',
    text: isDark ? '#e5e7eb' : '#1f2937',
    headerText: isDark ? '#ffffff' : '#111111',
    subText: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#2a2b33' : '#e5e7eb',
    boxBg: isDark ? '#16171d' : '#f8f9fa',
  };

  return (
    <MainLayout>
      <div style={{ background: colors.bg, color: colors.text, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '120px 40px 60px' }}>
          
          {/* Thanh tìm kiếm */}
          <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: '800px', background: colors.boxBg, border: `1px solid ${colors.border}`, borderRadius: '30px', overflow: 'hidden' }}>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tên phim, diễn viên..."
                style={{ flex: 1, padding: '16px 24px', fontSize: '16px', background: 'transparent', border: 'none', outline: 'none', color: colors.headerText }}
              />
              <button type="submit" style={{ padding: '0 32px', background: '#f59e0b', color: '#000', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Khu vực hiển thị kết quả */}
          {!keyword ? (
            <div style={{ textAlign: 'center', color: colors.subText, marginTop: '60px' }}>
              <svg style={{ width: '80px', height: '80px', margin: '0 auto 20px', opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p>Nhập từ khóa để bắt đầu tìm kiếm phim...</p>
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div className="pp-spinner"></div>
            </div>
          ) : isError ? (
            <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '60px' }}>
              <p>Lỗi tìm kiếm. Hãy đảm bảo Backend đã cập nhật hàm findAll(keyword).</p>
            </div>
          ) : movies.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.subText, marginTop: '60px' }}>
              <p style={{ fontSize: '20px', marginBottom: '10px' }}>Không tìm thấy kết quả nào cho từ khóa: <span style={{ color: '#f59e0b', fontWeight: 700 }}>"{keyword}"</span></p>
              <p>Hãy thử với từ khóa khác!</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.headerText, marginBottom: '24px' }}>
                Kết quả cho: <span style={{ color: '#f59e0b' }}>"{keyword}"</span> ({movies.length} phim)
              </h2>
              
              {/* Lưới phim */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                {movies.map(movie => (
                  <Link to={`/phim/${movie.slug}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
                    <p style={{ marginTop: '2px', fontSize: '12px', color: colors.subText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                      {movie.releaseYear || 'PHIMPLAY24'}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
