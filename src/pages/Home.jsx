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
import Skill from './Skill'
import About from './About'
import Project from './Project'
const Container = React.lazy(() => import('../components/Container'))
import Contact from './Contact'
import { SkeletonLoading } from '../components/loading/SkeletonLoading'

const Home = () => {
  return (
    <div className='sticky top-0'>
      <Suspense fallback={<SkeletonLoading />}>
        <HeroSection />
          <Container>
            <About/>
            <Skill/>
            <Project/>
            <Contact/>
          </Container>
        </Suspense>
    </div>
  )
}

export default Home

