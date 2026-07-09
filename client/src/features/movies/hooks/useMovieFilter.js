import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { moviesApi } from '../api/moviesApi';

// ============================================================
// useMovieFilter — Gọi API /movies/filter với bộ lọc
// Dùng keepPreviousData để UI không bị nhấp nháy khi đổi page
// ============================================================
export function useMovieFilter(filters) {
  return useQuery({
    queryKey: ['movies', 'filter', filters],
    queryFn: () => moviesApi.filter(filters),
    placeholderData: keepPreviousData, 
    enabled: !!filters, // Chỉ chạy khi có object filters
  });
}