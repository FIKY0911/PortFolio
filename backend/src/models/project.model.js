import { prisma } from "../config/prisma.js";

// pivot ProjectTool di-flatten → tools: [{id,name}] sesuai kontrak
const INCLUDE = {
  category: true,
  tools: { include: { tool: { select: { id: true, name: true } } } },
};
const shape = (p) => p && { ...p, tools: p.tools.map((t) => t.tool) };

export const projectModel = {
  /** @param {{categoryKey?: string}} opts filter ?category=<key> */
  async list({ categoryKey } = {}) {
    const rows = await prisma.project.findMany({
      where: categoryKey ? { category: { key: categoryKey } } : undefined,
      include: INCLUDE,
      orderBy: { id: "asc" },
    });
    return rows.map(shape);
  },
  async findById(id) {
    return shape(
      await prisma.project.findUnique({ where: { id }, include: INCLUDE })
    );
  },
  /**
   * attrs.toolIds (array int) → isi pivot saat create.
   * Catatan: relasi ini EXPLICIT m2m (model pivot ProjectTool ada di schema),
   * jadi nested write yang valid adalah create/deleteMany di pivot,
   * bukan connect/set (khusus implicit m2m).
   */
  create({ toolIds, ...data }) {
    if (toolIds) data.tools = { create: toolIds.map((toolId) => ({ toolId })) };
    return prisma.project.create({ data, include: INCLUDE }).then(shape);
  },
  /** attrs.toolIds → sync (replace semua baris pivot) saat update */
  update(id, { toolIds, ...data }) {
    if (toolIds) data.tools = { deleteMany: {}, create: toolIds.map((toolId) => ({ toolId })) };
    return prisma.project.update({ where: { id }, data, include: INCLUDE }).then(shape);
  },
  remove: (id) => prisma.project.delete({ where: { id } }),
  count: () => prisma.project.count(),
};
