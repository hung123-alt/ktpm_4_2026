import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesApi } from '../../movies/api/moviesApi';

export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => moviesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => moviesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => moviesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}