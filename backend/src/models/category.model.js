import { prisma } from "../config/prisma.js";

/** _count.projects → projectCount sesuai kontrak API */
const shape = (c) => ({ ...c, projectCount: c._count.projects, _count: undefined });

export const categoryModel = {
  async list() {
    const rows = await prisma.category.findMany({
      include: { _count: { select: { projects: true } } },
      orderBy: { id: "asc" },
    });
    return rows.map(shape);
  },
  async findById(id) {
    const row = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } },
    });
    return row && shape(row);
  },
  create: (data) => prisma.category.create({ data }),
  update: (id, data) => prisma.category.update({ where: { id }, data }),
  remove: (id) => prisma.category.delete({ where: { id } }),
  count: () => prisma.category.count(),
};
