import { useMutation, useQueryClient } from '@tanstack/react-query';
import { episodesApi } from '../../movies/api/episodesApi';

export function useCreateEpisode(movieId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => episodesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes', 'movie', movieId] });
    },
  });
}

export function useDeleteEpisode(movieId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => episodesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes', 'movie', movieId] });
    },
  });
}