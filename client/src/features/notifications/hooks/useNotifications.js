import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi';
import { notificationKeys } from '../queries';

// useNotifications — danh sách thông báo của tôi
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.mine(),
    queryFn: () => notificationsApi.getMine(),
  });
}

// useMarkAsRead — đánh dấu đã đọc 1 thông báo
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
    },
  });
}

// useMarkAllAsRead — đánh dấu đã đọc tất cả
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
    },
  });
}
