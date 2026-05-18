# Architect Portfolio

Portfolio website cho kiến trúc sư — trang khách hiển thị dự án + form hỏi giá, trang admin để quản lý dự án/hồ sơ/yêu cầu khách.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** NestJS 10 + Prisma + PostgreSQL
- **Mail:** Nodemailer (Gmail SMTP / Resend / ...)
- **Upload ảnh:** Local disk (`backend/uploads`), serve qua `/uploads/*`

## Cấu trúc

```
architect-portfolio/
├── backend/      # NestJS API
├── frontend/     # Next.js app
└── docker-compose.yml
```

## Bước 1 — Khởi động PostgreSQL

```bash
docker compose up -d
```

Postgres sẽ chạy ở `localhost:5432`, user/pass/db = `postgres / postgres / architect`.

(Nếu không có Docker, cài Postgres local và sửa `DATABASE_URL` trong `backend/.env`.)

## Bước 2 — Backend

```bash
cd backend
cp .env.example .env
# Sửa SMTP_USER, SMTP_PASS, MAIL_TO trong .env nếu muốn gửi mail thật

npm install
npx prisma migrate dev --name init   # tạo bảng
npm run db:seed                      # tạo admin@example.com / changeme123 + 1 dự án demo
npm run start:dev
```

Backend chạy ở **http://localhost:4000**, API ở `/api/*`, ảnh upload ở `/uploads/*`.

### Cấu hình SMTP (Gmail)

1. Bật **2-Step Verification** trên Google account
2. Vào https://myaccount.google.com/apppasswords → tạo App Password (16 ký tự)
3. Đặt vào `.env`:
   ```
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   MAIL_TO=architect@example.com    # email kiến trúc sư nhận thông báo
   ```

Nếu chưa cấu hình SMTP, mail sẽ chỉ ghi ra log (vẫn dev được tính năng).

## Bước 3 — Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Mở **http://localhost:3000**.

- Trang khách: `/`, `/projects`, `/projects/[slug]`, `/contact`
- Trang admin: `/admin/login` (dùng `admin@example.com` / `changeme123`)

## Luồng gửi mail khi khách hỏi giá

1. Khách điền form ở `/contact` → `POST /api/inquiries`
2. NestJS lưu vào bảng `Inquiry`
3. NestJS gọi `MailService.sendInquiryNotification()` → gửi mail về `MAIL_TO`
4. Admin xem chi tiết và đổi trạng thái ở `/admin/inquiries`

## API endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/api/auth/login` | — | Đăng nhập admin |
| GET | `/api/auth/me` | ✓ | Hồ sơ admin |
| PATCH | `/api/auth/me` | ✓ | Cập nhật hồ sơ |
| GET | `/api/projects` | — | Danh sách dự án public |
| GET | `/api/projects/slug/:slug` | — | Chi tiết public |
| GET | `/api/projects/admin/all` | ✓ | Tất cả (kể cả ẩn) |
| POST | `/api/projects` | ✓ | Tạo dự án |
| PATCH | `/api/projects/:id` | ✓ | Sửa dự án |
| DELETE | `/api/projects/:id` | ✓ | Xoá |
| POST | `/api/inquiries` | — | Gửi yêu cầu (khách) |
| GET | `/api/inquiries` | ✓ | Danh sách |
| PATCH | `/api/inquiries/:id/status` | ✓ | Đổi trạng thái |
| DELETE | `/api/inquiries/:id` | ✓ | Xoá |
| POST | `/api/upload/images` | ✓ | Upload ảnh (multipart) |

## Code conventions

Cả `frontend/` và `backend/` đều có Prettier + ESLint config riêng. Scripts:

```bash
# Trong backend/ hoặc frontend/
npm run format         # Format tự động (write)
npm run format:check   # CI mode (chỉ check)
npm run lint           # Lint + auto-fix
npm run lint:check     # CI mode
npm run typecheck      # tsc --noEmit
```

Style: 2 spaces, single quote, trailing comma, print width 100, LF line endings (xem `.editorconfig`).

## Docker

### Chạy toàn bộ stack (db + backend + frontend)

```bash
docker compose --profile full up --build
```

### Chỉ chạy database (dev local)

```bash
docker compose up -d postgres
```

Backend và frontend tự build từ `backend/Dockerfile` và `frontend/Dockerfile` (multi-stage, non-root, tini). Next.js dùng `output: 'standalone'` cho image nhỏ.

## CI

GitHub Actions workflow ở `.github/workflows/ci.yml` chạy 3 job song song trên mỗi PR + push:

1. **Backend** — install, prisma generate, format check, lint, typecheck, prisma migrate (Postgres service), build
2. **Frontend** — install, format check, lint, typecheck, build
3. **Docker** — smoke build cả 2 image (chạy sau khi backend + frontend xanh)

Docker layer cache qua `type=gha` để rerun nhanh.

## Deploy gợi ý

- **Frontend (Next.js):** Vercel (free)
- **Backend + Postgres:** Railway / Render / Fly.io
- **Ảnh:** thay storage `local` bằng Cloudinary hoặc S3 khi production (sửa `upload.controller.ts`)

## Đổi mật khẩu admin

Sau khi seed, đổi mật khẩu admin bằng cách:

```bash
cd backend
SEED_ADMIN_PASSWORD="mat-khau-moi" npm run db:seed
```

Hoặc viết script `update-password.ts` tương tự `seed.ts`.
