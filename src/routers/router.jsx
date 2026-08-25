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
 * - Lazy loading untuk page components (code splitting)
 */

import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../components/ErrorPage"
import Home from "../pages/Home"

// Lazy load pages that aren't needed on initial render
const About = React.lazy(() => import("../pages/About"));
const Project = React.lazy(() => import("../pages/Project"));
const Contact = React.lazy(() => import("../pages/Contact"));
const SkillDetail = React.lazy(() => import("../components/skill/SkillDetail"));

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
        element: <React.Suspense fallback={null}><About /></React.Suspense>
      },
      {
        path: "/skill",
        element: <React.Suspense fallback={null}><SkillDetail/></React.Suspense>
      },
      {
        path: "/project",
        element: <React.Suspense fallback={null}><Project /></React.Suspense>
      },
      {
        path: "/contact",
        element: <React.Suspense fallback={null}><Contact/></React.Suspense>
      }
    ]
  }
])
