/**
 * data.jsx
 * ========
 * File data statis untuk aplikasi portfolio.
 * Berisi semua data yang ditampilkan di aplikasi (tidak menggunakan API/backend).
 * 
 * DATA YANG TERSEDIA:
 * 1. Image - Gambar hero untuk HeroSection
 * 2. profileData - Data profil (nama, foto)
 * 3. listTools - List tools/teknologi yang dikuasai
 * 4. listProject - List portfolio project
 * 
 * CATATAN:
 * - Semua gambar diimport dari folder assets
 * - Data ini digunakan langsung tanpa API call
 * - Untuk menambah/edit data, edit langsung di file ini
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
// Ditampilkan di section Skill (halaman Home)
export const listTools = [
  {
    id: 1,
    name: "Nextjs",
    image_url: Nextjs,
    keterangan: "Beginner",
  },
  {
    id: 2,
    image_url: TypeScript,
    name: "TypeScript",
    keterangan: "Beginner",
  },
  {
    id: 3,
    image_url: Clerk,
    name: "Clerk",
    keterangan: "Beginner",
  },
  {
    id: 4,
    image_url: Tailwind,
    name: "Tailwind Css",
    keterangan: "Beginner",
  },
  {
    id: 5,
    image_url: Html,
    name: "Html",
    keterangan: "Advanced",
  },
  {
    id: 6,
    image_url: Css,
    name: "Css",
    keterangan: "Intermediate",
  },
  {
    id: 7,
    image_url: Javascript,
    name: "Javascript",
    keterangan: "Beginner",
  },
  {
    id: 8,
    image_url: React,
    name: "React",
    keterangan: "Beginner",
  }
];

// List portfolio project
// Ditampilkan di section Project (halaman Home dan /project)
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
