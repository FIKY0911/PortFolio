# API CONTRACT — Portfolio Backend v1

| | |
|---|---|
| **Base URL (dev)** | `http://localhost:3001` |
| **Auth** | REST API: publik untuk GET, tanpa auth. Mutasi via Admin Panel (`/admin`, session cookie). |
| **Content-Type** | `application/json` kecuali endpoint upload (`multipart/form-data`) |
| **Format error** | `{ "success": false, "message": string, "errors"?: object }` |
| **Format sukses** | `{ "success": true, "message"?: string, "data": ... }` |

---

## 1. Konvensi

- Semua path gambar/CV yang dikembalikan API adalah **relatif**: `/uploads/<filename>`.
  Frontend memakai langsung (via vite proxy) atau prepend base URL di produksi.
- Timestamps: setiap resource punya `createdAt`, `updatedAt` (ISO 8601).
- Status code standar: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 422 Validation, 500 Server Error.

## 2. Field Mapping (frontend → API)

| Frontend (`data.jsx`) | API JSON | Catatan |
|---|---|---|
| `image_url` | `imageUrl` | camelCase |
| `cv_url` | `cvUrl` | camelCase |
| `referance_url` | `referanceUrl` | nama dipertahankan sesuai frontend (tanpa typo baru) |
| `descripstion` ❌ | `description` ✅ | **typo diperbaiki**; dataStore frontend yang memetakan kembali |
| `keterangan` | `keterangan` | tetap (istilah level: Beginner/Intermediate/Advanced) |
| `tools: string[]` | `tools: ToolSummary[]` | array objek `{ id, name }`; input create/update pakai `toolIds: number[]` |

## 3. Endpoints — Profile

### GET `/api/v1/profile`
200 →
```json
{ "success": true, "data": { "id": 1, "name": "Fiky", "imageUrl": "/uploads/heroimage.webp", "cvUrl": "/uploads/cv.pdf", "createdAt": "...", "updatedAt": "..." } }
```

### PUT `/api/v1/profile` *(admin panel saja; disediakan utk kelengkapan kontrak)*
Body JSON: `{ "name", "imageUrl?", "cvUrl?" }` → 200 + data terbaru.

## 4. Endpoints — Tools

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/v1/tools` | List semua tools |
| GET | `/api/v1/tools/:id` | Detail tool |
| POST | `/api/v1/tools` | Create (JSON atau multipart dengan `image`) |
| PUT/PATCH | `/api/v1/tools/:id` | Update |
| DELETE | `/api/v1/tools/:id` | Delete |

Resource Tool:
```json
{ "id": 5, "name": "Html", "imageUrl": "/uploads/html.webp", "keterangan": "Advanced", "createdAt": "...", "updatedAt": "..." }
```
Validasi POST/PUT:
- `name`: required, string 1–100, unik
- `keterangan`: opsional, salah satu dari `Beginner|Intermediate|Advanced` (default `Beginner`)
- `image` (multipart): opsional; jpeg/png/webp/svg; ≤ 5 MB
- `imageUrl` (JSON): opsional string path

## 5. Endpoints — Projects

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/v1/projects` | List; support query `?category=web_app` |
| GET | `/api/v1/projects/:id` | Detail |
| POST | `/api/v1/projects` | Create (multipart: field `image`) |
| PUT/PATCH | `/api/v1/projects/:id` | Update |
| DELETE | `/api/v1/projects/:id` | Delete |

Resource Project:
```json
{
  "id": 1,
  "title": "Grocerystore",
  "imageUrl": "/uploads/grocerystore.webp",
  "referanceUrl": "https://grocerystore-rpl-kel13.vercel.app/",
  "githubUrl": "",
  "description": "Grocerystore merupakan sebuah E-commerce ...",
  "categoryId": 1,
  "category": { "id": 1, "key": "web_app", "title": "Web Application" },
  "tools": [ { "id": 3, "name": "Next js" }, { "id": 2, "name": "TypeScript" } ],
  "createdAt": "...", "updatedAt": "..."
}
```
Validasi:
- `title`: required, 1–150
- `referanceUrl`, `githubUrl`: opsional, harus URL valid jika diisi
- `description`: opsional string (text)
- `categoryId`: opsional; harus ada di tabel categories jika diisi
- `toolIds`: opsional array of int (sync pivot)

## 6. Endpoints — Categories

| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/v1/categories` | List |
| GET | `/api/v1/categories/:id` | Detail |
| POST | `/api/v1/categories` | Create |
| PUT/PATCH | `/api/v1/categories/:id` | Update |
| DELETE | `/api/v1/categories/:id` | Delete (gagal 409 jika masih dipakai project) |

Resource:
```json
{ "id": 1, "key": "web_app", "title": "Web Application", "projectCount": 3 }
```

## 7. Endpoints — Certificates

CRUD penuh: `GET /api/v1/certificates`, `GET /:id`, POST, PUT/PATCH `/:id`, DELETE `/:id`.
```json
{ "id": 1, "title": "Semi Finalist Certificate", "imageUrl": "/uploads/sertif1.jpg" }
```

## 8. Admin Panel Routes (SSR, EJS — bukan JSON)

| Method | Path | Keterangan |
|---|---|---|
| GET | `/admin/login` | Form login |
| POST | `/admin/login` | Proses login (session cookie) |
| POST | `/admin/logout` | Hapus session |
| GET | `/admin` | Dashboard (statistik jumlah record per entitas) |
| * | `/admin/profile` | Edit profil (form) |
| * | `/admin/tools` (+`/create`,`/:id/edit`) | CRUD Tools |
| * | `/admin/projects` (+`/create`,`/:id/edit`) | CRUD Projects (multi-select tools, select category, upload image) |
| * | `/admin/categories` (+...) | CRUD Categories |
| * | `/admin/certificates` (+...) | CRUD Certificates |

Aturan panel:
- Semua route `/admin/*` (kecuali login) dijaga middleware `requireAuth` → redirect `/admin/login`.
- Aksi delete via form POST (dengan method override `_method=DELETE` atau route POST eksplisit).
- Feedback via flash message sederhana (query param atau session flash).
- EJS gunakan `<%= %>` (escaped) untuk semua data user → cegah XSS.

## 9. Statis

- `GET /uploads/*` → file dari `backend/public/uploads`.

## 10. Contoh Seed (harus identik dgn data frontend saat ini)

- Profile: Fiky + hero image + CV.
- 9 Tools: Nextjs, TypeScript, Clerk, Tailwind Css, Html, Css, Javascript, React, Git (Git imageUrl kosong).
- 3 Projects: Grocerystore, Coffeshop, Relecta (+ relasi tools sesuai array di data.jsx).
- 1 Category: web_app / Web Application (ketiga project categoryId=1).
- 2 Certificates: Semi Finalist Certificate, SolveIT Together Certificate.
- 1 AdminUser: username & password dari env `ADMIN_USERNAME`/`ADMIN_PASSWORD` (default dev: `admin`/`admin123`), bcrypt hash.
