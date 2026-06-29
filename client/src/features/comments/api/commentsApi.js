import axiosClient from '../../../lib/axiosClient';

// commentsApi — bình luận phim (Backend lọc nội dung độc hại bằng sanitize-html)
export const commentsApi = {
  // GET /comments/movie/:movieId — danh sách bình luận của 1 phim
  getByMovie: (movieId) => axiosClient.get(`/comments/movie/${movieId}`),
  // POST /comments — thêm bình luận (payload: { movieId, content, parentId? })
  add: (payload) => axiosClient.post('/comments', payload),
  // DELETE /comments/:id — xóa bình luận của mình
  remove: (id) => axiosClient.delete(`/comments/${id}`),
};
