/**
 * Home.jsx
 * ========
 * Halaman utama aplikasi yang menampilkan semua section dalam satu halaman.
 * 
 * SECTION:
 * 1. HeroSection - Banner utama dengan foto profil dan intro
 * 2. About - Tentang diri
 * 3. Skill - List tools/teknologi yang dikuasai (card grid)
 * 4. Project - Portfolio project
 * 5. Contact - Form kontak
 * 
 * FITUR:
 * - Lazy loading untuk HeroSection dan Container (optimasi performa)
 * - Suspense dengan SkeletonLoading sebagai fallback
 * - Sticky positioning untuk smooth scroll experience
 */

import React, { Suspense } from 'react'
const HeroSection = React.lazy(() => import('../components/home/HeroSection'))
const TechStackCards = React.lazy(() => import('../components/home/TechStackCards'))
import About from './About'
const CertificateSection = React.lazy(() => import('../components/home/CertificateSection'))
const HomeProject = React.lazy(() => import('../components/home/HomeProject'))
const Container = React.lazy(() => import('../components/Container'))
import { SkeletonLoading } from '../components/loading/SkeletonLoading'

const Home = () => {
  return (
    <div>
      <Suspense fallback={<SkeletonLoading />}>
        <HeroSection />
          <Container>
            <About/>
            <TechStackCards/>
            <CertificateSection/>
            <HomeProject/>
          </Container>
        </Suspense>
    </div>
  )
}

export default Home

