import { prisma } from "../config/prisma.js";

export const certificateModel = {
  list: () => prisma.certificate.findMany({ orderBy: { id: "asc" } }),
  findById: (id) => prisma.certificate.findUnique({ where: { id } }),
  create: (data) => prisma.certificate.create({ data }),
  update: (id, data) => prisma.certificate.update({ where: { id }, data }),
  remove: (id) => prisma.certificate.delete({ where: { id } }),
  count: () => prisma.certificate.count(),
};
