import { useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../../lib/axiosClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State quản lý chế độ Sáng / Tối
  const [isLightMode, setIsLightMode] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const response = await axiosClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setIsLightMode(!isLightMode);

  return (
    <>
      <style>
        {`
          :root {
            --primary-color: #f26522;
            --text-main: #ffffff;
            --text-muted: #aaaaaa;
          }

          /* Bộ giáp ngoài cùng: Ép buộc full màn hình 100%, đè mọi CSS mặc định của React */
          .auth-page-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: ${isLightMode ? '#f8f9fa' : '#121212'};
            z-index: 9999;
            overflow-y: auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: background-color 0.3s ease;
          }

          /* Header (Trang chủ & Nút Quay lại) */
          .auth-header {
            background: transparent;
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 5%;
          }

          .auth-header .logo {
            font-size: 26px;
            font-weight: 900;
            color: var(--primary-color);
            letter-spacing: 1px;
            text-decoration: none;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          }

          .auth-header .back-link {
            color: ${isLightMode ? '#222' : '#e0e0e0'};
            font-size: 15px;
            font-weight: 500;
            text-decoration: none;
            transition: color 0.3s ease;
            text-shadow: ${isLightMode ? 'none' : '0 1px 3px rgba(0,0,0,0.6)'};
            display: flex;
            align-items: center;
          }

          .auth-header .back-link:hover {
            color: var(--primary-color);
          }

          /* Hình nền Gradient & Căn giữa Form */
          .auth-wrapper {
            min-height: 100vh;
            width: 100%;
            background: ${isLightMode 
              ? `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat` 
              : `linear-gradient(rgba(17, 17, 17, 0.75), rgba(17, 17, 17, 0.85)), url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat`
            };
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          /* Hộp đăng nhập */
          .login-box {
            background-color: ${isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 26, 26, 0.9)'};
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 420px;
            padding: 40px 35px;
            border-radius: 12px;
            border: 1px solid ${isLightMode ? '#e0e0e0' : '#2b2b2b'};
            box-shadow: 0 15px 35px rgba(0, 0, 0, ${isLightMode ? '0.15' : '0.6'});
            margin-top: 40px; /* Đẩy xuống một chút nhường chỗ cho header */
            transition: all 0.3s ease;
          }

          .login-box h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 25px;
            text-align: center;
            color: ${isLightMode ? '#111' : 'var(--text-main)'};
          }

          .input-group-custom {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 18px;
          }

          .input-group-custom label {
            display: block;
            font-size: 14px;
            color: ${isLightMode ? '#444' : 'var(--text-muted)'};
            font-weight: 500;
          }

          .form-control-custom {
            width: 100%;
            background-color: ${isLightMode ? '#fff' : '#252525'};
            border: 1px solid ${isLightMode ? '#ccc' : '#333'};
            border-radius: 6px;
            padding: 13px 15px;
            color: ${isLightMode ? '#111' : '#fff'};
            font-size: 15px;
            transition: border-color 0.3s ease, background-color 0.3s ease;
          }

          .form-control-custom:focus {
            outline: none;
            border-color: var(--primary-color);
            background-color: ${isLightMode ? '#fdfdfd' : '#1a1a1a'};
          }

          .forgot-pwd-link {
            font-size: 14px;
            color: #007bff;
            text-decoration: none;
            display: block;
            text-align: right;
            margin-bottom: 20px;
          }

          .forgot-pwd-link:hover {
            color: var(--primary-color);
            text-decoration: underline;
          }

          .btn-login {
            width: 100%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 14px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s, transform 0.1s;
          }

          .btn-login:hover {
            background-color: #e05313;
          }

          .btn-login:active {
            transform: scale(0.98);
          }

          .auth-switch {
            text-align: center;
            margin-top: 25px;
            font-size: 14px;
            color: ${isLightMode ? '#555' : 'var(--text-muted)'};
            border-top: 1px solid ${isLightMode ? '#eee' : '#333'};
            padding-top: 20px;
          }

          .auth-switch a {
            color: var(--primary-color);
            font-weight: 600;
            text-decoration: none;
          }

          .auth-switch a:hover {
            text-decoration: underline;
          }

          /* Nút Light/Dark Mode Float */
          .btn-theme-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 18px;
            background-color: ${isLightMode ? '#ffffff' : '#1e1e1e'};
            color: ${isLightMode ? '#000000' : '#ffffff'};
            border: 1px solid ${isLightMode ? '#ccc' : '#333'};
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 10px rgba(0,0,0, ${isLightMode ? '0.1' : '0.4'});
            transition: all 0.3s;
            z-index: 10000;
          }

          .btn-theme-toggle:hover {
            background-color: ${isLightMode ? '#f0f0f0' : '#333'};
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* Bao bọc toàn trang để chống bị margin của App.css */}
      <div className="auth-page-container">
        
        {/* Header Trong suốt */}
        <header className="auth-header">
          <Link to="/" className="logo">PHIMPLAY24</Link>
          <Link to="/" className="back-link">
            {/* Đây là Icon siêu đẹp bạn yêu cầu */}
            <i className="bi bi-arrow-left-circle-fill me-2" style={{ color: 'var(--primary-color)', fontSize: '18px' }}></i>
            Quay lại Trang chủ
          </Link>
        </header>

        {/* Nội dung Form */}
        <div className="auth-wrapper">
          <div className="login-box">
            
            <h2>Đăng nhập Phimplay24</h2>

            {/* Thông báo đăng ký thành công */}
            {successMessage && (
              <Alert variant="success" className="border-0 rounded-2" style={{ backgroundColor: 'rgba(40, 167, 69, 0.15)', color: '#4caf50' }}>
                <i className="bi bi-check-circle me-2"></i>{successMessage}
              </Alert>
            )}

            {/* Thông báo lỗi */}
            {error && (
              <Alert variant="danger" className="border-0 rounded-2" style={{ backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' }}>
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="input-group-custom">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control-custom"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group-custom">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control-custom"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Link to="/forgot-password" className="forgot-pwd-link">
                Quên mật khẩu?
              </Link>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </Form>

            <div className="auth-switch">
              Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </div>
        </div>

        {/* Nút Đổi màu (Light/Dark mode) */}
        <button className="btn-theme-toggle" onClick={toggleTheme}>
          {isLightMode ? '🌙 Chế độ Tối' : '☀️ Chế độ Sáng'}
        </button>
      </div>
    </>
  );
}