import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

// ============================================================
// useForgotPassword — hook gửi yêu cầu đặt lại mật khẩu qua email.
// Không điều hướng — component tự hiển thị thông báo "đã gửi email, kiểm tra hộp thư".
// (Backend cố tình KHÔNG tiết lộ email có tồn tại hay không, nên luôn báo thành công.)
//
// Cách dùng trong ForgotPasswordPage:
//   const { mutate, isPending, isSuccess, isError, error } = useForgotPassword();
//   mutate({ email });
// ============================================================
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword, // ({ email }) => ...
  });
}
