import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

// ============================================================
// useRegister — hook đăng ký tài khoản (useMutation).
// Thành công: KHÔNG tự đăng nhập, mà chuyển sang trang /login để user đăng nhập.
// (Có thể đổi thành tự login nếu Backend trả token khi register — hiện tại không.)
//
// Cách dùng trong RegisterForm:
//   const { mutate, isPending, isError, error } = useRegister();
//   mutate({ username, email, password });
// ============================================================
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register, // ({ username, email, password }) => ...
    onSuccess: () => {
      // Đăng ký xong → sang trang đăng nhập (kèm cờ để hiện thông báo nếu muốn)
      navigate('/login', { replace: true, state: { justRegistered: true } });
    },
  });
}
