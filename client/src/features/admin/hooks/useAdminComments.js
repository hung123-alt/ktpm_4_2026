import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCommentsApi } from '../api/adminCommentsApi';

export function useAdminComments() {
  return useQuery({
    queryKey: ['admin', 'comments'],
    queryFn: adminCommentsApi.getAll,
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminCommentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// ✅ Thêm hook ẩn/hiện bình luận
export function useToggleHideComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminCommentsApi.toggleHide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
    },
  });
}