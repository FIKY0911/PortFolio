import { prisma } from "../config/prisma.js";

export const adminUserModel = {
  findByUsername: (username) => prisma.adminUser.findUnique({ where: { username } }),
  count: () => prisma.adminUser.count(),
};
