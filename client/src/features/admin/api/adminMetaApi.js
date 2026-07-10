import axiosClient from '../../../lib/axiosClient';

export const adminMetaApi = {
  // Genres
  getGenres: () => axiosClient.get('/genres'),
  createGenre: (payload) => axiosClient.post('/genres', payload),
  updateGenre: (id, payload) => axiosClient.patch(`/genres/${id}`, payload),
  deleteGenre: (id) => axiosClient.delete(`/genres/${id}`),

  // Countries
  getCountries: () => axiosClient.get('/countries'),
  createCountry: (payload) => axiosClient.post('/countries', payload),
  updateCountry: (id, payload) => axiosClient.patch(`/countries/${id}`, payload),
  deleteCountry: (id) => axiosClient.delete(`/countries/${id}`),
};