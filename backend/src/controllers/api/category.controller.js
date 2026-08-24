import { categoryModel } from "../../models/category.model.js";
import { intParam, validateCategory } from "../../utils/helpers.js";

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function index(_req, res) {
  res.json({ success: true, data: await categoryModel.list() });
}

export async function show(req, res) {
  const category = await categoryModel.findById(intParam(req.params.id));
  if (!category) throw fail(404, "Category tidak ditemukan.");
  res.json({ success: true, data: category });
}

export async function store(req, res) {
  const { errors, data } = validateCategory(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });

  const category = await categoryModel.create(data);
  res.status(201).json({ success: true, message: "Category dibuat.", data: category });
}

export async function update(req, res) {
  const id = intParam(req.params.id);
  if (!id || !(await categoryModel.findById(id))) throw fail(404, "Category tidak ditemukan.");

  const { errors, data } = validateCategory(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });

  res.json({ success: true, message: "Category diperbarui.", data: await categoryModel.update(id, data) });
}

/**
 * DELETE — skema DB memakai onDelete: SetNull utk projects.categoryId,
 * jadi kategori yang masih dipakai tetap bisa dihapus (project kehilangan kategori).
 */
export async function destroy(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await categoryModel.findById(id));
  if (!existing) throw fail(404, "Category tidak ditemukan.");

  await categoryModel.remove(id);
  res.json({ success: true, message: `Category "${existing.title}" dihapus.` });
}
