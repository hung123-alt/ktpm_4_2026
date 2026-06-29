import axiosClient from '../../../lib/axiosClient';

// ============================================================
// moviesApi — các hàm gọi API THUẦN cho phim.
// (axiosClient đã bóc .data → kết quả trả về đã là data)
// ============================================================

export const moviesApi = {
  // GET /movies — danh sách phim (có thể kèm query params phân trang)
  getAll: (params) => axiosClient.get('/movies', { params }),

  // GET /movies/:slug — chi tiết 1 phim theo slug
  getBySlug: (slug) => axiosClient.get(`/movies/${slug}`),

  // GET /movies/filter — bộ lọc phim
  // params: { countryId, type, genreIds, releaseYear, sortBy, page, limit }
  filter: (params) => axiosClient.get('/movies/filter', { params }),

  // GET /movies/random — random nhanh, 1 phim ngẫu nhiên
  getRandom: () => axiosClient.get('/movies/random'),

  // GET /movies/random/advanced — random nâng cao theo bộ lọc
  // params: { type, status, genreIds, limit, sortBy }
  getRandomAdvanced: (params) => axiosClient.get('/movies/random/advanced', { params }),

  // --- Các hàm dành cho ADMIN (cần JWT + role admin) ---

  // POST /movies — tạo phim mới
  create: (payload) => axiosClient.post('/movies', payload),

  // PATCH /movies/:id — cập nhật phim
  update: (id, payload) => axiosClient.patch(`/movies/${id}`, payload),

  // DELETE /movies/:id — xóa phim
  remove: (id) => axiosClient.delete(`/movies/${id}`),
};
