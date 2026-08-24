import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { HttpError } from "../utils/helpers.js";

export const UPLOAD_DIR = path.resolve(import.meta.dirname, "../../public/uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};
/** fallback utk client yang tidak mengirim MIME benar (mis. curl): whitelist ekstensi */
const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/**
 * Tentukan ekstensi aman utk file upload:
 * 1) percaya mimetype bila ada di whitelist;
 * 2) fallback ke ekstensi originalname bila juga whitelist.
 * return null jika tidak memenuhi → ditolak.
 */
function resolveSafeExt(file) {
  if (EXT_BY_MIME[file.mimetype]) return EXT_BY_MIME[file.mimetype];
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (ext && MIME_BY_EXT[ext]) return ext;
  return null;
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, crypto.randomBytes(12).toString("hex") + resolveSafeExt(file)),
  }),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) =>
    resolveSafeExt(file)
      ? cb(null, true)
      : cb(new HttpError(422, `Tipe file ${file.mimetype || "tidak dikenal"} tidak diizinkan (jpeg/png/webp/svg/pdf).`)),
});

/** hapus file upload berdasarkan path relatif "/uploads/<nama>" (best-effort) */
export function deleteUpload(relPath) {
  if (!relPath || !relPath.startsWith("/uploads/")) return;
  const p = path.resolve(UPLOAD_DIR, relPath.slice("/uploads/".length));
  // security: blok "../.." keluar dari UPLOAD_DIR (arbitrary file deletion)
  if (!p.startsWith(UPLOAD_DIR + path.sep)) return;
  fs.promises.unlink(p).catch(() => {});
}

/** buang file yang baru ter-upload saat validasi gagal (best-effort) */
export function discardUpload(file) {
  if (file) fs.promises.unlink(file.path).catch(() => {});
}
