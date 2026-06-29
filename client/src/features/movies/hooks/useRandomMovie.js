import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';
import { movieKeys } from '../queries';

// ============================================================
// useRandomMovie — random nhanh, 1 phim ngẫu nhiên (useQuery).
// staleTime: 0 → mỗi lần "quay" đều lấy phim mới (không dùng cache cũ).
// refetch() để "quay phim khác".
//
// Cách dùng:
//   const { data: movie, refetch, isFetching } = useRandomMovie();
//   // nút "Quay phim khác" → onClick={() => refetch()}
// ============================================================
export function useRandomMovie() {
  return useQuery({
    queryKey: movieKeys.random(),
    queryFn: () => moviesApi.getRandom(),
    staleTime: 0, // random thì luôn muốn data mới, không cache
    gcTime: 0,
  });
}
