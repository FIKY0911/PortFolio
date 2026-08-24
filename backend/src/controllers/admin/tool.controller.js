import { toolModel } from "../../models/tool.model.js";
import { validateTool } from "../../utils/helpers.js";
import { makeCrud } from "./_crud.js";

export default makeCrud({
  model: toolModel,
  base: "/admin/tools",
  view: "tools",
  label: "Tool",
  plural: "Tools",
  active: "tools",
  validate: validateTool,
  nameOf: (r) => r.name,
  pathField: "imageUrl",
});