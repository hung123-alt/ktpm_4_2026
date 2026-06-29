import axiosClient from '../../../lib/axiosClient';

// watchHistoryApi — lịch sử xem / "xem tiếp"
export const watchHistoryApi = {
  // GET /watch-history — danh sách "xem tiếp" của tôi
  getMine: () => axiosClient.get('/watch-history'),
  // POST /watch-history — lưu tiến độ (payload: { movieId, episodeId, progressSeconds })
  saveProgress: (payload) => axiosClient.post('/watch-history', payload),
  // DELETE /watch-history/:id — xóa 1 bản ghi
  remove: (id) => axiosClient.delete(`/watch-history/${id}`),
  // DELETE /watch-history/all — xóa toàn bộ
  clearAll: () => axiosClient.delete('/watch-history/all'),
};
