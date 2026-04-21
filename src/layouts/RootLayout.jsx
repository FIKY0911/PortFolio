/**
 * RootLayout.jsx
 * ==============
 * Layout utama aplikasi yang membungkus semua halaman.
 * Berisi Header (navbar) dan Footer yang muncul di semua halaman.
 * 
 * FITUR:
 * - ScrollToTop: Otomatis scroll ke atas saat pindah route
 * - Header: Navbar dengan logo, menu, theme switcher, language switcher
 * - Outlet: Tempat render konten halaman (dari React Router)
 * - Footer: Footer dengan info kontak dan navigasi
 * - Dark mode support dengan transition smooth
 * 
 * STRUKTUR:
 * - ScrollToTop (invisible, hanya logic)
 * - Header (fixed di atas)
 * - Main content (Outlet)
 * - Footer (di bawah)
 */

import React from 'react'
import Header from '../components/header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Container from '../components/Container'
import Footer from '../components/footer/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

const RootLayout = () => {
  const location = useLocation()
  const { t } = useTranslation()

  // Base URL (environment-aware)
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://portfolio-fiky.vercel.app'

  // SEO data based on route
  const getSeoData = () => {
    const path = location.pathname
    const currentUrl = `${baseUrl}${path}`

    const seoData = {
      '/': {
        title: t('home.tabTitle', 'Portfolio'),
        description: t('home.metaDescription', 'Professional portfolio of Fiky, a Fullstack Developer. Explore my modern web projects, technical skills, and work experience. Contact me for collaboration opportunities.'),
      },
      '/about': {
        title: t('about.tabTitle', 'About - Fiky'),
        description: t('about.metaDescription', 'Learn more about Fiky, a Fullstack Developer with expertise in modern web technologies.'),
      },
      '/skill': {
        title: t('skill.tabTitle', 'Skills - Fiky'),
        description: t('skills.metaDescription', 'Technical skills and tools used by Fiky including Next.js, React, TypeScript, Tailwind CSS, and more.'),
      },
      '/project': {
        title: t('project.tabTitle', 'Projects - Fiky'),
        description: t('projects.metaDescription', 'Browse through Fiky portfolio of web development projects, from personal projects to client work.'),
      },
      '/contact': {
        title: t('contact.tabTitle', 'Contact - Fiky'),
        description: t('contact.metaDescription', 'Get in touch with Fiky for collaboration, project inquiries, or just to say hello.'),
      },
    }

    const data = seoData[path] || seoData['/']
    return { ...data, url: currentUrl, siteName: 'Fiky Portfolio' }
  }

  const seo = getSeoData()

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seo.title}</title>
        <meta name="title" content={seo.title} />
        <meta name="description" content={seo.description} />
        <meta name="author" content="Fiky" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={seo.url} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.url} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:site_name" content={seo.siteName} />
        <meta property="og:image" content={`${baseUrl}/heroimage.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={seo.title} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seo.url} />
        <meta property="twitter:title" content={seo.title} />
        <meta property="twitter:description" content={seo.description} />
        <meta property="twitter:image" content={`${baseUrl}/heroimage.png`} />
        <meta property="twitter:image:alt" content={seo.title} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Fiky",
            "url": baseUrl,
            "jobTitle": "Fullstack Developer",
            "sameAs": [
              "https://github.com/fiky",
              "https://linkedin.com/in/fiky"
            ],
            "knowsAbout": [
              "React",
              "JavaScript",
              "TypeScript",
              "Next.js",
              "Tailwind CSS",
              "Node.js",
              "Web Development"
            ]
          })}
        </script>
      </Helmet>
      <ScrollToTop />
      <header>
              <nav>
                <Header/>
              </nav>
      </header>
      <main>
        <Container>
            <Outlet/>
        </Container>
        <div className='pt-20'>
        <Footer/>
        </div>
      </main>
    </div>
  )
}

export default RootLayout
