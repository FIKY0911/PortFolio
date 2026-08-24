import { intParam, renderAdmin } from "../../utils/helpers.js";
import { deleteUpload, discardUpload } from "../../config/multer.js";

/**
 * Factory CRUD admin (list/create/edit/update/delete) utk resource sederhana.
 * cfg: { model, base, view, label, plural, active, validate, nameOf, pathField?, viewData? }
 *  - view      : folder view di src/views/pages/<view>/{index,form}.ejs
 *  - validate  : (body) => { errors|null, data }
 *  - nameOf    : nama record utk pesan flash
 *  - pathField : field path file upload (default "imageUrl")
 *  - viewData  : data ekstra utk form (mis. daftar tools & categories)
 */
export function makeCrud(cfg) {
  const pathField = cfg.pathField ?? "imageUrl";

  async function renderForm(res, locals) {
    renderAdmin(res, `${cfg.view}/form.ejs`, {
      title: locals.record ? `Edit ${cfg.label}` : `Tambah ${cfg.label}`,
      active: cfg.active,
      base: cfg.base,
      label: cfg.label,
      ...(cfg.viewData ? await cfg.viewData() : {}),
      ...locals,
    });
  }

  async function findOrRedirect(req) {
    const record = await cfg.model.findById(intParam(req.params.id));
    if (!record) req.flash("error", `${cfg.label} tidak ditemukan.`);
    return record;
  }

  return {
    async list(_req, res) {
      renderAdmin(res, `${cfg.view}/index.ejs`, {
        title: cfg.plural,
        active: cfg.active,
        base: cfg.base,
        label: cfg.label,
        records: await cfg.model.list(),
      });
    },

    createForm(_req, res) {
      renderForm(res, { record: null, errors: null, old: {} });
    },

    async editForm(req, res) {
      const record = await findOrRedirect(req);
      if (!record) return res.redirect(cfg.base);
      renderForm(res, { record, errors: null, old: {} });
    },

    async create(req, res) {
      const { errors, data } = await cfg.validate(req.body);
      if (errors) {
        discardUpload(req.file);
        return renderForm(res, { record: null, errors, old: req.body });
      }
      if (req.file) data[pathField] = `/uploads/${req.file.filename}`;

      const record = await cfg.model.create(data);
      req.flash("success", `${cfg.label} "${cfg.nameOf(record)}" berhasil ditambahkan.`);
      res.redirect(cfg.base);
    },

    async update(req, res) {
      const existing = await findOrRedirect(req);
      if (!existing) return res.redirect(cfg.base);

      const { errors, data } = await cfg.validate(req.body);
      if (errors) {
        discardUpload(req.file);
        return renderForm(res, { record: existing, errors, old: req.body });
      }
      if (req.file) {
        data[pathField] = `/uploads/${req.file.filename}`;
        deleteUpload(existing[pathField]);
      }

      const record = await cfg.model.update(existing.id, data);
      req.flash("success", `${cfg.label} "${cfg.nameOf(record)}" berhasil diperbarui.`);
      res.redirect(cfg.base);
    },

    async remove(req, res) {
      const record = await findOrRedirect(req);
      if (record) {
        await cfg.model.remove(record.id);
        deleteUpload(record[pathField]);
        req.flash("success", `${cfg.label} "${cfg.nameOf(record)}" berhasil dihapus.`);
      }
      res.redirect(cfg.base);
    },
  };
}
