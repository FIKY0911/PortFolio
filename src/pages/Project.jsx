// src/pages/Project.jsx
import React from 'react'
import { listProject } from '../data/data'
import Button from '../components/Button'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

const AnimatedProjectCard = ({ project }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <div
      ref={ref}
      key={project.id}
      className={`project-card-hover bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200 transition-all duration-300 ${
        inView ? 'animate__animated animate__fadeInUp' : ''
      }`}
    >
      {/* Gambar */}
      <div className='h-48 bg-slate-100 flex items-center justify-center p-4'>
        <img
          src={project.images}
          alt={project.title}
          className='w-full h-full object-contain max-w-[90%] max-h-[90%]'
        />
      </div>

      {/* Konten */}
      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3'>
          {project.title}
        </h3>

        <div className='flex flex-wrap gap-2 mb-5'>
          {project.tools.map((tool, id) => (
            <span
              key={id}
              className='px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full'
            >
              {tool}
            </span>
          ))}
        </div>

        <p className='text-slate-600 text-sm mb-6 flex-grow leading-relaxed'>
          {project.description}
        </p>

        <div className='flex justify-center'>
          <Link to="/project">
            <Button
              onClick={e => {
                e.preventDefault()
                window.open(project.link, '_blank', 'noopener,noreferrer')
              }}
            >
              Lihat Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Project = () => {
  return (
    <div className='w-full py-20 px-4 sm:px-6'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-16 text-center'>
          Projek Saya!
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {listProject.map(project => (
            <AnimatedProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Project
