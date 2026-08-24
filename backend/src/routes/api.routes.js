import { Router } from "express";
import * as apiProfile from "../controllers/api/profile.controller.js";
import * as apiTool from "../controllers/api/tool.controller.js";
import * as apiProject from "../controllers/api/project.controller.js";
import * as apiCategory from "../controllers/api/category.controller.js";
import * as apiCertificate from "../controllers/api/certificate.controller.js";
import { apiWriteGuard } from "../middlewares/auth.js";
import { uploadImage } from "../middlewares/upload.js";

const r = Router();

// --- Profile ---
r.get("/profile", apiProfile.show);
r.put("/profile", apiWriteGuard, apiProfile.update);

// --- Tools ---
r.get("/tools", apiTool.index);
r.get("/tools/:id", apiTool.show);
r.post("/tools", apiWriteGuard, uploadImage, apiTool.store);
r.put("/tools/:id", apiWriteGuard, uploadImage, apiTool.update);
r.patch("/tools/:id", apiWriteGuard, uploadImage, apiTool.update);
r.delete("/tools/:id", apiWriteGuard, apiTool.destroy);

// --- Projects (?category=<key> filter) ---
r.get("/projects", apiProject.index);
r.get("/projects/:id", apiProject.show);
r.post("/projects", apiWriteGuard, uploadImage, apiProject.store);
r.put("/projects/:id", apiWriteGuard, uploadImage, apiProject.update);
r.patch("/projects/:id", apiWriteGuard, uploadImage, apiProject.update);
r.delete("/projects/:id", apiWriteGuard, apiProject.destroy);

// --- Categories ---
r.get("/categories", apiCategory.index);
r.get("/categories/:id", apiCategory.show);
r.post("/categories", apiWriteGuard, apiCategory.store);
r.put("/categories/:id", apiWriteGuard, apiCategory.update);
r.patch("/categories/:id", apiWriteGuard, apiCategory.update);
r.delete("/categories/:id", apiWriteGuard, apiCategory.destroy);

// --- Certificates ---
r.get("/certificates", apiCertificate.index);
r.get("/certificates/:id", apiCertificate.show);
r.post("/certificates", apiWriteGuard, uploadImage, apiCertificate.store);
r.put("/certificates/:id", apiWriteGuard, uploadImage, apiCertificate.update);
r.patch("/certificates/:id", apiWriteGuard, uploadImage, apiCertificate.update);
r.delete("/certificates/:id", apiWriteGuard, apiCertificate.destroy);

export default r;
