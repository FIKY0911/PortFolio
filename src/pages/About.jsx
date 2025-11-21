import React from 'react';
import { useInView } from 'react-intersection-observer';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const About = () => {
  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
  });

  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
  });

  return (
    <div className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Tentang{' '}
            <span className='bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'>
              Saya
            </span>
          </h1>
          <p className='text-lg text-gray-600'>
            Pengembang web yang percaya pada kesederhanaan, keamanan, dan
            pengalaman pengguna yang menyenangkan.
          </p>
        </div>

        {/* Konten Utama */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Teks */}
          <div
            ref={textRef}
            className={`space-y-6 ${
              textInView ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <p className='text-gray-800 text-lg leading-relaxed'>
              Halo, saya <strong>Fiky</strong> — seorang developer yang fokus
              membangun aplikasi web modern dengan React, JavaScript, dll.
            </p>
            <p className='text-gray-800 text-lg leading-relaxed'>
              Saya menyukai hal-hal yang{' '}
              <strong>ringan, cepat, dan aman</strong>. Setiap baris kode yang
              saya tulis bertujuan untuk menyelesaikan masalah nyata tanpa
              menambah kerumitan.
            </p>

            {/* CTA Button */}
            <div className='pt-4'>
              <Link
                to='/project'
              >
                <Button>
                Lihat Projek Saya →
                </Button>
              </Link>
            </div>

            {/* Social Media Icons — DIPINDAHKAN TEPAT DI BAWAH TOMBOL */}
            <div className='flex gap-6 pt-4'>
              <a
                href='https://instagram.com/filas756'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
              >
                <i className='ri-instagram-fill ri-2x text-gray-700 hover:text-pink-500 transition-colors duration-200'></i>
              </a>
              <a
                href='https://linkedin.com/in/fiky'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'
              >
                <i className='ri-linkedin-fill ri-2x text-gray-700 hover:text-blue-600 transition-colors duration-200'></i>
              </a>
            </div>
          </div>

          {/* Gambar */}
          <div
            ref={imageRef}
            className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${
              imageInView ? 'animate__animated animate__fadeInRight' : ''
            }`}
          >
            <img
              src='/About.webp'
              alt='Fiky'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
