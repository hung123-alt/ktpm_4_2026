// ============================================================
// Cửa export công khai của feature auth.
// Bên ngoài import từ đây thay vì lục vào từng file con.
// Ví dụ: import { useLogin, useRegister } from '@/features/auth';
// (Pages chưa tạo — sẽ export thêm khi có giao diện.)
// ============================================================
export { authApi } from './api/authApi';
export { authKeys } from './queries';
export { useLogin } from './hooks/useLogin';
export { useRegister } from './hooks/useRegister';
export { useForgotPassword } from './hooks/useForgotPassword';
export { useResetPassword } from './hooks/useResetPassword';
export { useChangePassword } from './hooks/useChangePassword';