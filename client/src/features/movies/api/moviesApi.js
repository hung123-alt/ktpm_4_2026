import axiosClient from '../../../lib/axiosClient';

export const moviesApi = {
  // GET /movies
  getAll: (params) => axiosClient.get('/movies', { params }),

  // GET /movies/slug/:slug
  getBySlug: (slug) => axiosClient.get(`/movies/slug/${slug}`),

  // ✅ SỬA LẠI HÀM FILTER: Thêm paramsSerializer để Axios gửi mảng đúng chuẩn Backend
  filter: (params) => axiosClient.get('/movies/filter', { 
    params,
    paramsSerializer: {
      indexes: null // Giúp gửi genreIds=1 thay vì genreIds[]=1
    }
  }),

  // GET /movies/random
  getRandom: () => axiosClient.get('/movies/random'),

  // GET /movies/random/advanced
  getRandomAdvanced: (params) => axiosClient.get('/movies/random/advanced', { 
    params,
    paramsSerializer: { indexes: null } 
  }),

  // --- ADMIN ---
  create: (payload) => axiosClient.post('/movies', payload),
  update: (id, payload) => axiosClient.patch(`/movies/${id}`, payload),
  remove: (id) => axiosClient.delete(`/movies/${id}`),
};