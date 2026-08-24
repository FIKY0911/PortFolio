import { prisma } from "../config/prisma.js";

/** Error berstatus HTTP — diformat rapi oleh errorHandler (JSON utk /api, flash+redirect utk /admin). */
export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    if (errors) this.errors = errors;
  }
}

export const KETERANGAN = ["Beginner", "Intermediate", "Advanced"];

export const asStr = (v) => (v == null ? "" : String(v)).trim();

export function isUrl(s) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

/** param :id → integer positif; selain itu 404 agar tidak jatuh ke 500 Prisma */
export function intParam(raw) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(404, "Data tidak ditemukan.");
  return n;
}

const hasErrors = (errors) => Object.keys(errors).length > 0;

function reqStr(body, field, max, label, errors, data) {
  const val = asStr(body[field]);
  if (!val) errors[field] = `${label} wajib diisi.`;
  else if (val.length > max) errors[field] = `${label} maksimal ${max} karakter.`;
  else data[field] = val;
}

/** path gambar opsional yang dikirim via JSON ("" / absent = abaikan) */
function optPath(body, field, data) {
  if (body[field] !== undefined) data[field] = asStr(body[field]) || null;
}

export function validateProfile(body) {
  const errors = {};
  const data = {};
  reqStr(body, "name", 100, "Name", errors, data);
  return { errors: hasErrors(errors) ? errors : null, data };
}

export function validateTool(body) {
  const errors = {};
  const data = {};
  reqStr(body, "name", 100, "Name", errors, data);

  const ket = asStr(body.keterangan) || "Beginner";
  if (!KETERANGAN.includes(ket)) errors.keterangan = `Keterangan harus salah satu dari: ${KETERANGAN.join(", ")}.`;
  else data.keterangan = ket;

  optPath(body, "imageUrl", data);
  return { errors: hasErrors(errors) ? errors : null, data };
}

export async function validateProject(body) {
  const errors = {};
  const data = {};
  reqStr(body, "title", 150, "Title", errors, data);

  for (const f of ["referanceUrl", "githubUrl"]) {
    if (body[f] === undefined) continue;
    const val = asStr(body[f]);
    if (val && !isUrl(val)) errors[f] = `${f} harus URL valid (mis. https://example.com).`;
    else data[f] = val || null;
  }

  if (body.description !== undefined) data.description = asStr(body.description) || null;
  optPath(body, "imageUrl", data);

  if (body.categoryId !== undefined) {
    const raw = asStr(body.categoryId);
    if (raw === "") data.categoryId = null;
    else {
      const id = Number(raw);
      if (!Number.isInteger(id)) errors.categoryId = "CategoryId harus angka integer.";
      else if (!(await prisma.category.findUnique({ where: { id } })))
        errors.categoryId = `Category dengan id ${raw} tidak ditemukan.`;
      else data.categoryId = id;
    }
  }

  if (body.toolIds !== undefined) {
    // hidden input "" di form memastikan uncheck-all tetap terkirim → clear pivot
    const raws = (Array.isArray(body.toolIds) ? body.toolIds : [body.toolIds]).map(asStr).filter(Boolean);
    const ids = [...new Set(raws.map(Number))];
    if (ids.some((n) => !Number.isInteger(n) || n <= 0)) errors.toolIds = "toolIds harus array integer positif.";
    else {
      const found = await prisma.tool.count({ where: { id: { in: ids } } });
      if (found !== ids.length) errors.toolIds = "Satu atau lebih toolId tidak ditemukan.";
      else data.toolIds = ids; // model yang mengubah jadi connect/set pivot
    }
  }

  return { errors: hasErrors(errors) ? errors : null, data };
}

export function validateCategory(body) {
  const errors = {};
  const data = {};
  reqStr(body, "key", 100, "Key", errors, data);
  if (data.key && !/^[a-z0-9_-]+$/.test(data.key))
    errors.key = "Key hanya boleh huruf kecil, angka, tanda - dan _ (mis. web_app).";

  reqStr(body, "title", 100, "Title", errors, data);
  return { errors: hasErrors(errors) ? errors : null, data };
}

export function validateCertificate(body) {
  const errors = {};
  const data = {};
  reqStr(body, "title", 150, "Title", errors, data);
  optPath(body, "imageUrl", data);
  return { errors: hasErrors(errors) ? errors : null, data };
}

/** render halaman admin lewat layout bersama; body = "<folder>/<file>.ejs" relatif src/views/pages */
export function renderAdmin(res, body, data) {
  res.render("layouts/admin.layout.ejs", { body: `../pages/${body}`, ...data });
}
