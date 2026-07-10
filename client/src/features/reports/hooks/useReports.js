import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../api/reportsApi";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: reportsApi.getAll,
  });
}

export function useCreateReport() {
  return useMutation({
    mutationFn: (payload) => reportsApi.create(payload),
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => reportsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }); // Cập nhật lại số đếm chuông
    },
  });
}
