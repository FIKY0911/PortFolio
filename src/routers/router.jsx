/**
 * router.jsx
 * ==========
 * Konfigurasi routing aplikasi menggunakan React Router v6.
 * 
 * STRUKTUR ROUTE:
 * - / : Halaman Home (HeroSection + About + Skill + Project + Contact)
 * - /about : Halaman About standalone
 * - /skill : Halaman detail semua teknologi (SkillDetail)
 * - /project : Halaman Project standalone
 * - /contact : Halaman Contact standalone
 * 
 * FITUR:
 * - Menggunakan RootLayout sebagai wrapper (Header + Footer)
 * - Error handling dengan ErrorPage
 * - Nested routes dengan Outlet di RootLayout
 */

import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../components/ErrorPage"
import Home from "../pages/Home"
import About from "../pages/About"
import Project from "../pages/Project";
import Contact from "../pages/Contact"
import SkillDetail from "../components/skill/SkillDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/skill",
        element: <SkillDetail/>
      },
      {
        path: "/project",
        element: <Project />
      },
      {
        path: "/contact",
        element: <Contact/>
      }
    ]
  }
])
