import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../shared/layout/MainLayout';
import { useAuth } from '../../../providers/useAuth';
import { useTheme } from '../../../providers/useTheme';
import { useUpdateProfile, useChangePassword } from '../hooks/useProfile';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const updateMut = useUpdateProfile();
  const passMut = useChangePassword();

  // State cho form thông tin
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    avatarUrl: user?.avatarUrl || '',
  });

  // State cho form đổi mật khẩu
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateMut.mutate(profileData, {
      onError: (err) => alert(err.response?.data?.message || 'Lỗi cập nhật thông tin'),
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      alert('Mật khẩu mới nhập lại không khớp!');
      return;
    }
    passMut.mutate({ oldPassword: passData.oldPassword, newPassword: passData.newPassword }, {
      onSuccess: () => {
        alert('Đổi mật khẩu thành công!');
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      },
      onError: (err) => alert(err.response?.data?.message || 'Đổi mật khẩu thất bại'),
    });
  };

  const colors = {
    bg: isDark ? '#0b0b0f' : '#f8f9fa',
    text: isDark ? '#e5e7eb' : '#1f2937',
    cardBg: isDark ? '#16171d' : '#ffffff',
    border: isDark ? '#2a2b33' : '#e5e7eb',
  };

  return (
    <MainLayout>
      <div style={{ background: colors.bg, color: colors.text, minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: isDark ? '#fff' : '#111' }}>Hồ Sơ Cá Nhân</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            
            {/* ===== 1. CẬP NHẬT THÔNG TIN ===== */}
            <form onSubmit={handleUpdateProfile} style={{ ...cardStyle(colors), padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 20, color: isDark ? '#fff' : '#111' }}>Thông tin tài khoản</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <img 
                  src={profileData.avatarUrl || `https://placehold.co/100x100/1a1a22/f59e0b?text=${user?.username?.[0]?.toUpperCase() || 'U'}`} 
                  alt="Avatar" 
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', background: '#333' }}
                />
                <div style={{ flex: 1 }}>
                  <label style={labelStyle(isDark)}>Link Ảnh Đại Diện (URL)</label>
                  <input 
                    type="text" 
                    value={profileData.avatarUrl} 
                    onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })} 
                    placeholder="https://example.com/avatar.jpg"
                    style={inputStyle(isDark)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle(isDark)}>Tên đăng nhập</label>
                <input 
                  type="text" 
                  value={profileData.username} 
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} 
                  style={inputStyle(isDark)}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle(isDark)}>Email (Không thể thay đổi)</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  style={{ ...inputStyle(isDark), opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <button type="submit" disabled={updateMut.isPending} style={btnPrimary}>
                {updateMut.isPending ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </form>

            {/* ===== 2. ĐỔI MẬT KHẨU ===== */}
            <form onSubmit={handleChangePassword} style={{ ...cardStyle(colors), padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 20, color: isDark ? '#fff' : '#111' }}>Đổi mật khẩu</h2>
              
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle(isDark)}>Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={passData.oldPassword} 
                  onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })} 
                  style={inputStyle(isDark)}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle(isDark)}>Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={passData.newPassword} 
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} 
                  style={inputStyle(isDark)}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle(isDark)}>Nhập lại mật khẩu mới</label>
                <input 
                  type="password" 
                  value={passData.confirmPassword} 
                  onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })} 
                  style={inputStyle(isDark)}
                  required
                />
              </div>

              <button type="submit" disabled={passMut.isPending} style={btnPrimary}>
                {passMut.isPending ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// --- Styles ---
const cardStyle = (colors) => ({
  background: colors.cardBg,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
});
const labelStyle = (isDark) => ({ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: isDark ? '#9ca3af' : '#6b7280' });
const inputStyle = (isDark) => ({ width: '100%', padding: '10px 12px', background: isDark ? '#0b0b0f' : '#f8f9fa', border: `1px solid ${isDark ? '#2a2b33' : '#e5e7eb'}`, borderRadius: 6, color: isDark ? '#fff' : '#000', outline: 'none', boxSizing: 'border-box' });
const btnPrimary = { background: '#3c50e0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' };