import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';
import { movieKeys } from '../queries';

// ============================================================
// useMovies — lấy danh sách phim (useQuery).
// Cách dùng: const { data, isLoading, isError } = useMovies();
// ============================================================
export function useMovies(params) {
  return useQuery({
    queryKey: movieKeys.list(params),
    queryFn: () => moviesApi.getAll(params),
  });
}
