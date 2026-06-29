import axiosClient from '../../../lib/axiosClient';

// watchlistApi — danh sách xem sau
export const watchlistApi = {
  getMine: () => axiosClient.get('/watchlist'),
  add: (movieId) => axiosClient.post('/watchlist', { movieId }),
  remove: (movieId) => axiosClient.delete(`/watchlist/${movieId}`),
};
