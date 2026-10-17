/**
 * data.jsx
 * ========
 * File data statis untuk aplikasi portfolio.
 * Berisi semua data yang ditampilkan di aplikasi (tidak menggunakan API/backend).
 */

import HeroImage from "../assets/hero/heroimage.webp"


import Javascript from "../assets/tools/JS-tools_compressed.webp"
import Nextjs from "../assets/tools/next-js-tools_compressed.webp"
import TypeScript from "../assets/tools/Typescript-tools_compressed.webp"
import Clerk from "../assets/tools/clrek-tools_compressed.webp"
import Tailwind from "../assets/tools/tailwind-css-tools_compressed.webp"
import React from "../assets/tools/react-logo_compressed.webp"
import Project1 from "../assets/project/GroceryStrore.webp"
import Project2 from "../assets/project/CoffeShop.webp"
import Project3 from "../assets/project/Relecta.webp"
import CVFile from "../assets/cv_sertif/CV - Mohamad Fiky.pdf"
import Sertif1 from "../assets/sertifikat/Mohamad Fiky Ba'dafitro - Semi Finalist_page-0001_compressed.jpg"
import Sertif2 from "../assets/sertifikat/Mohamad Fiky Ba'dafitro - SolveIT Together.jpeg"

// Gambar untuk HeroSection
export const Image = {
  HeroImage,
};

// Data profil untuk HeroSection
export const profileData = {
  name: "Fiky",
  image_url: HeroImage,
  cv_url: CVFile,
};

// List tools/teknologi yang dikuasai
export const listTools = [
  { id: 1, name: "React.js", image_url: React, keterangan: "Advanced" },
  { id: 2, name: "Next.js", image_url: Nextjs, keterangan: "Intermediate" },
  { id: 3, name: "TypeScript", image_url: TypeScript, keterangan: "Intermediate" },
  { id: 4, name: "JavaScript (ES6+)", image_url: Javascript, keterangan: "Advanced" },


  { id: 5, name: "Tailwind CSS", image_url: Tailwind, keterangan: "Advanced" },
  { id: 6, name: "Node.js", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", keterangan: "Intermediate" },
  { id: 7, name: "Express.js", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", keterangan: "Intermediate" },
  { id: 8, name: "PostgreSQL", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg", keterangan: "Intermediate" },
  { id: 9, name: "MySQL", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg", keterangan: "Intermediate" },
  { id: 10, name: "Prisma ORM", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg", keterangan: "Intermediate" },
  { id: 11, name: "Git & GitHub", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", keterangan: "Advanced" },
  { id: 12, name: "Clerk Auth", image_url: Clerk, keterangan: "Intermediate" },
  { id: 13, name: "Docker", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", keterangan: "Beginner" },
  { id: 14, name: "Postman", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg", keterangan: "Intermediate" },
  { id: 15, name: "Sanity CMS", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sanity/sanity-original.svg", keterangan: "Intermediate" },
  { id: 16, name: "Vercel", image_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", keterangan: "Advanced" }
];

// List portfolio project
export const listProject = [
  {
    id: 1,
    title: "Grocerystore",
    image_url: Project1,
    referance_url: "https://grocerystore-rpl-kel13.vercel.app/",
    github_url: "",
    descripstion: "Grocerystore merupakan sebuah E-commerce yang menjual berbagai macam kebutuhan pokok sehari-hari. Grocerystore dibuat sebagai tugas project Rekayasa Perangkat Lunak.",
    tools: ["Next js", "TypeScript", "Clerk", "Tailwind"],
  },
  {
    id: 2,
    title: "Coffeshop",
    image_url: Project2,
    referance_url: "https://tugas-bahasa-pemrograman.vercel.app/",
    github_url: "",
    descripstion: "CoffeShop merupakan sebuah website yang menjual berbagai macam kopi. Coffeshop dibuat sebagai tugas project Bahasa Pemrograman.",
    tools: ["Html", "Css", "Javascript"],
  },
  {
    id: 3,
    title: "Relecta",
    image_url: Project3,
    referance_url: "https://relecta-ui.vercel.app//",
    github_url: "",
    descripstion: "Relecta merupakan sebuah website yang digunakan untuk melakukan pengumpalan sampah Elektronik untuk disortir kembali, dan barang yang rusak secara total akan diserahkan ke pemerintah. Relecta dibuat untuk perlombaan IndoCeis.",
    tools: ["Html", "Typescript", "Tailwind", "React", "AI Agent"],
  }
];

// Kategori proyek untuk ditampilkan di halaman Home
export const projectCategories = [
  { id: 1, key: "web_app", title: "Web Application" }
];

// List Sertifikat
export const listCertificates = [
  {
    id: 1,
    title: "Semi Finalist Certificate",
    image_url: Sertif1,
  },
  {
    id: 2,
    title: "SolveIT Together Certificate",
    image_url: Sertif2,
  },
  // Tambahkan sertifikat lain di sini jika ada di masa depan
];
