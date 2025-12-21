import HeroImage from "../assets/hero/heroimage.webp"
import Html from "../assets/tools/Html-tools.webp"
import Css from "../assets/tools/Css-tools.webp"
import Javascript from "../assets/tools/JS-tools.webp"
import Nextjs from "../assets/tools/next-js-tools.webp"
import TypeScript from "../assets/tools/Typescript-tools.webp"
import Clerk from "../assets/tools/clrek-tools.webp"
import Tailwind from "../assets/tools/tailwind-css-tools.webp"
import Project1 from "../assets/project/project1.webp"
import Project2 from "../assets/project/project2.webp"

export const Image = {
  HeroImage,
};

export const profileData = {
  name: "Fiky",
  image_url: HeroImage,
};

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
  }
];

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
