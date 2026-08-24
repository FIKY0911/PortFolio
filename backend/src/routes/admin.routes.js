import { Router } from "express";
import * as auth from "../controllers/admin/auth.controller.js";
import * as dashboard from "../controllers/admin/dashboard.controller.js";
import * as adminProfile from "../controllers/admin/profile.controller.js";
import toolCrud from "../controllers/admin/tool.controller.js";
import projectCrud from "../controllers/admin/project.controller.js";
import categoryCrud from "../controllers/admin/category.controller.js";
import certificateCrud from "../controllers/admin/certificate.controller.js";
import { requireAuth, loginRateLimit } from "../middlewares/auth.js";
import { uploadImage, uploadProfileFiles } from "../middlewares/upload.js";

const r = Router();

// --- publik (sebelum guard) ---
r.get("/login", auth.loginPage);
r.post("/login", loginRateLimit, auth.login);
r.post("/logout", auth.logout);

// --- terproteksi ---
r.use(requireAuth);

r.get(["/", "/dashboard"], dashboard.index);

r.get("/profile", adminProfile.show);
r.post("/profile", uploadProfileFiles, adminProfile.update);

/** pasang route CRUD standar: index / create / store / edit / update / delete(POST eksplisit) */
function mount(prefix, crud) {
  r.get(prefix, crud.list);
  r.get(`${prefix}/create`, crud.createForm);
  r.post(prefix, uploadImage, crud.create);
  r.get(`${prefix}/:id/edit`, crud.editForm);
  r.post(`${prefix}/:id/update`, uploadImage, crud.update);
  r.post(`${prefix}/:id/delete`, crud.remove); // delete via form POST tanpa method-override
}

mount("/tools", toolCrud);
mount("/projects", projectCrud);
mount("/categories", categoryCrud);
mount("/certificates", certificateCrud);

export default r;
