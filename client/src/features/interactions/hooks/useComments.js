import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/commentsApi";

// Lấy danh sách bình luận của phim
export function useMovieComments(movieId) {
  return useQuery({
    queryKey: ["comments", "movie", movieId],
    queryFn: () => commentsApi.getByMovie(movieId),
    enabled: !!movieId,
  });
}

// Gửi bình luận mới
export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => commentsApi.create(payload),
    onSuccess: (_data, variables) => {
      // Khi bình luận thành công, làm mới danh sách bình luận của phim đó
      queryClient.invalidateQueries({
        queryKey: ["comments", "movie", variables.movieId],
      });
    },
  });
}
