import { useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../../lib/axiosClient';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    if (!formData.terms) {
      setError('Vui lòng đồng ý với Điều khoản sử dụng.');
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post('/auth/register', {
        // Tự động xoá dấu cách để biến "Họ và tên" thành username hợp lệ cho Database
        username: formData.username.replace(/\s+/g, ''),
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
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

          /* Container Ép full màn hình */
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

          /* Header */
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

          /* Nền trang đăng ký */
          .auth-wrapper {
            min-height: 100vh;
            width: 100%;
            background: ${isLightMode 
              ? `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat`
              : `linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.9)), url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat`
            };
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 80px 20px 40px; /* Thêm padding top để không đè header */
          }

          .register-box {
            background-color: ${isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 26, 26, 0.95)'};
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 480px;
            padding: 40px;
            border-radius: 12px;
            border: 1px solid ${isLightMode ? '#e0e0e0' : '#2b2b2b'};
            box-shadow: 0 15px 35px rgba(0, 0, 0, ${isLightMode ? '0.15' : '0.6'});
            transition: all 0.3s ease;
          }

          .register-box h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            text-align: center;
            color: ${isLightMode ? '#111' : 'var(--text-main)'};
          }

          .register-box p.subtitle {
            text-align: center;
            color: ${isLightMode ? '#555' : 'var(--text-muted)'};
            font-size: 14px;
            margin-bottom: 30px;
          }

          /* Hàng 2 cột cho mật khẩu */
          .form-row-custom {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
          }

          .form-row-custom .form-group-custom {
            margin-bottom: 0;
            flex: 1;
          }

          .form-group-custom {
            margin-bottom: 20px;
          }

          .form-group-custom label {
            display: block;
            font-size: 14px;
            color: ${isLightMode ? '#444' : '#cccccc'};
            margin-bottom: 8px;
            font-weight: 500;
          }

          .form-control-custom {
            width: 100%;
            background-color: ${isLightMode ? '#fff' : '#222222'};
            border: 1px solid ${isLightMode ? '#ccc' : '#3a3a3a'};
            border-radius: 6px;
            padding: 12px 15px;
            color: ${isLightMode ? '#111' : '#fff'};
            font-size: 15px;
            transition: all 0.3s ease;
          }

          .form-control-custom:focus {
            outline: none;
            border-color: var(--primary-color);
            background-color: ${isLightMode ? '#fdfdfd' : '#1a1a1a'};
          }

          /* Checkbox Điều khoản */
          .terms-group {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 13px;
            color: ${isLightMode ? '#555' : 'var(--text-muted)'};
            margin-bottom: 25px;
            line-height: 1.4;
          }

          .terms-group input[type="checkbox"] {
            margin-top: 3px;
            accent-color: var(--primary-color);
            cursor: pointer;
          }

          .terms-group a {
            color: var(--primary-color);
            text-decoration: none;
          }

          .terms-group a:hover {
            text-decoration: underline;
          }

          .btn-submit {
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

          .btn-submit:hover {
            background-color: #e05313;
          }

          .btn-submit:active {
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

          /* Nút Light/Dark Mode */
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

      <div className="auth-page-container">
        
        {/* Header Phimplay24 giống trang Login */}
        <header className="auth-header">
          <Link to="/" className="logo">PHIMPLAY24</Link>
          <Link to="/" className="back-link">
            <i className="bi bi-arrow-left-circle-fill me-2" style={{ color: 'var(--primary-color)', fontSize: '18px' }}></i>
            Quay lại Trang chủ
          </Link>
        </header>

        <div className="auth-wrapper">
          <div className="register-box">

            <h2>Tạo Tài Khoản</h2>
            <p className="subtitle">Trải nghiệm phim chất lượng cao không giới hạn</p>

            {error && (
              <Alert variant="danger" className="border-0 rounded-2" style={{ backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' }}>
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="form-group-custom">
                {/* Giữ nguyên nhãn "Họ và Tên" như bản gốc của bạn */}
                <label htmlFor="username">Họ và Tên</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control-custom"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="email">Địa chỉ Email</label>
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

              {/* Hàng 2 cột cho Mật khẩu & Xác nhận giống y hệt ảnh 2 */}
              <div className="form-row-custom">
                <div className="form-group-custom">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control-custom"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group-custom">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control-custom"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              {/* Checkbox điều khoản */}
              <label className="terms-group">
                <input 
                  type="checkbox" 
                  name="terms" 
                  checked={formData.terms}
                  onChange={handleChange}
                  required 
                />
                <span>Tôi đồng ý với các <Link to="#">Điều khoản sử dụng</Link> và <Link to="#">Chính sách bảo mật</Link> của Phimplay24.</span>
              </label>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  'Đăng Ký Ngay'
                )}
              </button>
            </Form>

            <div className="auth-switch">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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