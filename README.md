<!-- ═══════════════════════════════════════════════════
     ANIMATED HEADER — Cinema Neon theme
     type=waving cho hiệu ứng sóng cuộn ở đáy header
════════════════════════════════════════════════════ -->
<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=0:0b0b0f,50:1a1005,100:2b1400&height=230&section=header&text=PHIMPLAY24&fontSize=76&fontColor=f26522&animation=fadeIn&fontAlignY=35&desc=Nền%20tảng%20xem%20phim%20trực%20tuyến%20—%20Nhóm%204%20·%20Phenikaa%20University&descSize=18&descAlignY=62&descColor=ffcf9e)

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=18&pause=1200&color=F26522&center=true&vCenter=true&width=760&height=50&lines=🎬+Xem+phim+%2B+Xem+tiếp+%2B+Skip+Intro;🔐+JWT+Stateless+Authentication;⚡+TanStack+Query+%2B+Optimistic+Update;🎲+Random+Phim+%2B+Bộ+lọc+nâng+cao;🛡️+Bcrypt+·+XSS+Guard+·+Rate+Limiting" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MySQL-Aiven%20Cloud-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TanStack%20Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query"/>
  <img src="https://img.shields.io/badge/License-MIT-8A2BE2?style=for-the-badge" alt="License"/>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/🌐%20Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Frontend Demo"/></a>
  &nbsp;
  <a href="#"><img src="https://img.shields.io/badge/⚙️%20Backend%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Backend API"/></a>
  &nbsp;
  <a href="#-cài-đặt--chạy-local"><img src="https://img.shields.io/badge/📖%20Docs-Getting%20Started-ffcf9e?style=for-the-badge" alt="Docs"/></a>
</p>

</div>

---

## 📋 Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Tính năng nổi bật](#-tính-năng-nổi-bật)
3. [Demo tài khoản](#-demo-tài-khoản)
4. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
5. [Cấu trúc dự án](#-cấu-trúc-dự-án)
6. [Mô hình dữ liệu](#-mô-hình-dữ-liệu)
7. [Kiến trúc bảo mật](#-kiến-trúc-bảo-mật)
8. [Sơ đồ hệ thống](#-sơ-đồ-hệ-thống)
9. [Cài đặt & Chạy local](#-cài-đặt--chạy-local)
10. [Nhóm phát triển](#-nhóm-phát-triển)

---

## ✨ Giới thiệu

**Phimplay24** là nền tảng xem phim trực tuyến (VOD) được xây dựng theo kiến trúc **Client-Server tách biệt**, trong khuôn khổ môn **Thiết kế Web Nâng cao** — Nhóm 4, Phenikaa University.

Hệ thống kiểm soát toàn bộ vòng đời của nội dung phim: từ lúc **Admin** thêm phim, gắn tập, đến khi **User** duyệt, tìm kiếm, xem và tương tác cộng đồng. Điểm đặc trưng của hệ thống là cơ chế xác thực **JWT stateless** (không dùng Session/Cookie), quản lý dữ liệu server bằng **TanStack Query** với **Optimistic Update**, và kiến trúc Frontend **Feature-based** đồng bộ tư duy module hóa với Backend.

---

## 🚀 Tính năng nổi bật

```
🎬 Xem phim              →  Video Player nhúng iframe, tự Skip Intro, tự chuyển tập
⏯️  Xem tiếp              →  Tự lưu tiến độ xem (Watch History), gợi ý tiếp tục
🔎 Tìm kiếm & Lọc         →  Lọc kết hợp Thể loại + Quốc gia + Năm + Loại phim (AND)
🎲 Random phim            →  Random nhanh (1 phim) & Random nâng cao (theo bộ lọc)
💬 Bình luận & Đánh giá   →  Reply lồng nhau (self-reference), chấm điểm 1–10
❤️  Cá nhân hóa           →  Yêu thích · Xem sau · Lịch sử xem riêng từng user
🔐 Xác thực JWT           →  Stateless, Bcrypt 12 vòng, phân quyền User/Admin
🛡️  Bảo mật nhiều lớp     →  Chống XSS (sanitize-html) · Rate Limiting · Validation
📊 Admin Dashboard        →  Thống kê, quản lý phim/tập/thể loại/quốc gia/user
📩 Quên mật khẩu          →  Gửi email token 15 phút, dùng một lần (Nodemailer)
```

---

## 🔐 Demo tài khoản

| Vai trò | Email | Mật khẩu | Quyền hạn |
|---------|-------|----------|-----------|
| 👑 **Admin** | `admin@phimplay24.com` | `admin123` | Toàn quyền — CRUD phim/tập/danh mục, quản lý user, xử lý báo lỗi |
| 👤 **User** | `user@phimplay24.com` | `admin123` | Xem phim, bình luận, đánh giá, yêu thích, xem sau, lịch sử |

---

## 🛠️ Chức năng chính theo module

| Module | Chức năng |
|--------|-----------|
| **Auth** | Đăng ký / Đăng nhập / Đổi mật khẩu / Quên & Đặt lại mật khẩu (JWT + Bcrypt) |
| **Movies** | CRUD phim — Tìm kiếm — Lọc nâng cao — Random (nhanh & nâng cao) |
| **Episodes** | Quản lý tập phim — Embed URL — Skip Intro — Chuyển tập |
| **Comments** | Bình luận có Reply (self-reference) — Chống XSS bằng sanitize-html |
| **Ratings** | Đánh giá sao 1–10, upsert (một user chỉ một điểm/phim) |
| **Favorites / Watchlist** | Thêm/xóa yêu thích & xem sau — Optimistic Update tức thì |
| **Watch History** | Tự động lưu tiến độ xem theo tập — hỗ trợ "Xem tiếp" |
| **Notifications** | Thông báo hệ thống / tập mới |
| **Error Reports** | Người dùng báo lỗi video/tập — Admin xử lý trạng thái |
| **Admin** | Dashboard thống kê — Quản lý toàn bộ nội dung & người dùng |

---

## 🛠️ Công nghệ sử dụng

<div align="center">

[![Tech Stack](https://skillicons.dev/icons?i=nestjs,ts,react,vite,tailwind,mysql,nodejs,git,github,postman&theme=dark&perline=10)](https://skillicons.dev)

</div>

<br/>

| Layer | Công nghệ | Ghi chú |
|-------|-----------|---------|
| **Backend** | NestJS (TypeScript) | Kiến trúc Module hóa: Controller – Service – Entity – DTO |
| **ORM** | TypeORM | Ánh xạ Entity ↔ bảng MySQL, chống SQL Injection bằng tham số hóa |
| **Database** | MySQL 8.0 — Aiven Cloud | Kết nối SSL bắt buộc, 14 bảng quan hệ chặt chẽ |
| **Auth** | JWT (Passport.js) | Stateless, access token 15 phút, Header `Authorization: Bearer` |
| **Mã hóa** | Bcrypt | Salt rounds = 12, không lưu plain-text |
| **Bảo mật** | sanitize-html · @nestjs/throttler | Chống XSS · Rate Limiting 20 req/60s/IP |
| **Frontend** | React (Vite) | Kiến trúc Feature-based (api/hooks/pages theo từng tính năng) |
| **Server State** | TanStack Query v5 | Cache, Optimistic Update, Infinite Query (phân trang) |
| **HTTP Client** | Axios + Interceptor | Tự động gắn JWT, tự xử lý 401 (redirect login) |
| **Routing** | React Router v6 | Lazy loading, Protected/Admin Route Guard |
| **Email** | Nodemailer (Gmail SMTP) | Gửi link đặt lại mật khẩu |
| **IDE** | GitHub Codespaces | Môi trường phát triển trên Cloud |

---

## 📁 Cấu trúc dự án

```
cinema-online-hub/
├── server/                              # Backend — NestJS
│   └── src/
│       ├── common/                       # Dùng chung cho mọi module
│       │   ├── guards/
│       │   │   ├── jwt-auth.guard.ts      → Xác thực: kiểm tra JWT hợp lệ (Authentication)
│       │   │   └── roles.guard.ts         → Phân quyền: kiểm tra role Admin/User (Authorization)
│       │   ├── decorators/
│       │   │   ├── roles.decorator.ts     → Gắn nhãn @Roles(ADMIN) lên route
│       │   │   └── current-user.decorator.ts → Lấy nhanh user từ request (@CurrentUser())
│       │   ├── enums/                     → Hằng số cố định: role, loại phim, trạng thái, loại lỗi
│       │   └── interfaces/
│       │       └── jwt-payload.interface.ts → Định nghĩa cấu trúc payload JWT (sub, email, role)
│       │
│       ├── mail/
│       │   ├── mail.module.ts             → Đăng ký MailService cho module khác dùng
│       │   └── mail.service.ts            → Gửi email quên mật khẩu (Nodemailer)
│       │
│       ├── database/
│       │   ├── schema.sql                 → Lệnh tạo 14 bảng + ràng buộc khóa
│       │   └── seed.sql                    → Data mẫu (user, phim, thể loại...) để test
│       │
│       └── modules/                       # Mỗi thư mục = 1 chức năng nghiệp vụ độc lập
│           ├── auth/
│           │   ├── auth.controller.ts     → Nhận request /auth/* (login, register...)
│           │   ├── auth.service.ts        → Xử lý logic: băm mật khẩu, tạo JWT, so sánh
│           │   └── auth.strategy.ts       → Giải mã & verify chữ ký JWT (Passport)
│           ├── users/                     → Xem/sửa hồ sơ cá nhân, tìm user theo email
│           ├── movies/                    → CRUD phim, tìm kiếm, lọc, random
│           ├── episodes/                  → CRUD tập phim, skip intro, chuyển tập
│           ├── genres/ · countries/        → CRUD danh mục thể loại/quốc gia
│           ├── comments/                  → Bình luận (lọc XSS bằng sanitize-html)
│           ├── ratings/                   → Đánh giá sao 1–10 (upsert)
│           ├── favorites/ · watchlist/     → Yêu thích / Xem sau (toggle)
│           ├── watch-history/             → Lưu tiến độ xem, hỗ trợ "xem tiếp"
│           ├── notifications/             → Thông báo hệ thống
│           ├── error-reports/             → Người dùng báo lỗi, Admin xử lý
│           └── admin/                     → Dashboard thống kê, quản lý toàn hệ thống
│
└── client/                               # Frontend — React (Vite)
    └── src/
        ├── providers/
        │   ├── AuthProvider.jsx           → Quản lý trạng thái đăng nhập toàn app
        │   └── QueryProvider.jsx          → Cấu hình TanStack Query (cache)
        ├── lib/
        │   ├── axiosClient.js             → Axios instance, tự gắn JWT vào mọi request
        │   └── queryClient.js             → Cấu hình cache (staleTime, retry...)
        ├── routes/
        │   ├── AppRoutes.jsx               → Khai báo toàn bộ URL của app
        │   ├── ProtectedRoute.jsx         → Chặn trang cần đăng nhập
        │   └── AdminRoute.jsx              → Chặn trang cần quyền Admin
        ├── config/
        │   └── constants.js                → Hằng số khớp enum Backend (loại phim, sortBy...)
        └── features/                       # Mỗi thư mục = 1 tính năng, tự chứa api/hooks/pages
            ├── auth/        → api gọi login/register + hook useLogin/useRegister + trang Login/Register
            ├── movies/       → api gọi phim + hook useMovies/useMovieFilter + trang Home/Detail/Watch
            ├── comments/     → api + hook useComments (xem, thêm, xóa bình luận)
            ├── interactions/ → api + hook cho favorites, ratings, watchlist, watch-history
            ├── notifications/ → api + hook useNotifications
            └── admin/         → api + hook + trang Dashboard, quản lý phim/user
```

---

## 🗄️ Mô hình dữ liệu

Hệ thống quản lý **14 bảng** với ràng buộc khóa ngoại chặt chẽ:

```
users ──┬──< comments (self-reference qua parent_id → reply)
        ├──< ratings ──> movies
        ├──< favorites ──> movies
        ├──< watchlist ──> movies
        ├──< watch_history ──> movies, episodes
        ├──< error_reports ──> movies, episodes
        ├──< notifications
        └──< refresh_tokens

movies ──┬──< episodes
         ├──n:n── genres      (qua movie_genres)
         └──n:n── countries   (qua movie_countries)
```

- **Khóa chính kép (composite key):** `favorites`, `watchlist`, `ratings` — đảm bảo 1 user chỉ tương tác 1 lần/phim
- **Self-reference:** `comments.parent_id` — hỗ trợ trả lời bình luận lồng nhau
- **ON DELETE CASCADE:** xóa phim tự động xóa tập/bình luận/đánh giá liên quan

---

## 🛡️ Kiến trúc bảo mật

| Lớp bảo vệ | Cơ chế | Mục đích |
|------------|--------|----------|
| **Authentication** | JwtAuthGuard + JwtStrategy | Xác minh chữ ký JWT, giải mã payload |
| **Authorization** | RolesGuard + `@Roles()` decorator | Phân quyền Admin/User theo route |
| **Mã hóa mật khẩu** | Bcrypt (12 vòng) | Không thể giải ngược, chống rainbow table |
| **Chống XSS** | sanitize-html | Lọc thẻ `<script>` trong bình luận trước khi lưu DB |
| **Chống SQL Injection** | TypeORM tham số hóa | Không ghép chuỗi SQL trực tiếp |
| **Chống Brute-force** | @nestjs/throttler | Giới hạn 20 request / 60 giây / IP |
| **Validation** | class-validator + DTO | Chặn dữ liệu sai format trước khi vào Service |

> 💡 **Đã phân tích & lựa chọn:** hệ thống dùng JWT qua Header (không Cookie) để tự miễn nhiễm CSRF, chấp nhận đánh đổi "không thu hồi token giữa đường" — bảng `refresh_tokens` đã được thiết kế sẵn cho hướng mở rộng Refresh Token trong tương lai.

---

## 📊 Sơ đồ hệ thống

- **Use Case Diagram** — 3 actor kế thừa (Guest → User → Admin), ~23 use case
- **Class Diagram** — 12 Entity + RefreshToken, quan hệ 1-n / n-n / self-reference
- **Activity Diagram** — Đăng ký/Đăng nhập · Xem phim · Quên mật khẩu
- **Sequence Diagram** — Luồng xác thực JWT (Authentication → Authorization)
- **Component Diagram** — Kiến trúc 3-tier & Module Dependency
- **ER Diagram** — 14 bảng quan hệ (dbdiagram.io)

---

## ⚙️ Cài đặt & Chạy local

### Yêu cầu hệ thống
- **Node.js 18+**
- **npm**
- Kết nối Internet (Database Aiven MySQL Cloud)

### Backend

```bash
cd server
npm install
npm run start:dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`, Backend tại `http://localhost:3000/api`.

---

## 👥 Nhóm phát triển

<div align="center">

| Thành viên | MSSV | Vai trò |
|-----------|------|---------|
| **Nhóm 4** | — | Backend · Frontend · Database · Bảo mật |

**Giảng viên hướng dẫn:** Nguyễn Thành Trung · TS. Nguyễn Lệ Thu
**Môn học:** Thiết kế Web Nâng cao · Phenikaa University · 2026

</div>

---

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TypeORM Documentation](https://typeorm.io)
- Slide bài giảng môn Thiết kế Web Nâng cao — Giảng viên hướng dẫn

---

<!-- ═══════════════════════════════════════════════════
     ANIMATED FOOTER — Cinema Neon theme
════════════════════════════════════════════════════ -->
<div align="center">

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:2b1400,50:1a1005,100:0b0b0f&height=150&section=footer&text=PHIMPLAY24%20—%20Nhóm%204&fontSize=24&fontColor=f26522&animation=fadeIn&fontAlignY=65)

<p>
  <img src="https://img.shields.io/badge/Made%20with-❤️%20%26%20NestJS-E0234E?style=flat-square" alt="Made with NestJS"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Phimplay24-Nhóm%204-f26522?style=flat-square" alt="Phimplay24 Nhóm 4"/>
</p>

</div>
