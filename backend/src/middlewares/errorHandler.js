/** pesan ramah utk unique violation Prisma (v7 driver adapter: meta.driverAdapterError) */
function dupMessage(meta) {
  const idx =
    meta?.target ??
    meta?.driverAdapterError?.cause?.constraint?.index ??
    meta?.driverAdapterError?.cause?.originalMessage ??
    "";
  const s = Array.isArray(idx) ? idx.join(".") : String(idx);
  if (/name/i.test(s)) return "Nama sudah dipakai — gunakan nama lain.";
  if (/key/i.test(s)) return "Key sudah dipakai — gunakan key lain.";
  if (/username/i.test(s)) return "Username sudah dipakai.";
  return "Data duplikat: nilai unik ini sudah ada di database.";
}

/**
 * Error handler terpusat (harus paling akhir di app.js).
 * /api/*  → JSON { success:false, message, errors? }
 * lainnya → flash + redirect back (Referer), fallback halaman teks.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let status = err.status || 500;
  let message = err.status ? err.message : "Terjadi kesalahan pada server.";

  if (err.code === "P2002") {
    status = 422;
    message = dupMessage(err.meta);
  } else if (err.code === "P2025") {
    status = 404;
    message = "Data tidak ditemukan.";
  }

  console.error(`[error] ${req.method} ${req.originalUrl} → ${status}\n`, err.stack || err);

  if (req.path.startsWith("/api")) {
    const body = { success: false, message };
    if (err.errors) body.errors = err.errors;
    return res.status(status).json(body);
  }

  // SSR: kembalikan ke halaman sebelumnya dengan flash agar user tidak kehilangan konteks
  const back = req.get("referer") || "/admin";
  req.flash?.("error", message);
  return res.redirect(back);
}
