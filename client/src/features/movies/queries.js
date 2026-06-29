// ============================================================
// movieKeys — "nhà máy" query key cho phim (best-practice qk-factory-pattern
// + qk-hierarchical-organization). Phân cấp để invalidate đúng phạm vi:
//   - Xóa cache TẤT CẢ về phim: queryClient.invalidateQueries(movieKeys.all)
//   - Xóa cache chỉ danh sách:   movieKeys.lists()
//   - Xóa cache 1 phim cụ thể:   movieKeys.detail(slug)
// ============================================================
export const movieKeys = {
  all: ['movies'],

  // Danh sách (gồm filter)
  lists: () => [...movieKeys.all, 'list'],
  list: (params) => [...movieKeys.lists(), params || {}],

  // Bộ lọc (tách riêng cho dễ đọc, vẫn nằm dưới 'list')
  filter: (filters) => [...movieKeys.lists(), 'filter', filters || {}],

  // Chi tiết
  details: () => [...movieKeys.all, 'detail'],
  detail: (slug) => [...movieKeys.details(), slug],

  // Random
  random: () => [...movieKeys.all, 'random'],
  randomAdvanced: (filters) => [...movieKeys.all, 'random', 'advanced', filters || {}],
};
