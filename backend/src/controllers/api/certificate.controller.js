import { certificateModel } from "../../models/certificate.model.js";
import { intParam, validateCertificate } from "../../utils/helpers.js";
import { deleteUpload } from "../../config/multer.js";

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function index(_req, res) {
  res.json({ success: true, data: await certificateModel.list() });
}

export async function show(req, res) {
  const certificate = await certificateModel.findById(intParam(req.params.id));
  if (!certificate) throw fail(404, "Certificate tidak ditemukan.");
  res.json({ success: true, data: certificate });
}

export async function store(req, res) {
  const { errors, data } = validateCertificate(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

  const certificate = await certificateModel.create(data);
  res.status(201).json({ success: true, message: "Certificate dibuat.", data: certificate });
}

export async function update(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await certificateModel.findById(id));
  if (!existing) throw fail(404, "Certificate tidak ditemukan.");

  const { errors, data } = validateCertificate(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });
  if (req.file) {
    data.imageUrl = `/uploads/${req.file.filename}`;
    deleteUpload(existing.imageUrl);
  }

  res.json({ success: true, message: "Certificate diperbarui.", data: await certificateModel.update(id, data) });
}

export async function destroy(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await certificateModel.findById(id));
  if (!existing) throw fail(404, "Certificate tidak ditemukan.");

  await certificateModel.remove(id);
  deleteUpload(existing.imageUrl);
  res.json({ success: true, message: `Certificate "${existing.title}" dihapus.` });
}
