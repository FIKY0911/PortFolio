import { Router } from "express";
import apiRoutes from "./api.routes.js";
import adminRoutes from "./admin.routes.js";

const r = Router();

r.use("/api/v1", apiRoutes);
r.use("/admin", adminRoutes);
// root → panel admin (dashboard jika sudah login, else redirect ke login)
r.get("/", (_req, res) => res.redirect("/admin"));

export default r;
