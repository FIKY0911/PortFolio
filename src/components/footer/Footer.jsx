import React from 'react'
import { Link } from 'react-router-dom' // hapus jika tidak pakai React Router
import Button from '../Button'
import Logo from '../header/fragments/Logo'

const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-200 py-15 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {/* Kolom 1: Brand & Deskripsi */}
          <div className='space-y-4'>
            <Logo/>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Membangun pengalaman web yang ringan, aman, dan menyenangkan —
              satu baris kode pada satu waktu.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Navigasi
            </h3>
            <ul className='space-y-2'>
              {['Home', 'About', 'Project', 'Contact'].map(item => (
                <li key={item}>
                  <Link
                    to={`/${
                      item.toLowerCase() === 'home' ? '' : item.toLowerCase()
                    }`}
                    className='text-gray-600 hover:text-cyan-600 transition-colors text-sm'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Kontak</h3>
            <address className='not-italic text-gray-600 text-sm space-y-2'>
              <p>Jl. Merdeka No. 10</p>
              <p>Jakarta, DKI 12345</p>
              <p>
                Email:{' '}
                <a
                  href='mailto:budi@example.com'
                  className='hover:text-cyan-600 transition-colors'
                >
                  budi@example.com
                </a>
              </p>
            </address>
          </div>

          {/* Kolom 4: CTA */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Ingin Berkolaborasi?
            </h3>
            <p className='text-gray-600 text-sm mb-4'>
              Saya terbuka untuk proyek menarik, diskusi teknologi, atau sekadar
              ngobrol soal otomatisasi keamanan.
            </p>
            <Link
              to='/contact'
              className='inline-block px-5 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity'
            >
              <Button>
              Hubungi Saya
              </Button>
            </Link>
          </div>
        </div>

        {/* Garis pemisah */}
        <div className='border-t border-gray-200 mt-16 pt-8 text-center'>
          <p className='text-gray-500 text-sm font-light tracking-wide'>
            © {new Date().getFullYear()} Fiky. All rights reserved. Crafted with{' '}
            <span className='inline-block mx-1 text-red-400 group cursor-pointer hover:scale-110 transition-transform duration-300'>
              ❤️
            </span>{' '}
            and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
