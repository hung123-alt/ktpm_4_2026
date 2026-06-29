import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

// ============================================================
// useResetPassword — hook đặt MẬT KHẨU MỚI bằng token nhận từ email.
// Thành công: chuyển về /login để đăng nhập bằng mật khẩu mới.
//
// Cách dùng trong ResetPasswordPage (token thường lấy từ URL query):
//   const { mutate, isPending, isError, error } = useResetPassword();
//   mutate({ token, newPassword });
// ============================================================
export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword, // ({ token, newPassword }) => ...
    onSuccess: () => {
      navigate('/login', { replace: true, state: { passwordReset: true } });
    },
  });
}
