// ============================================================
// authKeys — "nhà máy" tạo query key cho feature auth (theo best-practice
// qk-factory-pattern). Auth chủ yếu là mutation nên ít key, nhưng vẫn đặt sẵn
// để nhất quán với các feature khác và dễ mở rộng (vd: query thông tin "tôi").
// ============================================================
export const authKeys = {
  all: ['auth'],
  me: () => [...authKeys.all, 'me'], // dành cho GET /auth/me nếu sau này thêm
};