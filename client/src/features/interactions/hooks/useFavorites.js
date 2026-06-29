import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';
import { favoriteKeys } from '../queries';

// ============================================================
// useFavorites — danh sách phim yêu thích của tôi (useQuery).
// ============================================================
export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.mine(),
    queryFn: () => favoritesApi.getMine(),
  });
}

// ============================================================
// useToggleFavorite — thêm/bỏ yêu thích với OPTIMISTIC UPDATE.
// best-practice: mut-optimistic-updates + mut-rollback-context.
// Bấm tim → UI đổi NGAY (không chờ server); server lỗi → tự hoàn tác.
//
// Cách dùng:
//   const toggle = useToggleFavorite();
//   toggle.mutate({ movieId, isFavorited }); // isFavorited = trạng thái hiện tại
// ============================================================
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, isFavorited }) =>
      isFavorited ? favoritesApi.remove(movieId) : favoritesApi.add(movieId),

    // Chạy NGAY khi bấm, trước khi server trả lời
    onMutate: async ({ movieId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: favoriteKeys.mine() });
      const previous = queryClient.getQueryData(favoriteKeys.mine());

      // Cập nhật cache tạm thời cho UI phản hồi tức thì
      queryClient.setQueryData(favoriteKeys.mine(), (old) => {
        const list = Array.isArray(old) ? old : [];
        if (isFavorited) {
          // đang yêu thích → bỏ ra khỏi danh sách
          return list.filter((m) => m.id !== movieId && m.movieId !== movieId);
        }
        // chưa yêu thích → thêm tạm (chỉ cần id để UI biết)
        return [...list, { id: movieId, movieId }];
      });

      return { previous }; // context để rollback nếu lỗi
    },

    // Lỗi → hoàn tác về trạng thái trước
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(favoriteKeys.mine(), context.previous);
      }
    },

    // Xong (thành công hoặc lỗi) → đồng bộ lại với server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.mine() });
    },
  });
}
