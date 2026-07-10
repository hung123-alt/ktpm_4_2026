import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';

export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: usersApi.getAll,
  });
}

export function useToggleBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersApi.toggleBan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}