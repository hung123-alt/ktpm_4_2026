import axiosClient from "../../../lib/axiosClient";

// ============================================================
// episodesApi — gọi API tập phim.
// Tạm đặt ở features/movies/, sau này chuyển sang features/watch/
// ============================================================

export const episodesApi = {
  // GET /episodes/movie/:movieId — danh sách tập (CẦN JWT)
  getByMovieId(movieId) {
    return axiosClient.get(`/episodes/movie/${movieId}`);
  },

  // GET /episodes/:id — chi tiết 1 tập, lấy embedUrl (CẦN JWT)
  getById(id) {
    return axiosClient.get(`/episodes/${id}`);
  },
};
