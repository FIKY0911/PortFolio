/**
 * data.jsx
 * ========
 * File data statis untuk aplikasi portfolio.
 * Berisi semua data yang ditampilkan di aplikasi (tidak menggunakan API/backend).
 */

import HeroImage from "../assets/hero/heroimage.webp"
import Html from "../assets/tools/Html-tools.webp"
import Css from "../assets/tools/Css-tools.webp"
import Javascript from "../assets/tools/JS-tools.webp"
import Nextjs from "../assets/tools/next-js-tools.webp"
import TypeScript from "../assets/tools/Typescript-tools.webp"
import Clerk from "../assets/tools/clrek-tools.webp"
import Tailwind from "../assets/tools/tailwind-css-tools.webp"
import React from "../assets/tools/react-logo.webp"
import Project1 from "../assets/project/project1.webp"
import Project2 from "../assets/project/project2.webp"
import CVFile from "../assets/cv_sertif/CV Mohamad Fiky.pdf"
import Sertif1 from "../assets/sertifikat/Mohamad Fiky Ba'dafitro - Semi Finalist_page-0001.jpg"
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
  { id: 1, name: "Nextjs", image_url: Nextjs, keterangan: "Beginner" },
  { id: 2, name: "TypeScript", image_url: TypeScript, keterangan: "Beginner" },
  { id: 3, name: "Clerk", image_url: Clerk, keterangan: "Beginner" },
  { id: 4, name: "Tailwind Css", image_url: Tailwind, keterangan: "Beginner" },
  { id: 5, name: "Html", image_url: Html, keterangan: "Advanced" },
  { id: 6, name: "Css", image_url: Css, keterangan: "Intermediate" },
  { id: 7, name: "Javascript", image_url: Javascript, keterangan: "Beginner" },
  { id: 8, name: "React", image_url: React, keterangan: "Beginner" }
];

// List portfolio project
export const listProject = [
  {
    id: 1,
    title: "Grocerystore",
    image_url: Project1,
    referance_url: "https://grocerystore-rpl-kel13.vercel.app/",
    github_url: "",
    descripstion: "Ini adalah project e-commerce UAS-RPL saya terinspirasi dari youtube dengan konsep ATM(Amati Tiru Modifikasi).",
    tools: ["Next js", "TypeScript", "Clerk", "Tailwind"],
  },
  {
    id: 2,
    title: "Coffeshop",
    image_url: Project2,
    referance_url: "https://tugas-bahasa-pemrograman.vercel.app/",
    github_url: "",
    descripstion: "Ini adalah project Bahasa Pemrograman saya bersama temen saya",
    tools: ["Html", "Css", "Javascript"],
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
