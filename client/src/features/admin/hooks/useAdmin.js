import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  });
}

export function useTopMovies() {
  return useQuery({
    queryKey: ['admin', 'top-movies'],
    queryFn: adminApi.getTopMovies,
  });
}

export function useRecentUsers() {
  return useQuery({
    queryKey: ['admin', 'recent-users'],
    queryFn: adminApi.getRecentUsers,
  });
}