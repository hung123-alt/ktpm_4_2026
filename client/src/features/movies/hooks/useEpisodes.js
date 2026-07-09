import { useQuery } from "@tanstack/react-query";
import { episodesApi } from "../api/episodesApi";
import { useAuth } from "../../../providers/useAuth";

// ============================================================
// useEpisodes — lấy danh sách tập của 1 phim.
// Chỉ gọi khi: có movieId + đã đăng nhập (API yêu cầu JWT).
// ============================================================

export function useEpisodes(movieId) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["episodes", "movie", movieId],
    queryFn: () => episodesApi.getByMovieId(movieId),
    enabled: !!movieId && isAuthenticated,
  });
}
