import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistApi } from '../api/watchlistApi';
import { watchlistKeys } from '../queries';

// useWatchlist — danh sách xem sau của tôi
export function useWatchlist() {
  return useQuery({
    queryKey: watchlistKeys.mine(),
    queryFn: () => watchlistApi.getMine(),
  });
}

// useToggleWatchlist — thêm/bỏ xem sau (đơn giản, invalidate sau khi xong)
export function useToggleWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ movieId, inWatchlist }) =>
      inWatchlist ? watchlistApi.remove(movieId) : watchlistApi.add(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.mine() });
    },
  });
}
