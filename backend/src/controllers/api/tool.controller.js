import { toolModel } from "../../models/tool.model.js";
import { intParam, validateTool } from "../../utils/helpers.js";
import { deleteUpload } from "../../config/multer.js";

const notFound = () =>
  Object.assign(new Error("Tool tidak ditemukan."), { status: 404 });

export async function index(_req, res) {
  res.json({ success: true, data: await toolModel.list() });
}

export async function show(req, res) {
  const tool = await toolModel.findById(intParam(req.params.id));
  if (!tool) throw notFound();
  res.json({ success: true, data: tool });
}

/** POST — JSON atau multipart (field "image") */
export async function store(req, res) {
  const { errors, data } = validateTool(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

  const tool = await toolModel.create(data);
  res.status(201).json({ success: true, message: "Tool dibuat.", data: tool });
}

export async function update(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await toolModel.findById(id));
  if (!existing) throw notFound();

  const { errors, data } = validateTool(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });
  if (req.file) {
    data.imageUrl = `/uploads/${req.file.filename}`;
    deleteUpload(existing.imageUrl);
  }

  res.json({ success: true, message: "Tool diperbarui.", data: await toolModel.update(id, data) });
}

export async function destroy(req, res) {
  const id = intParam(req.params.id);
  const existing = id && (await toolModel.findById(id));
  if (!existing) throw notFound();

  await toolModel.remove(id);
  deleteUpload(existing.imageUrl);
  res.json({ success: true, message: `Tool "${existing.name}" dihapus.` });
}
