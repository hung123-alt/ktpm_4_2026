import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../../../providers/useAuth';

// ============================================================
// useLogin — hook đăng nhập (useMutation).
// Khi thành công: lưu token + user vào AuthProvider (localStorage),
// rồi điều hướng về trang trước đó (hoặc trang chủ).
//
// Cách dùng trong component giao diện (LoginForm):
//   const { mutate, isPending, isError, error } = useLogin();
//   mutate({ email, password });
// ============================================================
export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sau khi login, quay lại trang user định vào trước đó (nếu có), nếu không về "/"
  const from = location.state?.from?.pathname || '/';

  return useMutation({
    mutationFn: authApi.login, // ({ email, password }) => ...
    onSuccess: (data) => {
      // Backend trả: { message, accessToken, user }
      login(data.accessToken, data.user); // lưu vào AuthProvider + localStorage
      navigate(from, { replace: true });
    },
    // Không cần onError ở đây — component đọc isError/error để hiển thị
  });
}