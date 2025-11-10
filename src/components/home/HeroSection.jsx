import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Image } from '../../data/data'
import { Link } from 'react-router-dom'
import Button from '../Button'

const HeroSection = () => {
  return (
    <div className='animate__animated animate__fadeIn'>
      <div className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-50 px-4 sm:px-6 md:px-8 lg:px-12'>
        <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16'>
          <div className='w-full lg:w-auto flex justify-center lg:justify-end order-1 lg:order-2'>
            <div className='gradient-border'>
              <img
                src={Image.HeroImage}
                alt='Foto Profil Fiky'
                className='w-75 h-80 sm:w-80 sm:h-100 lg:w-96 lg:h-[30rem] bg-white'
              />
            </div>
          </div>
          {/* Bagian Teks — di bawah di mobile & tablet, di kiri di desktop */}
          <div className='w-full max-w-lg text-center lg:text-left order-2 lg:order-1'>
            <TypeAnimation
              sequence={[
                'Halo, Saya Fiky!☺️',
                2000,
                'Selamat Datang di Portofolio Saya!',
                2000,
                'Student | Web Developer🧑‍💻',
                2000,
                'Antusias | CyberScurity',
                2000
              ]}
              wrapper='div'
              cursor={true}
              repeat={Infinity}
              className='text-3xl sm:text-4xl font-semibold mb-15 leading-tight'
              style={{ whiteSpace: 'pre-line' }}
            />
            <div>
              <p className='text-lg my-8'>
                Saya adalah seorang pengembang web yang bersemangat dalam
                belajar dan menciptakan solusi digital yang inovatif dan
                efisien. Dengan keahlian dalam berbagai teknologi web, saya
                berkomitmen untuk menghadirkan pengalaman pengguna yang luar
                biasa melalui desain yang responsif dan fungsionalitas yang
                handal.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 w-full'>
              <Link to='/project'>
                <Button className='w-full'>Lihat Proyek</Button>
              </Link>

              <Link
                to='/'
                className='w-full sm:w-auto text-center font-semibold px-6 py-3 rounded-lg border-2 border-white bg-transparent text-white hover:bg-white/10 hover:bg-gradient-to-br from-blue-400 to-cyan-400 transition'
              >
                Download CV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
