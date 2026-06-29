import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '../api/ratingsApi';
import { ratingKeys } from '../queries';
import { movieKeys } from '../../movies/queries';

// useMyRating — đánh giá của tôi cho 1 phim (để hiện sao đã chọn)
export function useMyRating(movieId) {
  return useQuery({
    queryKey: ratingKeys.myRating(movieId),
    queryFn: () => ratingsApi.getMyRating(movieId),
    enabled: !!movieId,
  });
}

// useRateMovie — gửi/cập nhật đánh giá (payload: { movieId, score, content })
// Sau khi đánh giá: làm mới chi tiết phim (avg_rating đổi) + đánh giá của tôi.
export function useRateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => ratingsApi.rate(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.myRating(variables.movieId) });
      queryClient.invalidateQueries({ queryKey: movieKeys.details() });
    },
  });
}
