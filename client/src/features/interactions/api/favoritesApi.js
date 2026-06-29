import axiosClient from '../../../lib/axiosClient';

// favoritesApi — yêu thích phim
export const favoritesApi = {
  // GET /favorites — danh sách phim yêu thích của tôi
  getMine: () => axiosClient.get('/favorites'),
  // POST /favorites — thêm yêu thích (payload: { movieId })
  add: (movieId) => axiosClient.post('/favorites', { movieId }),
  // DELETE /favorites/:movieId — bỏ yêu thích
  remove: (movieId) => axiosClient.delete(`/favorites/${movieId}`),
};
