import { useMutation } from "@tanstack/react-query";
import axiosClient from "../../../lib/axiosClient";

// Hook cập nhật thông tin (username, avatar)
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (payload) => axiosClient.patch("/users/me", payload),
    onSuccess: (data) => {
      const rawStoredUser = localStorage.getItem("user");
      const storedUser = rawStoredUser ? JSON.parse(rawStoredUser) : null;
      const updatedUser =
        data && typeof data === "object"
          ? { ...(storedUser || {}), ...data }
          : storedUser;

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      window.dispatchEvent(new Event("auth:updated"));
    },
  });
}

// Hook đổi mật khẩu
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload) =>
      axiosClient.patch("/auth/change-password", payload),
  });
}
