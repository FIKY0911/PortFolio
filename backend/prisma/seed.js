/**
 * seed.js — isi data awal identik dengan src/data/data.jsx
 * Idempotent: aman dijalankan berulang (upsert / skip-if-exists).
 * Juga menyalin aset frontend (src/assets/**) ke backend/public/uploads/.
 */
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

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

const ROOT = path.resolve(import.meta.dirname, "../.."); // repo root
const ASSETS = path.join(ROOT, "src/assets");
const UPLOADS = path.join(import.meta.dirname, "../public/uploads");

// [sumber relatif src/assets] → [nama file tujuan di public/uploads]
const ASSET_COPY = [
  ["hero/heroimage.webp", "heroimage.webp"],
  ["cv_sertif/CV Mohamad Fiky.pdf", "cv-mohamad-fiky.pdf"],
  ["tools/Html-tools.webp", "html-tools.webp"],
  ["tools/Css-tools.webp", "css-tools.webp"],
  ["tools/JS-tools.webp", "js-tools.webp"],
  ["tools/next-js-tools.webp", "next-js-tools.webp"],
  ["tools/Typescript-tools.webp", "typescript-tools.webp"],
  ["tools/clrek-tools.webp", "clerk-tools.webp"],
  ["tools/tailwind-css-tools.webp", "tailwind-css-tools.webp"],
  ["tools/react-logo.webp", "react-logo.webp"],
  ["project/GroceryStrore.webp", "project-grocerystore.webp"],
  ["project/CoffeShop.webp", "project-coffeshop.webp"],
  ["project/Relecta.webp", "project-relecta.webp"],
  ["sertifikat/Mohamad Fiky Ba'dafitro - Semi Finalist_page-0001.jpg", "cert-semi-finalist.jpg"],
  ["sertifikat/Mohamad Fiky Ba'dafitro - SolveIT Together.jpeg", "cert-solveit.jpg"],
];

function copyAssets() {
  fs.mkdirSync(UPLOADS, { recursive: true });
  for (const [src, dest] of ASSET_COPY) {
    const from = path.join(ASSETS, src);
    const to = path.join(UPLOADS, dest);
    if (!fs.existsSync(from)) {
      console.warn(`⚠️  skip (tidak ada): ${src}`);
      continue;
    }
    if (!fs.existsSync(to)) fs.copyFileSync(from, to);
  }
  console.log(`✅ Aset tersalin ke public/uploads (${ASSET_COPY.length} file)`);
}

// cocokkan tool by lowercase → typo "Typescript"/"Tailwind" di data.jsx tetap match
async function toolIds(names) {
  const all = await prisma.tool.findMany();
  return names.map((n) => {
    const t = all.find((x) => x.name.toLowerCase() === n.toLowerCase());
    if (!t) throw new Error(`Tool tidak ditemukan: "${n}"`);
    return { id: t.id };
  });
}

async function main() {
  copyAssets();

  await prisma.profile.upsert({
    where: { id: 1 },
    create: { name: "Fiky", imageUrl: "/uploads/heroimage.webp", cvUrl: "/uploads/cv-mohamad-fiky.pdf" },
    update: {},
  });

  const tools = [
    { name: "Nextjs", imageUrl: "/uploads/next-js-tools.webp", keterangan: "Beginner" },
    { name: "TypeScript", imageUrl: "/uploads/typescript-tools.webp", keterangan: "Beginner" },
    { name: "Clerk", imageUrl: "/uploads/clerk-tools.webp", keterangan: "Beginner" },
    { name: "Tailwind Css", imageUrl: "/uploads/tailwind-css-tools.webp", keterangan: "Beginner" },
    { name: "Html", imageUrl: "/uploads/html-tools.webp", keterangan: "Advanced" },
    { name: "Css", imageUrl: "/uploads/css-tools.webp", keterangan: "Intermediate" },
    { name: "Javascript", imageUrl: "/uploads/js-tools.webp", keterangan: "Beginner" },
    { name: "React", imageUrl: "/uploads/react-logo.webp", keterangan: "Beginner" },
    { name: "Git", imageUrl: null, keterangan: "Beginner" },
  ];
  for (const t of tools) {
    await prisma.tool.upsert({ where: { name: t.name }, create: t, update: {} });
  }

  const cat = await prisma.category.upsert({
    where: { key: "web_app" },
    create: { key: "web_app", title: "Web Application" },
    update: {},
  });

  const projects = [
    {
      title: "Grocerystore",
      imageUrl: "/uploads/project-grocerystore.webp",
      referanceUrl: "https://grocerystore-rpl-kel13.vercel.app/",
      githubUrl: "",
      description:
        "Grocerystore merupakan sebuah E-commerce yang menjual berbagai macam kebutuhan pokok sehari-hari. Grocerystore dibuat sebagai tugas project Rekayasa Perangkat Lunak.",
      tools: ["Nextjs", "TypeScript", "Clerk", "Tailwind Css"],
    },
    {
      title: "Coffeshop",
      imageUrl: "/uploads/project-coffeshop.webp",
      referanceUrl: "https://tugas-bahasa-pemrograman.vercel.app/",
      githubUrl: "",
      description:
        "CoffeShop merupakan sebuah website yang menjual berbagai macam kopi. Coffeshop dibuat sebagai tugas project Bahasa Pemrograman.",
      tools: ["Html", "Css", "Javascript"],
    },
    {
      title: "Relecta",
      imageUrl: "/uploads/project-relecta.webp",
      referanceUrl: "https://relecta-ui.vercel.app//",
      githubUrl: "",
      description:
        "Relecta merupakan sebuah website yang digunakan untuk melakukan pengumpalan sampah Elektronik untuk disortir kembali, dan barang yang rusak secara total akan diserahkan ke pemerintah. Relecta dibuat untuk perlombaan IndoCeis.",
      // data.jsx memakai nama "Typescript" & "Tailwind" — dicocokkan by lowercase, tanpa duplikat tool
      tools: ["Html", "TypeScript", "Tailwind Css", "React"],
    },
  ];
  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: projects.indexOf(p) + 1 },
      create: {
        title: p.title,
        imageUrl: p.imageUrl,
        referanceUrl: p.referanceUrl,
        githubUrl: p.githubUrl,
        description: p.description,
        categoryId: cat.id,
        tools: { create: (await toolIds(p.tools)).map((t) => ({ toolId: t.id })) },
      },
      update: {},
    });
  }

  const certs = [
    { title: "Semi Finalist Certificate", imageUrl: "/uploads/cert-semi-finalist.jpg" },
    { title: "SolveIT Together Certificate", imageUrl: "/uploads/cert-solveit.jpg" },
  ];
  for (const c of certs) {
    await prisma.certificate.upsert({ where: { id: certs.indexOf(c) + 1 }, create: c, update: {} });
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existingAdmin = await prisma.adminUser.findUnique({ where: { username } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: { username, passwordHash: bcrypt.hashSync(password, 12) },
    });
  }

  console.log("✅ Seed selesai.");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());