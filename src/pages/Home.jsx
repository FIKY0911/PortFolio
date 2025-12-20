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

