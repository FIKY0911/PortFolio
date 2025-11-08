import React from 'react'
import HeroSection from '../components/home/HeroSection'
import Skill from './Skill'
import About from './About'
import Project from './Project'
import Container from '../components/Container'
import Contact from './Contact'

const Home = () => {
  return (
    <div className='sticky'>
      <HeroSection />
      <Container>
        <About/>
        <Skill/>
        <Project/>
        <Contact/>
      </Container>
    </div>
  )
}

export default Home

