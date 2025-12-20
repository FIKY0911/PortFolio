import React from 'react'
import Header from '../components/header/Header'
import { Outlet } from 'react-router-dom'
import Container from '../components/Container'
import Footer from '../components/footer/Footer'

const RootLayout = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
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
