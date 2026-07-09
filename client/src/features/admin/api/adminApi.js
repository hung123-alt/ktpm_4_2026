import axiosClient from '../../../lib/axiosClient';

export const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  getTopMovies: () => axiosClient.get('/admin/top-movies'),
  getRecentUsers: () => axiosClient.get('/admin/recent-users'),
};