import { projectModel } from "../../models/project.model.js";
import { intParam, validateProject } from "../../utils/helpers.js";
import { deleteUpload } from "../../config/multer.js";

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function index(req, res) {
  // support ?category=<key>
  res.json({ success: true, data: await projectModel.list({ categoryKey: req.query.category }) });
}

export async function show(req, res) {
  const project = await projectModel.findById(intParam(req.params.id));
  if (!project) throw fail(404, "Project tidak ditemukan.");
  res.json({ success: true, data: project });
}

export async function store(req, res) {
  const { errors, data } = await validateProject(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

  const project = await projectModel.create(data);
  res.status(201).json({ success: true, message: "Project dibuat.", data: project });
}

export async function update(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await projectModel.findById(id));
  if (!existing) throw fail(404, "Project tidak ditemukan.");

  const { errors, data } = await validateProject(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });
  if (req.file) {
    data.imageUrl = `/uploads/${req.file.filename}`;
    deleteUpload(existing.imageUrl);
  }

  res.json({ success: true, message: "Project diperbarui.", data: await projectModel.update(id, data) });
}

export async function destroy(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await projectModel.findById(id));
  if (!existing) throw fail(404, "Project tidak ditemukan.");

  await projectModel.remove(id);
  deleteUpload(existing.imageUrl);
  res.json({ success: true, message: `Project "${existing.title}" dihapus.` });
}