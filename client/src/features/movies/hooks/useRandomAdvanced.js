import { useQuery } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';
import { movieKeys } from '../queries';

// ============================================================
// useRandomAdvanced — random nâng cao theo bộ lọc (useQuery).
// enabled: false để KHÔNG tự chạy khi mở trang — chỉ chạy khi user bấm "QUAY"
// (gọi refetch()). Tránh quay ngẫu nhiên ngay khi chưa chọn điều kiện.
//
// Cách dùng trong RandomPage:
//   const { data, refetch, isFetching } = useRandomAdvanced(filters);
//   // nút "QUAY" → onClick={() => refetch()}
// ============================================================
export function useRandomAdvanced(filters) {
  return useQuery({
    queryKey: movieKeys.randomAdvanced(filters),
    queryFn: () => moviesApi.getRandomAdvanced(filters),
    enabled: false, // chỉ chạy khi gọi refetch() (user bấm QUAY)
    staleTime: 0,
    gcTime: 0,
  });
}
