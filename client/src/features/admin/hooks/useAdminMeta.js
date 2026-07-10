import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMetaApi } from '../api/adminMetaApi';

export function useGenres() {
  return useQuery({ queryKey: ['genres'], queryFn: adminMetaApi.getGenres });
}
export function useCountries() {
  return useQuery({ queryKey: ['countries'], queryFn: adminMetaApi.getCountries });
}

export function useSaveGenre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => id ? adminMetaApi.updateGenre(id, payload) : adminMetaApi.createGenre(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['genres'] }),
    onError: (err) => alert(err.response?.data?.message || 'Lỗi lưu thể loại. Có thể do thiếu quyền Admin hoặc Backend chưa có route POST/PATCH.'),
  });
}
export function useDeleteGenre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminMetaApi.deleteGenre(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['genres'] }),
    onError: (err) => alert(err.response?.data?.message || 'Lỗi xóa thể loại.'),
  });
}

export function useSaveCountry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => id ? adminMetaApi.updateCountry(id, payload) : adminMetaApi.createCountry(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['countries'] }),
    onError: (err) => alert(err.response?.data?.message || 'Lỗi lưu quốc gia. Có thể do thiếu quyền Admin hoặc Backend chưa có route POST/PATCH.'),
  });
}
export function useDeleteCountry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminMetaApi.deleteCountry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['countries'] }),
    onError: (err) => alert(err.response?.data?.message || 'Lỗi xóa quốc gia.'),
  });
}