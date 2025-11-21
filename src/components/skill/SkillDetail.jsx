import React from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

// Import gambar dari assets
import Html from '../../assets/tools/Html-tools.webp'
import Css from '../../assets/tools/Css-tools.webp'
import Nextjs from '../../assets/tools/next-js-tools.webp'
import TypeScript from '../../assets/tools/Typescript-tools.webp'
import Javascript from "../../assets/tools/JS-tools.webp"
import Clerk from '../../assets/tools/clrek-tools.webp'
import Tailwind from '../../assets/tools/tailwind-css-tools.webp'
import Button from '../Button'

// Data teknologi dengan gambar yang sudah di-import
const technologies = [
  {
    id: 1,
    name: 'Next.js',
    type: 'Framework',
    image: Nextjs,
    description:
      'Next.js adalah framework React yang memungkinkan pembuatan aplikasi web server-rendered (SSR), static-generated (SSG), dan hybrid. Cocok untuk SEO, performa tinggi, dan pengembangan cepat.',
    officialSite: 'https://nextjs.org',
    features: [
      'Server-Side Rendering (SSR)',
      'Static Site Generation (SSG)',
      'Routing otomatis',
      'API Routes built-in',
      'Image Optimization'
    ]
  },
  {
    id: 2,
    name: 'TypeScript',
    type: 'Bahasa Pemrograman',
    image: TypeScript,
    description:
      'TypeScript adalah superset dari JavaScript yang menambahkan fitur tiping statis. Membantu menangkap error lebih awal dan membuat kode lebih mudah dipelihara, terutama di proyek besar.',
    officialSite: 'https://www.typescriptlang.org',
    features: [
      'Tiping statis (static typing)',
      'IntelliSense & autocomplete',
      'Kompatibel dengan JavaScript',
      'Interface & type inference',
      'Meningkatkan kualitas kode'
    ]
  },
  {
    id: 3,
    name: 'Clerk',
    type: 'Framework',
    image: Clerk,
    description:
      'Clerk adalah layanan autentikasi siap pakai untuk aplikasi modern. Menyediakan login, register, manajemen sesi, dan keamanan tanpa harus mengatur backend sendiri.',
    officialSite: 'https://clerk.com',
    features: [
      'Login & Register siap pakai',
      'Multi-factor authentication',
      'Social login (Google, GitHub, dll)',
      'Manajemen pengguna & peran',
      'Keamanan tingkat enterprise'
    ]
  },
  {
    id: 4,
    name: 'Tailwind CSS',
    type: 'Framework',
    image: Tailwind,
    description:
      'Tailwind CSS adalah framework CSS utility-first yang memungkinkan styling langsung di markup HTML. Sangat fleksibel, cocok untuk desain custom, dan sangat cepat dikembangkan.',
    officialSite: 'https://tailwindcss.com',
    features: [
      'Utility-first approach',
      'Responsif out-of-the-box',
      'Customizable theme',
      'JIT compiler (cepat & ringan)',
      'Plugin ecosystem luas'
    ]
  },
  {
    id: 5,
    name: 'HTML',
    type: 'Bahasa Markup',
    image: Html, // pastikan komponen/import Html sudah ada
    description:
      'HTML (HyperText Markup Language) adalah fondasi dari setiap halaman web. Digunakan untuk mendefinisikan struktur konten seperti heading, paragraf, gambar, dan form.',
    officialSite: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    features: [
      'Struktur dasar halaman web',
      'Semantic elements (<header>, <article>, dll.)',
      'Aksesibilitas (accessibility) yang baik',
      'Kompatibel di semua browser',
      'Ringan dan mudah dipelajari'
    ]
  },
  {
    id: 6,
    name: 'CSS',
    type: 'Bahasa Styling',
    image: Css, // pastikan komponen/import Css sudah ada
    description:
      'CSS (Cascading Style Sheets) digunakan untuk mengatur tampilan dan tata letak halaman web. Memisahkan konten (HTML) dari desain, memungkinkan konsistensi visual dan responsivitas.',
    officialSite: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    features: [
      'Styling visual (warna, font, layout)',
      'Responsive design dengan media queries',
      'Animasi & transisi',
      'Flexbox & Grid untuk layout modern',
      'Dukungan penuh di semua perangkat'
    ]
  },
  {
    id: 7,
    name: 'JavaScript',
    type: 'Bahasa Pemrograman',
    image: Javascript, // pastikan komponen/import Javascript sudah ada
    description:
      'JavaScript adalah bahasa pemrograman inti web yang membuat halaman web interaktif dan dinamis. Bisa dijalankan di browser (frontend) maupun server (Node.js), menjadikannya serbaguna dan wajib dikuasai.',
    officialSite: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    features: [
      'Interaktivitas di sisi klien (frontend)',
      'Manipulasi DOM secara real-time',
      'Asynchronous programming (Promise, async/await)',
      'Kompatibel dengan semua browser modern',
      'Ekosistem luas (React, Node.js, dll.)'
    ]
  }
]

const AnimatedSkillCard = ({ tech, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const animationDelay = `${index * 100}ms`

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${
        inView ? 'animate__animated animate__fadeInUp' : ''
      }`}
      style={{ animationDelay }}
    >
      <div className='flex items-center gap-4 mb-4'>
        <img
          src={tech.image}
          alt={tech.name}
          className='w-12 h-12 rounded-lg object-contain'
        />
        <div>
          <h2 className='text-xl font-bold text-gray-800'>{tech.name}</h2>
          <span className='text-sm text-gray-500'>{tech.type}</span>
        </div>
      </div>

      <p className='text-gray-700 mb-4 leading-relaxed'>{tech.description}</p>

      <div className='mb-4'>
        <h3 className='font-semibold text-gray-800 mb-2'>Fitur Unggulan:</h3>
        <ul className='list-disc list-inside space-y-1 text-gray-600 text-sm'>
          {tech.features.map((feature, id) => (
            <li key={id}>{feature}</li>
          ))}
        </ul>
      </div>

      <a
        href={tech.officialSite}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center text-cyan-600 hover:text-cyan-800 text-sm font-medium transition-colors'
      >
        Kunjungi Situs Resmi →
      </a>
    </div>
  )
}

const SkillDetail = () => {
  return (
    <div className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Teknologi yang Saya Gunakan
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Setiap proyek dibangun dengan alat yang tepat. Berikut detail
            framework dan bahasa pemrograman yang saya gunakan dalam
            pengembangan.
          </p>
        </div>

        {/* Grid Detail */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {technologies.map((tech, index) => (
            <AnimatedSkillCard key={tech.id} tech={tech} index={index} />
          ))}
        </div>

        {/* Back Button */}
        <div className='mt-12 text-center'>
          <Link
            to='/'
            className='inline-flex items-center px-6 py-3 text-white font-medium rounded-xl hover:opacity-90 transition-opacity'
          >
            <Button>Kembali ke Skill</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SkillDetail
