import { prisma } from "../config/prisma.js";

export const profileModel = {
  get: () => prisma.profile.findFirst(),
  /** pastikan ada satu baris profil (single record) */
  async getOrCreate() {
    return (
      (await prisma.profile.findFirst()) ??
      prisma.profile.create({ data: { name: "" } })
    );
  },
  update: (id, data) => prisma.profile.update({ where: { id }, data }),
};
