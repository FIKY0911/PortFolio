import { env } from "../config/env.js";
import { HttpError } from "../utils/helpers.js";

/** guard session untuk semua route /admin kecuali login. Set res.locals.user utk view. */
export function requireAuth(req, res, next) {
  if (req.session?.adminId) {
    res.locals.user = req.session.adminUsername;
    return next();
  }
  return res.redirect("/admin/login");
}

/**
 * Rate-limit sederhana in-memory utk POST /admin/login (anti brute-force).
 * Maks 10 percobaan gagal / IP per 10 menit; sukses login mereset counter.
 * Cukup utk dev/single-instance; produksi multi-instance → pakai store terdistribusi.
 */
const attempts = new Map(); // ip → { count, firstAt }
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 10;

export function loginRateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const rec = attempts.get(key);

  if (rec && now - rec.firstAt < WINDOW_MS && rec.count >= MAX_FAILS) {
    return next(new HttpError(429, "Terlalu banyak percobaan login. Coba lagi dalam 10 menit."));
  }
  if (!rec || now - rec.firstAt >= WINDOW_MS) {
    attempts.set(key, { count: 0, firstAt: now });
  }

  res.on("finish", () => {
    if (res.statusCode === 302 && res.getHeader("location")?.includes("dashboard")) {
      attempts.delete(key); // login sukses → reset
    } else if (res.statusCode >= 200) {
      const cur = attempts.get(key);
      if (cur) cur.count += 1;
    }
  });
  next();
}

/** mutasi API publik bisa dimatikan via API_WRITE_PUBLIC=false (produksi) */
export function apiWriteGuard(_req, _res, next) {
  if (env.apiWritePublic) return next();
  return next(new HttpError(403, "Endpoint tulis nonaktif (API_WRITE_PUBLIC=false). Gunakan admin panel."));
}
