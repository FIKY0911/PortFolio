# RFC-001: Backend Portfolio — MVC + CRUD Admin Panel

| | |
|---|---|
| **Penulis** | Wowo (PM & Architecture Lead) |
| **Status** | APPROVED |
| **Tanggal** | 2026-08-24 |
| **Scope** | Backend baru di folder `backend/` + integrasi frontend yang sudah ada |

---

## 1. Ringkasan

Membangun backend untuk portfolio React yang sudah ada, dengan:
- Arsitektur **MVC** (Model–View–Controller) pada Express.js
- **REST API JSON** (`/api/v1/*`) sebagai sumber data frontend
- **Admin Panel server-rendered** (EJS, gaya Laravel Filament/Breeze) di `/admin` untuk input data apa pun via browser
- **Prisma ORM v7** + **MySQL 8**
- Upload file gambar/CV (multer) → disajikan statis dari `/uploads`

## 2. Konteks & Masalah

Saat ini seluruh data portfolio di-hardcode di `src/data/data.jsx` dan dipipe ke Zustand store
(`src/store/dataStore.js`). Setiap perubahan konten memerlukan edit kode + redeploy.
Backend ini mengubah data menjadi dinamis: admin mengelola konten lewat UI backend.

## 3. Entitas Data (migrasi 1:1 dari frontend)

Sumber kebenaran struktur: `src/data/data.jsx`.

### 3.1 Profile (single record)
Frontend: `{ name, image_url, cv_url }`
DB: tabel `profile` — `name`, `imageUrl`, `cvUrl`. Satu baris saja.

### 3.2 Tool
Frontend: `{ id, name, image_url, keterangan }`
DB: tabel `tools` — `name` (unique), `imageUrl`, `keterangan` (enum-ish string: Beginner/Intermediate/Advanced).

### 3.3 Project
Frontend: `{ id, title, image_url, referance_url, github_url, descripstion, tools[] }`
DB: tabel `projects` — `title`, `imageUrl`, `referanceUrl`, `githubUrl`,
`description` (**keputusan kontrak: typo `descripstion` diperbaiki menjadi `description`;
pemetaan dilakukan di adapter dataStore frontend**), relasi opsional `categoryId`,
relasi many-to-many ke Tool via tabel pivot `project_tools`.

> ⚠️ Keputusan eksplisit: `descripstion` → `description`. Hanya dataStore yang memetakan,
> komponen lain tidak berubah. Terdokumentasi juga di API-CONTRACT.md §6.

### 3.4 Category
Frontend: `{ id, key, title }`
DB: tabel `categories` — `key` (unique, mis. `web_app`), `title`.
Project ↔ Category: opsional (nullable FK).

### 3.5 Certificate
Frontend: `{ id, title, image_url }`
DB: tabel `certificates` — `title`, `imageUrl`.

### 3.6 AdminUser (baru, internal)
Untuk login admin panel: `username` unique, `passwordHash` (bcrypt, 12 rounds).

### ERD ringkas
```
Profile        (1 row)
Tool           1 ──< ProjectTool >── 1 Project
Category       1 ──< Project (nullable)
Certificate    (standalone)
AdminUser      (auth only)
```

## 4. Arsitektur & Struktur Folder

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.js               # seed data dari frontend + salin aset
├── public/uploads/           # file upload (dilayani statis)
├── src/
│   ├── config/
│   │   ├── env.js            # baca env + validasi
│   │   ├── prisma.js         # singleton PrismaClient
│   │   └── multer.js         # config upload
│   ├── models/               # Layer Model: akses data via Prisma
│   │   ├── profile.model.js
│   │   ├── tool.model.js
│   │   ├── project.model.js
│   │   ├── category.model.js
│   │   ├── certificate.model.js
│   │   └── adminUser.model.js
│   ├── controllers/
│   │   ├── api/              # Controller REST JSON
│   │   └── admin/            # Controller SSR Admin Panel
│   ├── views/                # View EJS (admin panel)
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── partials/
│   ├── routes/
│   │   ├── index.js
│   │   ├── api.routes.js
│   │   └── admin.routes.js
│   ├── middlewares/
│   │   ├── auth.js           # guard session utk /admin
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── upload.js
│   ├── utils/helpers.js
│   ├── app.js
│   └── server.js
├── .env                      # DATABASE_URL, PORT, SESSION_SECRET, ADMIN_*
├── package.json
```

## 5. Keputusan Teknis (ADR)

| # | Keputusan | Alasan |
|---|---|---|
| ADR-1 | Express 5 + EJS untuk admin panel | MVC klasik ala Laravel (routes→controller→model, view engine SSR). EJS ringan & familiar. |
| ADR-2 | Session cookie auth (express-session + bcrypt) | Panel admin SSR butuh stateful auth; JWT overkill. MemoryStore cukup utk dev; catat upgrade Redis utk produksi. |
| ADR-3 | Multer utk upload; validasi mime (jpeg/png/webp/pdf) + max 5 MB; nama file di-random | Mencegah upload berbahaya; path disimpan relatif `/uploads/<file>` |
| ADR-4 | URL aset relatif (`/uploads/x.webp`) | Dev: vite proxy `/uploads`+`/api` → backend. Prod: reverse proxy sama-origin. Frontend tak perlu hardcode host. |
| ADR-5 | Seed menyalin aset asli dari `src/assets` ke `backend/public/uploads` | Portofolio tampil identik setelah migrasi |
| ADR-6 | Prisma v7 (`prisma@^7`) | Permintaan user. **PENTING**: verifikasi API generator/config terhadap paket v7 yang terpasang (v7 berbeda dari v6: rust-free client, prisma.config, dsb.) — jangan asumsi pola v6. |
| ADR-7 | CORS terbuka hanya untuk origin dev frontend; API read publik, write via admin panel | API GET publik; mutasi tetap lewat panel (session) |

## 6. Ruang Lingkup

### IN SCOPE
1. Scaffold `backend/` lengkap (Express 5, MVC, EJS).
2. Skema Prisma 7 + db push + seed (data & aset dari frontend).
3. REST API CRUD penuh: profile (R/U), tools, projects, categories, certificates (CRUD).
4. Admin Panel: login/logout, dashboard, halaman CRUD semua entitas + form upload gambar.
5. Middleware: auth guard, error handler, upload validator.
6. Integrasi frontend: dataStore fetch dari API + fallback ke data statis bila backend mati.
7. Smoke test end-to-end (curl + UI).

### OUT OF SCOPE (anti scope-creep)
- Multi-user / role management (cukup 1 akun admin).
- Menyimpan pesan Contact (tetap EmailJS).
- i18n konten database (teks terjemahan tetap di locale files).
- Deployment/CI-CD.
- Rich text editor / WYSIWYG.

## 7. Kriteria Rilis (Definition of Done)

1. `npm run dev` di `backend/` menyalakan server di port 3001 tanpa error.
2. Semua endpoint kontrak merespons sesuai `API-CONTRACT.md` (diverifikasi curl).
3. Login admin berfungsi; route `/admin/*` terproteksi (redirect ke login).
4. Create/read/update/delete tiap entitas via UI admin BERFUNGSI nyata (bukan stub).
5. Upload gambar tersimpan ke `backend/public/uploads` dan bisa diakses via URL.
6. Frontend menampilkan data dari API; jika backend mati → fallback statis tanpa crash.
7. `npx eslint .` backend lulus (jika dikonfigurasi minimal, boleh tanpa).
8. Tidak ada secret hardcoded di source (semua via `.env`; `.env.example` disediakan).

## 8. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| API Prisma 7 berbeda drastis dari v6 | Agen WAJIB membaca docs/help dari paket terpasang sebelum koding |
| Typo field frontend menyebabkan blank image | Kontrak field jelas + pemetaan terpusat di dataStore |
| MySQL belum punya DB `portfolio` | Database-dev membuat DB via `CREATE DATABASE` atau prisma db push |
