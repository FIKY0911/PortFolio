import { certificateModel } from "../../models/certificate.model.js";
import { validateCertificate } from "../../utils/helpers.js";
import { makeCrud } from "./_crud.js";

export default makeCrud({
  model: certificateModel,
  base: "/admin/certificates",
  view: "certificates",
  label: "Certificate",
  plural: "Certificates",
  active: "certificates",
  validate: validateCertificate,
  nameOf: (r) => r.title,
  pathField: "imageUrl",
});