import { categoryModel } from "../../models/category.model.js";
import { validateCategory } from "../../utils/helpers.js";
import { makeCrud } from "./_crud.js";

export default makeCrud({
  model: categoryModel,
  base: "/admin/categories",
  view: "categories",
  label: "Category",
  plural: "Categories",
  active: "categories",
  validate: validateCategory,
  nameOf: (r) => r.title,
  // Category tidak punya file upload
});