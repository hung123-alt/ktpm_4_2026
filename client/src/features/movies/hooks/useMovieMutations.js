import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';
import { movieKeys } from '../queries';

// ============================================================
// Các hook MUTATION cho phim (admin): tạo / sửa / xóa.
// best-practice mut-invalidate-queries: sau khi đổi dữ liệu, làm mới cache
// danh sách phim để UI hiển thị dữ liệu mới nhất.
// ============================================================

// --- Tạo phim mới ---
export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moviesApi.create, // (payload) => ...
    onSuccess: () => {
      // Làm mới mọi danh sách phim (list + filter) — chúng đều nằm dưới lists()
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
  });
}

// --- Cập nhật phim ---
export function useUpdateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    // truyền { id, payload } khi gọi mutate
    mutationFn: ({ id, payload }) => moviesApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      // nếu biết slug có thể invalidate chi tiết; ở đây làm mới toàn bộ cho chắc
      queryClient.invalidateQueries({ queryKey: movieKeys.details() });
      void variables;
    },
  });
}

// --- Xóa phim ---
export function useDeleteMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => moviesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
  });
}
