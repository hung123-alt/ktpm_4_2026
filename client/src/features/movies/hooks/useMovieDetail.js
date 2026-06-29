import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';
import { movieKeys } from '../queries';

// ============================================================
// useMovieDetail — lấy chi tiết 1 phim theo slug (useQuery).
// enabled: chỉ gọi khi có slug (tránh gọi thừa lúc slug chưa sẵn sàng).
// Cách dùng: const { data: movie, isLoading } = useMovieDetail(slug);
// ============================================================
export function useMovieDetail(slug) {
  return useQuery({
    queryKey: movieKeys.detail(slug),
    queryFn: () => moviesApi.getBySlug(slug),
    enabled: !!slug, // chỉ chạy khi slug có giá trị (best-practice tránh query thừa)
  });
}
