import { useInfiniteQuery } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';
import { movieKeys } from '../queries';

// ============================================================
// useMovieFilter — bộ lọc phim với phân trang "Tải thêm" (useInfiniteQuery).
// Khớp response Backend: { data, page, limit, hasMore }.
//
// best-practice inf-page-params: luôn cung cấp getNextPageParam.
//   - hasMore = true  → trang kế = page + 1
//   - hasMore = false → trả undefined → hết trang, nút "Tải thêm" tự ẩn.
//
// Cách dùng trong FilterPage:
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMovieFilter(filters);
//   // gộp tất cả trang: const movies = data?.pages.flatMap(p => p.data) ?? [];
// ============================================================
export function useMovieFilter(filters) {
  return useInfiniteQuery({
    queryKey: movieKeys.filter(filters),
    queryFn: ({ pageParam = 1 }) =>
      moviesApi.filter({ ...filters, page: pageParam }),
    initialPageParam: 1, // v5 bắt buộc khai báo trang khởi đầu
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.page + 1 : undefined,
  });
}
