import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { watchHistoryApi } from "../api/watchHistoryApi";
import { watchHistoryKeys } from "../queries";

// useWatchHistory — danh sách "xem tiếp" của tôi
export function useWatchHistory() {
  return useQuery({
    queryKey: watchHistoryKeys.mine(),
    queryFn: () => watchHistoryApi.getMine(),
  });
}

// useSaveProgress — lưu tiến độ xem (gọi định kỳ trong WatchPage)
// KHÔNG invalidate mỗi lần lưu (gọi rất thường xuyên) để tránh refetch liên tục.
export function useSaveProgress() {
  return useMutation({
    mutationFn: (payload) => watchHistoryApi.saveProgress(payload),
  });
}

// Alias dùng cho WatchPage
export function useSaveWatchHistory() {
  return useSaveProgress();
}

// useRemoveHistory — xóa 1 bản ghi lịch sử
export function useRemoveHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => watchHistoryApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.mine() });
    },
  });
}

// useClearHistory — xóa toàn bộ lịch sử
export function useClearHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => watchHistoryApi.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.mine() });
    },
  });
}
