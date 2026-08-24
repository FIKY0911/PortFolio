import { profileModel } from "../../models/profile.model.js";
import { validateProfile, asStr } from "../../utils/helpers.js";
import { deleteUpload } from "../../config/multer.js";

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function show(_req, res) {
  const profile = await profileModel.get();
  res.json({ success: true, data: profile });
}

export async function update(req, res) {
  const profile = await profileModel.getOrCreate();
  const { errors, data } = validateProfile(req.body);
  if (errors) throw Object.assign(new Error("Validasi gagal."), { status: 422, errors });

  // ambil imageUrl/cvUrl dari JSON body (multipart upload ditangani admin panel)
  for (const f of ["imageUrl", "cvUrl"]) if (req.body[f] !== undefined) data[f] = asStr(req.body[f]) || null;

  res.json({ success: true, message: "Profile diperbarui.", data: await profileModel.update(profile.id, data) });
}