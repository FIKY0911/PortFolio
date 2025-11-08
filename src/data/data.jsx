import HeroImage from "../assets/hero/heroimage.webp";
import Nextjs from "../assets/tools/next-js-tools.webp";
import TypeScript from "../assets/tools/Typescript-tools.webp";
import Clerk from "../assets/tools/clrek-tools.webp";
import Tailwind from "../assets/tools/tailwind-css-tools.webp";
import Project1 from "../assets/project/project1.webp";

export const Image = {
  HeroImage,
};

export const listTools = [
  {
    id: 1,
    name: "Nextjs",
    image: Nextjs,
    ket: "Framework",
  },
  {
    id: 2,
    image: TypeScript,
    name: "TypeScript",
    ket: "Bahasa Pemrograman",
  },
  {
    id: 3,
    image: Clerk,
    name: "Clerk",
    ket: "Framework",
  },
  {
    id: 4,
    image: Tailwind,
    name: "Tailwind",
    ket: "Framework",
  }
];

export const listProject = [
  {
    id: 1,
    title: "Grocerystore",
    images: Project1,
    link: "https://grocerystore-rpl-kel13.vercel.app/", // ← hapus spasi ekstra di akhir
    description: "Ini adalah project e-commerce UAS-RPL yang dibuat menggunakan React dan Tailwind CSS.",
    tools: ["Next js", "TypeScript", "Clerk", "Tailwind"],
  }
];
