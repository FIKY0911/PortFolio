import { prisma } from "../config/prisma.js";

export const toolModel = {
  list: () => prisma.tool.findMany({ orderBy: { id: "asc" } }),
  findById: (id) => prisma.tool.findUnique({ where: { id } }),
  create: (data) => prisma.tool.create({ data }),
  update: (id, data) => prisma.tool.update({ where: { id }, data }),
  remove: (id) => prisma.tool.delete({ where: { id } }),
  count: () => prisma.tool.count(),
};
