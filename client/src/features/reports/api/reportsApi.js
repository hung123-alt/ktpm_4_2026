import axiosClient from "../../../lib/axiosClient";

export const reportsApi = {
  // User gửi báo lỗi
  create: (payload) => axiosClient.post("/error-reports", payload),
  // Admin lấy danh sách
  getAll: () => axiosClient.get("/error-reports"),
  // Admin cập nhật trạng thái
  update: (id, payload) => axiosClient.patch(`/error-reports/${id}`, payload),
};
