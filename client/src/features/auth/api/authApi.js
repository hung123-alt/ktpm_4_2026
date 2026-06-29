import axiosClient from '../../../lib/axiosClient';

// ============================================================
// authApi — TẦNG GỌI API THUẦN cho xác thực.
// Chỉ gọi Backend, KHÔNG chứa logic React (không hook, không state).
// Mọi hàm trả về Promise. Nhớ: axiosClient đã "bóc" .data sẵn trong interceptor,
// nên kết quả nhận được Ở ĐÂY đã là phần data Backend trả về.
// ============================================================

export const authApi = {
  // POST /auth/register — đăng ký tài khoản mới
  // payload: { username, email, password }
  register(payload) {
    return axiosClient.post('/auth/register', payload);
  },

  // POST /auth/login — đăng nhập
  // payload: { email, password }
  // Backend trả: { message, accessToken, user }
  login(payload) {
    return axiosClient.post('/auth/login', payload);
  },

  // PATCH /auth/change-password — đổi mật khẩu (cần đang đăng nhập)
  // payload: { oldPassword, newPassword }
  changePassword(payload) {
    return axiosClient.patch('/auth/change-password', payload);
  },

  // POST /auth/forgot-password — yêu cầu gửi email đặt lại mật khẩu
  // payload: { email }
  forgotPassword(payload) {
    return axiosClient.post('/auth/forgot-password', payload);
  },

  // POST /auth/reset-password — đặt lại mật khẩu bằng token từ email
  // payload: { token, newPassword }
  resetPassword(payload) {
    return axiosClient.post('/auth/reset-password', payload);
  },
};
