import axiosClient from "../../../lib/axiosClient";

// notificationsApi — thông báo hệ thống / tập mới
export const notificationsApi = {
  // GET /notifications — danh sách thông báo của tôi
  getMine: () => axiosClient.get("/notifications"),
  
  // PATCH /notifications/:id/read — đánh dấu đã đọc 1 thông báo
  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
  
  // PATCH /notifications/read-all — đánh dấu đã đọc tất cả
  markAllAsRead: () => axiosClient.patch("/notifications/read-all"),
};