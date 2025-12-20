import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../components/ErrorPage"
import Home from "../pages/Home"
import About from "../pages/About"
import Project from "../pages/Project";
import Contact from "../pages/Contact"
import SkillDetail from "../components/skill/SkillDetail";
import Skill from "../pages/Skill";

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
        element: <Skill />
      },
      {
        path: "/skill/:id",
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
