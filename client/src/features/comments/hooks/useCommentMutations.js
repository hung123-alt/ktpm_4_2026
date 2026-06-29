import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/commentsApi';
import { commentKeys } from '../queries';

// useAddComment — thêm bình luận, làm mới danh sách bình luận của phim đó
export function useAddComment(movieId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => commentsApi.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byMovie(movieId) });
    },
  });
}

// useDeleteComment — xóa bình luận, làm mới danh sách
export function useDeleteComment(movieId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => commentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byMovie(movieId) });
    },
  });
}
