import axiosClient from '../../../lib/axiosClient';

// ratingsApi — đánh giá phim (mỗi user 1 lần/phim, Backend UPSERT)
export const ratingsApi = {
  // POST /ratings — gửi/cập nhật đánh giá (payload: { movieId, score, content })
  rate: (payload) => axiosClient.post('/ratings', payload),
  // GET /ratings/movie/:movieId — đánh giá của tôi cho 1 phim (nếu Backend hỗ trợ)
  getMyRating: (movieId) => axiosClient.get(`/ratings/movie/${movieId}`),
};
