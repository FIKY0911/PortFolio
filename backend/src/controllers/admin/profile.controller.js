import { profileModel } from "../../models/profile.model.js";
import { validateProfile, renderAdmin } from "../../utils/helpers.js";
import { deleteUpload, discardUpload } from "../../config/multer.js";

function form(res, locals) {
  renderAdmin(res, "profile/edit.ejs", { title: "Profil", active: "profile", ...locals });
}

export async function show(_req, res) {
  form(res, { profile: await profileModel.getOrCreate(), errors: {}, old: {} });
}

export async function update(req, res) {
  const profile = await profileModel.getOrCreate();
  const image = req.files?.image?.[0];
  const cv = req.files?.cv?.[0];

  const { errors, data } = validateProfile(req.body);
  if (errors) {
    discardUpload(image);
    discardUpload(cv);
    return form(res, { profile, errors, old: req.body });
  }

  for (const [file, field, current] of [
    [image, "imageUrl", profile.imageUrl],
    [cv, "cvUrl", profile.cvUrl],
  ]) {
    if (file) {
      data[field] = `/uploads/${file.filename}`;
      deleteUpload(current); // hapus file lama yang direplace (best-effort)
    }
  }

  await profileModel.update(profile.id, data);
  req.flash("success", "Profil berhasil diperbarui.");
  res.redirect("/admin/profile");
}
