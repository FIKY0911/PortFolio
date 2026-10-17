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
 * - Skip to content link (accessibility)
 * - Header (fixed di atas)
 * - Main content (Outlet)
 * - Footer (di bawah)
 */

import React, { useEffect } from 'react'
import Header from '../components/header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Container from '../components/Container'
import Footer from '../components/footer/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

const RootLayout = () => {
  const location = useLocation()
  const { t, i18n } = useTranslation()

  // Base URL (environment-aware)
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://portfolio-fiky.vercel.app'

  // Current language detection
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const isId = currentLang === 'id'

  // URL calculations for canonical and multilingual hreflang
  const cleanPath = location.pathname === '/' ? '' : location.pathname
  const defaultUrl = `${baseUrl}${location.pathname}`
  const idUrl = `${baseUrl}${cleanPath}?lang=id`
  const enUrl = `${baseUrl}${cleanPath}?lang=en`
  const hasIdParam = location.search.includes('lang=id')
  const canonicalUrl = isId ? (hasIdParam ? idUrl : defaultUrl) : enUrl

  // Sync language with URL query parameter (?lang= / ?lng=)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlLang = params.get('lang') || params.get('lng')
    if (urlLang && (urlLang === 'id' || urlLang === 'en') && urlLang !== i18n.language) {
      i18n.changeLanguage(urlLang)
    }
  }, [location.search, i18n])

  // Dynamic html lang attribute synchronization
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang
    }
  }, [currentLang])

  // SEO data based on route
  const getSeoData = () => {
    const path = location.pathname

    const seoData = {
      '/': {
        title: t('home.tabTitle', "Mohamad Fiky Ba'dafitro | Fullstack Developer Portfolio"),
        description: t('home.metaDescription', 'Portofolio profesional Fiky, seorang Fullstack Developer. Jelajahi proyek web modern, keahlian teknis, dan pengalaman kerja saya. Hubungi saya untuk peluang kolaborasi.'),
      },
      '/about': {
        title: t('about.tabTitle', 'About Me | Mohamad Fiky'),
        description: t('about.metaDescription', "Pelajari lebih lanjut tentang Mohamad Fiky Ba'dafitro, seorang Fullstack Developer yang berfokus pada ekosistem React, integrasi AI, dan solusi web modern."),
      },
      '/skill': {
        title: t('skill.tabTitle', 'Skills & Tech Stack | Mohamad Fiky'),
        description: t('skill.metaDescription', t('skills.metaDescription', 'Daftar keahlian teknis dan teknologi modern yang dikuasai Mohamad Fiky, termasuk React, Next.js, TypeScript, Tailwind CSS, Node.js, dan AI tooling.')),
      },
      '/project': {
        title: t('project.tabTitle', 'Projects Portfolio | Mohamad Fiky'),
        description: t('project.metaDescription', t('projects.metaDescription', 'Jelajahi portofolio proyek web development Mohamad Fiky, mulai dari aplikasi web modern, e-commerce, hingga integrasi kecerdasan buatan.')),
      },
      '/contact': {
        title: t('contact.tabTitle', 'Contact Me | Mohamad Fiky'),
        description: t('contact.metaDescription', 'Hubungi Mohamad Fiky untuk kolaborasi pengembangan web, peluang kerja, konsultasi proyek, atau pertanyaan seputar teknologi web modern.'),
      },
    }

    const data = seoData[path] || seoData['/']
    return { ...data, url: canonicalUrl, siteName: 'Mohamad Fiky Portfolio' }
  }

  const seo = getSeoData()

  // OpenGraph locale mapping
  const ogLocale = isId ? 'id_ID' : 'en_US'
  const ogLocaleAlternate = isId ? 'en_US' : 'id_ID'

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
      <Helmet htmlAttributes={{ lang: currentLang }}>
        {/* Primary Meta Tags */}
        <title>{seo.title}</title>
        <meta name="title" content={seo.title} />
        <meta name="description" content={seo.description} />
        <meta name="author" content="Mohamad Fiky Ba'dafitro" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Multilingual Hreflang Tags (Google & Bing SEO) */}
        <link rel="alternate" hrefLang="id" href={idUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={defaultUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:site_name" content={seo.siteName} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={ogLocaleAlternate} />
        <meta property="og:image" content={`${baseUrl}/heroimage.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={seo.title} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={`${baseUrl}/heroimage.png`} />
        <meta name="twitter:image:alt" content={seo.title} />

        {/* Multilingual Schema.org JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": `${baseUrl}/#person`,
                "name": "Mohamad Fiky Ba'dafitro",
                "alternateName": "Fiky",
                "url": baseUrl,
                "image": `${baseUrl}/heroimage.png`,
                "jobTitle": "Fullstack Developer",
                "knowsLanguage": ["id", "en"],
                "sameAs": [
                  "https://github.com/mohamadfiky",
                  "https://linkedin.com/in/mohamad-fiky",
                  "https://instagram.com/filas756"
                ],
                "knowsAbout": [
                  "React",
                  "JavaScript",
                  "TypeScript",
                  "Next.js",
                  "Tailwind CSS",
                  "Node.js",
                  "Web Development",
                  "Artificial Intelligence"
                ]
              },
              {
                "@type": "WebSite",
                "@id": `${baseUrl}/#website`,
                "url": baseUrl,
                "name": seo.siteName,
                "description": seo.description,
                "inLanguage": ["id", "en"],
                "publisher": { "@id": `${baseUrl}/#person` }
              },
              {
                "@type": "WebPage",
                "@id": `${canonicalUrl}#webpage`,
                "url": canonicalUrl,
                "name": seo.title,
                "description": seo.description,
                "inLanguage": currentLang,
                "isPartOf": { "@id": `${baseUrl}/#website` },
                "about": { "@id": `${baseUrl}/#person` }
              }
            ]
          })}
        </script>
      </Helmet>
      <ScrollToTop />
      
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600 dark:focus:bg-gray-800 dark:focus:text-blue-400"
      >
        Lewati ke konten utama
      </a>
      
      <header>
        <nav>
          <Header/>
        </nav>
      </header>
      <main id="main-content">
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
