import { projectModel } from "../../models/project.model.js";
import { toolModel } from "../../models/tool.model.js";
import { categoryModel } from "../../models/category.model.js";
import { validateProject } from "../../utils/helpers.js";
import { makeCrud } from "./_crud.js";

export default makeCrud({
  model: projectModel,
  base: "/admin/projects",
  view: "projects",
  label: "Project",
  plural: "Projects",
  active: "projects",
  validate: validateProject,
  nameOf: (r) => r.title,
  pathField: "imageUrl",
  /** form project butuh daftar categories + tools utk select & multi-checkbox */
  viewData: async () => ({
    categories: await categoryModel.list(),
    allTools: await toolModel.list(),
  }),
});