import React from 'react'
import { useInView } from 'react-intersection-observer';

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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Teks */}
          <div
            ref={textRef}
            className={`space-y-6 ${textInView ? 'animate__animated animate__fadeInUp' : ''}`}
          >
            <p className='text-gray-800 text-lg leading-relaxed'>
              Halo, saya <strong>Fiky</strong> — seorang developer yang fokus
              membangun aplikasi web modern dengan React, JavaScript, dan
              Tailwind CSS.
            </p>
            <p className='text-gray-800 text-lg leading-relaxed'>
              Saya menyukai hal-hal yang{' '}
              <strong>ringan, cepat, dan aman</strong>. Setiap baris kode yang
              saya tulis bertujuan untuk menyelesaikan masalah nyata tanpa
              menambah kerumitan.
            </p>
            <p className='text-gray-800 text-lg leading-relaxed'>
              Saat ini saya sedang mengeksplorasi otomatisasi keamanan,
              penggunaan WSL sebagai lingkungan utama, dan migrasi proyek ke
              drive alternatif — karena efisiensi dimulai dari hal kecil.
            </p>

            {/* CTA */}
            <div className='pt-4'>
              <a
                href='/project'
                className='group inline-flex items-center px-6 py-3 font-medium rounded-xl
                text-transparent bg-clip-text
                bg-gradient-to-br from-cyan-400 to-blue-400
                hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-400
              hover:text-slate-100 hover:bg-clip-border
                transition-all duration-300 ease-out
                hover:ring-2 hover:ring-cyan-300/70 shadow shadow-slate-300
                hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]
                relative'
              >
                Lihat Projek Saya →
              </a>
            </div>
          </div>

          {/* Gambar — mengisi penuh card */}
          <div
            ref={imageRef}
            className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${imageInView ? 'animate__animated animate__fadeInRight' : ''}`}
          >
            <img
              src='/About.webp'
              alt='Fiky'
              className='w-full h-full object-cover' // ✅ mengisi lebar, tinggi tetap proporsional
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
