# Security Audit Report — Portfolio Backend (Express 5 + EJS + Prisma)

**Tanggal**: 2026-08-24 · **Metode**: white-box (review kode) + black-box (curl ke localhost:3001)
**Scope**: authn/authz, upload, XSS, injection, session/config, info disclosure, CSRF, dependencies.
**Data uji**: semua dihapus setelah audit; uploads kembali 15 file semula.

---

## Tabel Temuan

| # | Severity | Lokasi | Deskripsi | Bukti | Rekomendasi |
|---|----------|--------|-----------|-------|-------------|
| 1 | **HIGH** | `src/config/env.js:9` + `.env` | Mutasi API publik **terbuka by default**: `API_WRITE_PUBLIC !== "false"` → true; `.env` tidak menset variabelnya. POST/PUT/PATCH/DELETE `/api/v1/*` bisa dilakukan tanpa login. `apiWriteGuard` ada & terpasang di semua route mutasi (`api.routes.js`), tapi default-nya no-op. | `curl -X POST /api/v1/tools -d '{"name":"AUDIT-TEST-TOOL"}'` → `201 {"success":true,...}` tanpa cookie | Set `API_WRITE_PUBLIC=false` di `.env`, dan/atau balik default env.js menjadi closed-by-default saat rilis |
| 2 | **HIGH → PATCHED** | `src/config/multer.js:54-57` (`deleteUpload`) | **Arbitrary file deletion via path traversal**: prefix-check `/uploads/` lalu `path.join(UPLOAD_DIR, "../..")`. Rantai: buat tool dgn `imageUrl:"/uploads/../../target"` via API terbuka (#1) → DELETE tool → file di luar uploads terhapus. Bisa menghapus source code. | Canary `backend/CANARY-AUDIT.txt` TERHAPUS via POST+DELETE API tanpa auth | ✅ Patch minimal diterapkan: resolve path + cek containment `p.startsWith(UPLOAD_DIR + path.sep)`. Diverifikasi ulang post-patch: canary aman, delete legit tetap 200 |
| 3 | **MED** | `src/config/multer.js:15` + `app.js:38` | **Stored XSS via SVG**: svg di-whitelist, disajikan inline `Content-Type: image/svg+xml` dari origin sama. `<script>` dalam SVG dieksekusi browser pengunjung langsung → JS same-origin (bisa panggil endpoint admin/API). Cookie httpOnly tak bisa dicuri langsung, tapi JS tetap bisa beraksi sebagai user. | Upload SVG berisi `<script>alert(document.cookie)</script>` → disajikan utuh dgn `image/svg+xml` | Dev: hapus `"image/svg+xml"` dari whitelist (konversi ke webp/png). Prod: layankan uploads dari domain terpisah / header `Content-Disposition: attachment` + CSP |
| 4 | **MED** | `admin.routes.js:16` (`POST /login`) | **Tidak ada rate limit / lockout** pada login. 12 percobaan gagal beruntun semua diproses (302), tidak ada throttling. bcrypt cost-12 memperlambat tapi brute-force online tetap mungkin. | Loop curl 12× gagal login → semua 302, tanpa delay/blok | Prod: `express-rate-limit` khusus route login (mis. 5 req/15 menit per IP) |
| 5 | **LOW/MED** | `src/config/multer.js:34-39` | Ekstensi dipercaya dari **mimetype deklaratif** (bukan magic bytes); isi file tak divalidasi. HTML berhasil disimpan sbg `.png`. Ditambah absennya `X-Content-Type-Options: nosniff`, sniffing di konteks embed tertentu mungkin. | `-F "image=@evil.html;type=image/png"` → tersimpan & dilayani `image/png` | Validasi magic bytes (mis. `file-type` pkg) atau minimal tambah header nosniff |
| 6 | **LOW** | `controllers/api/*.controller.js` `show()` (4 resource) | Invalid `:id` (abc/-1/0) → `intParam` return null → Prisma throw → **500 bukan 404**. Bukan injection (Prisma parameterize; payload `1 OR 1=1` juga hanya 500, response generik tanpa stack). `update()/destroy()` sudah benar (guard `id &&`). | `curl /api/v1/tools/abc` → 500 `{"success":false,"message":"Terjadi kesalahan pada server."}` | Early-return 404 jika `intParam` null di show(), atau biarkan (kosmetik) |
| 7 | **LOW** | semua form admin (views) | **Tanpa CSRF token**. Termitigasi besar oleh cookie `SameSite=Lax` (cross-site POST tidak membawa session cookie di browser modern); semua aksi mutasi admin memakai POST. Risiko lokal rendah. Prod: tambah csrf middleware (mis. csurf alternatif / token di hidden input) |
| 8 | **LOW** | `app.js` (global) | Info disclosure ringan: header `X-Powered-By: Express` tampil; tidak ada security headers (nosniff/CSP/HSTS). | `curl -I /admin/login` | `app.disable("x-powered-by")` + helmet (prod) |
| 9 | **HIGH(sev npm)/dev-only** | `package-lock.json` | `npm audit --omit=dev`: **3 high** — `deepmerge-ts <8.0.0` stack exhaustion, via `@prisma/config` ← CLI `prisma` (devDependency, chain migrasi saja, tidak dieksekusi runtime). | output `npm audit` | Upgrade prisma CLI saat rilis stabil; risiko runtime rendah karena dev-only |
| 10 | **INFO** | `.env` / `env.js:7` | Kredensial dev low-strength (admin/admin123) = keputusan terdokumentasi ✓ bukan temuan. Fallback `SESSION_SECRET` lemah ada di kode — pastikan `.env` produksi selalu set secret kuat (saat ini sudah: random 32-char). MemoryStore sesi: OK dev, wajib ganti store permanen di prod (memory leak/scale). | — | Hardening list di bawah |

## PASSED (diverifikasi bersih)

- ✅ Session fixation: `session.regenerate()` saat login — cookie ID berubah (black-box test)
- ✅ Logout: `session.destroy()` bersih
- ✅ Cookie: HttpOnly + SameSite=Lax; `saveUninitialized:false` (anonim tak dapat cookie)
- ✅ `requireAuth` menutup SEMUA route admin kecuali login/logout (302 terverifikasi)
- ✅ XSS/EJS: semua output dinamis pakai `<%= %>` (escaped); `<%- %>` hanya include partial statis; flash message di-escape
- ✅ Injection: nol raw query (`$queryRaw/$executeRaw` tidak ada); Prisma parameterize penuh
- ✅ passwordHash: tidak pernah keluar dari server (grep kode + probe semua GET endpoint)
- ✅ Error: stack trace tidak bocor ke client (JSON generik / flash redirect); log ke console only
- ✅ Upload filename: random hex (anti traversal/overwrite); limit 5MB; body limit 200kb
- ✅ `.env` gitignored & tidak ter-track git

## PATCH YANG DILAKUKAN

**File**: `backend/src/config/multer.js` (deleteUpload)
```diff
  export function deleteUpload(relPath) {
    if (!relPath || !relPath.startsWith("/uploads/")) return;
-   fs.promises.unlink(path.join(UPLOAD_DIR, relPath.slice("/uploads/".length))).catch(() => {});
+   const p = path.resolve(UPLOAD_DIR, relPath.slice("/uploads/".length));
+   // security: blok "../.." keluar dari UPLOAD_DIR (arbitrary file deletion)
+   if (!p.startsWith(UPLOAD_DIR + path.sep)) return;
+   fs.promises.unlink(p).catch(() => {});
  }
```
Alasan: kerentanan integritas file tingkat tinggi (hapus source code) yang bisa dipicu tanpa auth karena kombinasi dengan temuan #1. Patch defense-in-depth 2 baris, nol dampak ke path legit. Post-patch test: traversal diblok, CRUD normal jalan.

## VERDICT

### SAFE TO RUN (dev) — dengan syarat set `API_WRITE_PUBLIC=false` di .env bila frontend React belum butuh write-API
**NEEDS FIX sebelum rilis/publik** — item #1 (API write terbuka) & #3 (SVG XSS) wajib ditutup; #4 rate-limit sangat disarankan.

### Top-5 Hardening Produksi
1. `API_WRITE_PUBLIC=false` (+ pertimbangkan balik default env.js jadi closed)
2. Buang SVG dari whitelist upload / konversi otomatis ke raster
3. Rate-limit login + HTTPS → cookie `secure: true`
4. Ganti MemoryStore → Redis/store persisten; pastikan `SESSION_SECRET` kuat unik per-env
5. Helmet (nosniff, CSP, HSTS) + disable x-powered-by; upgrade prisma CLI (audit high)

---
*Auditor: Linus Torvalds (Security Auditing Specialist) — trio loop: Sec-Architect threat model alur data/API · Sec-Auditor review baris-per-baris src/* · Sec-Reviewer verifikasi OWASP/JWT-session/XSS/SQLi.*
