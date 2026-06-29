// ============================================================
// reportWebVitals — đo CHỈ SỐ HIỆU NĂNG của trang web (không phải logic
// nghiệp vụ). Viết lại từ ý tưởng reportWebVitals.js của Create React App,
// chuyển sang dùng được với Vite + bản web-vitals mới nhất (v5).
//
// ⚠️ Khác CRA: bản mới đặt tên hàm là onCLS/onLCP/... (có tiền tố "on"),
// bản cũ CRA dùng getCLS/getFID/... KHÔNG còn dùng nữa.
// ⚠️ FID (First Input Delay) đã bị THAY bằng INP (Interaction to Next Paint)
// — Google đổi từ 2024, INP đo phản hồi chính xác hơn FID.
//
// 5 chỉ số đo:
//   CLS  — trang có bị "nhảy/giật" khi tải không
//   INP  — bấm vào, web phản hồi nhanh không (thay cho FID cũ)
//   FCP  — bao lâu thấy nội dung ĐẦU TIÊN
//   LCP  — bao lâu phần tử LỚN NHẤT hiện đầy (vd ảnh poster to)
//   TTFB — Backend phản hồi nhanh không
// ============================================================
export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
}
