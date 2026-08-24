/**
 * verify.js — bukti client v7 bisa di-import dari script Node biasa
 * dan seluruh data seed masuk sesuai kontrak.
 */
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// adapter-mariadb menolak scheme "mysql://" → parse DATABASE_URL jadi opsi granular
function makeAdapter() {
  const url = new URL(process.env.DATABASE_URL);
  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    connectionLimit: 5,
  });
}
const prisma = new PrismaClient({ adapter: makeAdapter() });

const [profiles, tools, categories, projects, certificates, adminUsers, projectTools] =
  await Promise.all([
    prisma.profile.count(),
    prisma.tool.count(),
    prisma.category.count(),
    prisma.project.count(),
    prisma.certificate.count(),
    prisma.adminUser.count(),
    prisma.projectTool.count(),
  ]);

console.log("=== COUNTS ===");
console.log(JSON.stringify({ profiles, tools, categories, projects, certificates, admin_users: adminUsers, project_tools: projectTools }, null, 2));

const sample = await prisma.project.findFirst({
  where: { title: "Grocerystore" },
  include: { category: true, tools: { include: { tool: true } } },
});
console.log("=== SAMPLE PROJECT (include relasi) ===");
console.log(JSON.stringify(sample, null, 2));

await prisma.$disconnect();