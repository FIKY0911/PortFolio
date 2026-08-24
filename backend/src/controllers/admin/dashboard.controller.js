import { profileModel } from "../../models/profile.model.js";
import { toolModel } from "../../models/tool.model.js";
import { projectModel } from "../../models/project.model.js";
import { categoryModel } from "../../models/category.model.js";
import { certificateModel } from "../../models/certificate.model.js";
import { adminUserModel } from "../../models/adminUser.model.js";
import { renderAdmin } from "../../utils/helpers.js";

export async function index(_req, res) {
  const [tools, projects, categories, certificates, admins, profile] = await Promise.all([
    toolModel.count(),
    projectModel.count(),
    categoryModel.count(),
    certificateModel.count(),
    adminUserModel.count(),
    profileModel.get(),
  ]);

  renderAdmin(res, "dashboard/index.ejs", {
    title: "Dashboard",
    active: "dashboard",
    stats: { tools, projects, categories, certificates, admins, hasProfile: Boolean(profile), profileName: profile?.name ?? "" },
  });
}
