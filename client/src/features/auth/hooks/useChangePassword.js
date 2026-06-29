import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

// ============================================================
// useChangePassword — hook đổi mật khẩu khi ĐANG đăng nhập.
// Không điều hướng — component tự hiển thị "đổi mật khẩu thành công".
//
// Cách dùng trong trang hồ sơ/cài đặt:
//   const { mutate, isPending, isSuccess, isError, error } = useChangePassword();
//   mutate({ oldPassword, newPassword });
// ============================================================
export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword, // ({ oldPassword, newPassword }) => ...
  });
}
