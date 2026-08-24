# Portfolio Backend — MVC Express + Admin Panel SSR

> REST API (`/api/v1`) + Admin Panel (`/admin`, EJS) untuk portfolio React.

---

## Menjalankan

```bash
cd backend
npm install
npm run db:push      # sinkronkan schema ke DB (sudah ada DB `portfolio`)
npm run db:seed      # isi data + salin aset ke public/uploads/
npm run dev          # server di http://localhost:3001 (auto-reload)
# atau: npm start    # tanpa watch
```

---

## Kredensial Admin (default dev)

| Field | Nilai |
|---|---|
| Username | `admin` |
| Password | `admin123` |

Diubah via `.env` → `ADMIN_USERNAME`, `ADMIN_PASSWORD`.

---

## Variabel Lingkungan (`.env`)

| Var | Default | Keterangan |
|---|---|---|
| `DATABASE_URL` | *(wajib)* | MySQL connection string (pakai `mysql://` — adapter MariaDB parse otomatis) |
| `PORT` | `3001` | Port server |
| `SESSION_SECRET` | *(wajib)* | Secret cookie session (generate random untuk prod) |
| `ADMIN_USERNAME` | `admin` | Username panel admin |
| `ADMIN_PASSWORD` | `admin123` | Password (bcrypt 12 rounds disimpan) |
| `API_WRITE_PUBLIC` | `true` | `false` → tutup mutasi `/api/v1` (403), tulis hanya via panel |

---

## Struktur Folder

```
backend/
├── prisma/
│   ├── schema.prisma        # skema DB (TIDAK DIBOLEH UBAH)
│   ├── seed.js              # isi data & aset
│   └── verify.js            # cek data seed
├── public/uploads/          # file statis (dilayani /uploads/)
├── src/
│   ├── config/              # env, prisma singleton, multer
│   ├── models/              # layer akses data (satu-satunya tempat query Prisma)
│   ├── controllers/
│   │   ├── api/             # REST JSON (/api/v1/*)
│   │   └── admin/           # SSR admin panel (/admin/*)
│   ├── routes/              # api.routes, admin.routes, index
│   ├── middlewares/         # auth, upload, flash, errorHandler, notFound
│   ├── utils/helpers.js     # validasi, HttpError, renderAdmin
│   ├── views/               # EJS (layout, partials, pages)
│   ├── app.js               # express app factory
│   └── server.js            # entry point + graceful shutdown
├── .env                     # secret lokal (gitignore)
├── .env.example
└── package.json
```

---

## Endpoint REST API (`/api/v1`)

Envelope sukses: `{ "success": true, "message"?: string, "data": ... }`  
Envelope gagal: `{ "success": false, "message": string, "errors"?: object }`

| Method | Path | Keterangan |
|---|---|---|
| GET | `/profile` | Profil tunggal |
| PUT | `/profile` | Update profil (JSON, `API_WRITE_PUBLIC=true`) |
| GET | `/tools` | List tools |
| GET | `/tools/:id` | Detail tool |
| POST | `/tools` | Create (multipart `image` atau JSON `imageUrl`) |
| PUT/PATCH | `/tools/:id` | Update |
| DELETE | `/tools/:id` | Delete |
| GET | `/projects` | List; filter `?category=<key>` |
| GET | `/projects/:id` | Detail + `category` object + `tools[]` |
| POST | `/projects` | Create (multipart `image`) |
| PUT/PATCH | `/projects/:id` | Update (sync `toolIds[]`) |
| DELETE | `/projects/:id` | Delete |
| GET | `/categories` | List + `projectCount` |
| GET | `/categories/:id` | Detail |
| POST | `/categories` | Create |
| PUT/PATCH | `/categories/:id` | Update |
| DELETE | `/categories/:id` | Delete (setNull ke project, bukan 409) |
| GET | `/certificates` | List |
| GET | `/certificates/:id` | Detail |
| POST | `/certificates` | Create (multipart `image`) |
| PUT/PATCH | `/certificates/:id` | Update |
| DELETE | `/certificates/:id` | Delete |

**Path gambar/CV yang dikembalikan API adalah relatif** (contoh: `/uploads/heroimage.webp`).

---

## Admin Panel (SSR)

- Akses: `http://localhost:3001/admin`
- Login session cookie (express-session + bcrypt)
- Semua route `/admin/*` (kecuali `/login`) dijaga `requireAuth` → redirect ke `/login`
- CRUD lengkap: Tools, Projects, Categories, Certificates
- Upload gambar: field `image` (validasi jpeg/png/webp/svg/pdf, max 5 MB, nama di-random)
- Profile: field `image` + `cv`
- Flash message session-based (sekali tampil, auto-hide 4 detik)
- EJS escaping wajib (`<%= %>`) → cegah XSS

---

## Self-Test Cepat

```bash
# 1. Jalankan server background
npm run dev &
sleep 2

# 2. Cek semua GET API
curl -s http://localhost:3001/api/v1/profile | jq .
curl -s http://localhost:3001/api/v1/tools | jq .
curl -s http://localhost:3001/api/v1/tools/1 | jq .
curl -s http://localhost:3001/api/v1/projects | jq .
curl -s http://localhost:3001/api/v1/projects/1 | jq .   # include category & tools
curl -s 'http://localhost:3001/api/v1/projects?category=web_app' | jq .
curl -s http://localhost:3001/api/v1/categories | jq .
curl -s http://localhost:3001/api/v1/certificates | jq .

# 3. Validasi 422
curl -s -X POST http://localhost:3001/api/v1/tools -H 'Content-Type: application/json' -d '{}' | jq .
# → {success:false, message:"Validasi gagal.", errors:{name:"..."}}

# 4. Flow admin via cookie jar
curl -s -c c.txt http://localhost:3001/admin          # 302 → /admin/login
curl -s -b c.txt -c c.txt -X POST http://localhost:3001/admin/login \
     -d 'username=admin&password=admin123'             # 302 → /admin/dashboard
curl -s -b c.txt http://localhost:3001/admin/dashboard # 200 HTML

# CRUD Tool test
curl -s -b c.txt -c c.txt -X POST http://localhost:3001/admin/tools \
     -F 'name=TestTool' -F 'keterangan=Beginner'       # 302 redirect
curl -s http://localhost:3001/api/v1/tools | jq '.data | last'
curl -s -b c.txt -c c.txt -X POST http://localhost:3001/admin/tools/10/delete  # hapus test
curl -s http://localhost:3001/api/v1/tools | jq 'length' # kembali count semula

# 5. Matikan server
pkill -f "src/server.js"
```

---

## Catatan Teknis

- **Prisma v7**: pakai `@prisma/adapter-mariadb`, import client dari `generated/prisma/client.ts` (Node 24 native type-stripping).
- **Skema DB**: ditentukan `prisma/schema.prisma` — **jangan diubah** oleh backend-dev. Perubahan skema → laporkan ke PM/database-dev.
- **Delete Project pivot**: `toolIds` sync via `set` Prisma; uncheck-all dikirim sebagai array kosong lewat hidden input.
- **Category delete**: skema memakai `onDelete: SetNull` → project tidak dihapus, hanya kehilangan kategori (berbeda dari kontrak 409).
- **CORS**: tidak dikonfigurasi (dev frontend via Vite proxy ke `http://localhost:3001`).

---

## Deploy Produksi (ringkas)

1. `API_WRITE_PUBLIC=false` — mutasi hanya lewat panel.
2. `SESSION_SECRET` → string random panjang.
3. Session store → Redis (express-session + connect-redis).
4. Reverse proxy (nginx/Caddy) → static `/uploads` + proxy API/panel.
5. HTTPS + `cookie.secure=true`.