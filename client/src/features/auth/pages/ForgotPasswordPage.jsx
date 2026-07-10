import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../lib/axiosClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/forgot-password', { email });
      setMessage(res.message || 'Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style>{styles.css}</style>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>PHIMPLAY24</Link>
        <Link to="/login" style={styles.backLink}>
          <i className="bi bi-arrow-left-circle-fill me-2" style={{ color: 'var(--primary-color)', fontSize: '18px' }}></i>
          Quay lại Đăng nhập
        </Link>
      </header>

      <div style={styles.wrapper}>
        <div style={styles.box}>
          <h2 style={styles.title}>Quên Mật Khẩu</h2>
          <p style={styles.subtitle}>Nhập email đăng ký của bạn. Chúng tôi sẽ gửi mã link đặt lại mật khẩu.</p>

          {message && (
            <div style={styles.alertSuccess}>
              <i className="bi bi-check-circle me-2"></i>{message}
            </div>
          )}
          {error && (
            <div style={styles.alertError}>
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Địa chỉ Email</label>
              <input
                type="email"
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
            </button>
          </form>

          <div style={styles.switchBox}>
            Nhớ ra mật khẩu? <Link to="/login" style={styles.switchLink}>Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#121212', zIndex: 9999, overflowY: 'auto', fontFamily: 'Segoe UI, sans-serif' },
  header: { background: 'transparent', position: 'absolute', width: '100%', top: 0, left: 0, zIndex: 10000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%' },
  logo: { fontSize: '26px', fontWeight: 900, color: '#f26522', letterSpacing: '1px', textDecoration: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.6)' },
  backLink: { color: '#e0e0e0', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center' },
  wrapper: { minHeight: '100vh', width: '100%', background: 'linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.85)), url(https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop) center/cover no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 20px 40px' },
  box: { backgroundColor: 'rgba(26, 26, 26, 0.9)', backdropFilter: 'blur(10px)', width: '100%', maxWidth: '450px', padding: '40px', borderRadius: '12px', border: '1px solid #2b2b2b', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)' },
  title: { fontSize: '28px', fontWeight: 700, marginBottom: '10px', textAlign: 'center', color: '#fff' },
  subtitle: { textAlign: 'center', color: '#aaaaaa', fontSize: '14px', marginBottom: '30px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' },
  label: { fontSize: '14px', color: '#aaaaaa', fontWeight: 500 },
  input: { width: '100%', backgroundColor: '#252525', border: '1px solid #333', borderRadius: '6px', padding: '13px 15px', color: '#fff', fontSize: '15px', outline: 'none' },
  button: { width: '100%', backgroundColor: '#f26522', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' },
  alertSuccess: { backgroundColor: 'rgba(40, 167, 69, 0.15)', color: '#4caf50', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  alertError: { backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  switchBox: { textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#aaaaaa', borderTop: '1px solid #333', paddingTop: '20px' },
  switchLink: { color: '#f26522', fontWeight: 600, textDecoration: 'none' },
  css: `input:focus { border-color: #f26522 !important; }`
};