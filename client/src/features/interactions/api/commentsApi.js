import axiosClient from "../../../lib/axiosClient";

export const commentsApi = {
  // Lấy danh sách bình luận của 1 phim (kèm quan hệ user)
  getByMovie: (movieId) => axiosClient.get(`/comments/movie/${movieId}`),

  // User gửi bình luận mới
  create: (payload) => axiosClient.post("/comments", payload),

  // Admin xóa bình luận
  remove: (id) => axiosClient.delete(`/comments/${id}`),
};
