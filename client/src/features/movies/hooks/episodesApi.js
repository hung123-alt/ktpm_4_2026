import axiosClient from '../../../lib/axiosClient';

export const episodesApi = {
  // --- User Side ---
  getByMovieId(movieId) {
    return axiosClient.get(`/episodes/movie/${movieId}`);
  },
  getById(id) {
    return axiosClient.get(`/episodes/${id}`);
  },

  // --- Admin Side ---
  create(payload) {
    return axiosClient.post('/episodes', payload);
  },
  update(id, payload) {
    return axiosClient.patch(`/episodes/${id}`, payload);
  },
  remove(id) {
    return axiosClient.delete(`/episodes/${id}`);
  },
};