import { useQuery } from '@tanstack/react-query';
import { commentsApi } from '../api/commentsApi';
import { commentKeys } from '../queries';

// useComments — danh sách bình luận của 1 phim
export function useComments(movieId) {
  return useQuery({
    queryKey: commentKeys.byMovie(movieId),
    queryFn: () => commentsApi.getByMovie(movieId),
    enabled: !!movieId,
  });
}
