import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../../lib/axiosClient';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/auth/reset-password', { token, newPassword: password });
      alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Mã token không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  // Nếu không có token trong URL, hiện cảnh báo
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#121212', color: '#fff' }}>
        <h2>Link không hợp lệ</h2>
        <p style={{ color: '#aaa', marginTop: 10 }}>Không tìm thấy mã đặt lại mật khẩu trong đường dẫn.</p>
        <Link to="/forgot-password" style={{ marginTop: 20, color: '#f26522' }}>Yêu cầu link mới</Link>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <style>{styles.css}</style>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>PHIMPLAY24</Link>
      </header>

      <div style={styles.wrapper}>
        <div style={styles.box}>
          <h2 style={styles.title}>Đặt Lại Mật Khẩu</h2>
          <p style={styles.subtitle}>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

          {error && (
            <div style={styles.alertError}>
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Xác nhận mật khẩu</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#121212', zIndex: 9999, overflowY: 'auto', fontFamily: 'Segoe UI, sans-serif' },
  header: { background: 'transparent', position: 'absolute', width: '100%', top: 0, left: 0, zIndex: 10000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%' },
  logo: { fontSize: '26px', fontWeight: 900, color: '#f26522', letterSpacing: '1px', textDecoration: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.6)' },
  wrapper: { minHeight: '100vh', width: '100%', background: 'linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.85)), url(https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop) center/cover no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 20px 40px' },
  box: { backgroundColor: 'rgba(26, 26, 26, 0.9)', backdropFilter: 'blur(10px)', width: '100%', maxWidth: '450px', padding: '40px', borderRadius: '12px', border: '1px solid #2b2b2b', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)' },
  title: { fontSize: '28px', fontWeight: 700, marginBottom: '10px', textAlign: 'center', color: '#fff' },
  subtitle: { textAlign: 'center', color: '#aaaaaa', fontSize: '14px', marginBottom: '30px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' },
  label: { fontSize: '14px', color: '#aaaaaa', fontWeight: 500 },
  input: { width: '100%', backgroundColor: '#252525', border: '1px solid #333', borderRadius: '6px', padding: '13px 15px', color: '#fff', fontSize: '15px', outline: 'none' },
  button: { width: '100%', backgroundColor: '#f26522', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' },
  alertError: { backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  css: `input:focus { border-color: #f26522 !important; }`
};