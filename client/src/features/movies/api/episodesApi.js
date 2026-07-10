import axiosClient from "../../../lib/axiosClient";

// ============================================================
// episodesApi — gọi API tập phim.
// ============================================================

export const episodesApi = {
  // --- User Side ---
  // GET /episodes/movie/:movieId — danh sách tập (CẦN JWT)
  getByMovieId(movieId) {
    return axiosClient.get(`/episodes/movie/${movieId}`);
  },

  // GET /episodes/:id — chi tiết 1 tập, lấy embedUrl (CẦN JWT)
  getById(id) {
    return axiosClient.get(`/episodes/${id}`);
  },

  // --- Admin Side ---
  // POST /episodes — Thêm tập phim mới
  create(payload) {
    return axiosClient.post('/episodes', payload);
  },

  // PATCH /episodes/:id — Cập nhật tập phim
  update(id, payload) {
    return axiosClient.patch(`/episodes/${id}`, payload);
  },

  // DELETE /episodes/:id — Xóa tập phim
  remove(id) {
    return axiosClient.delete(`/episodes/${id}`);
  },
};