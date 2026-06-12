import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useDataStore } from '../../store/dataStore'

const CertificateSection = () => {
  const { t } = useTranslation()
  const certificates = useDataStore((state) => state.certificates)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const constraintsRef = useRef(null)

  const nextSlide = () => {
    if (currentIndex < certificates.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Komponen Modal yang akan di-portal
  const ModalPortal = ({ image, onClose }) => {
    return createPortal(
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-10"
        onClick={onClose}
      >
        {/* Close Button - Pojok Kanan Atas Viewport */}
        <button 
          className="fixed top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-blue-400 hover:scale-110 transition-all duration-300 z-[10000] cursor-pointer bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 shadow-2xl"
          onClick={onClose}
          aria-label="Close Preview"
        >
          <i className="ri-close-line text-3xl sm:text-4xl"></i>
        </button>

        {/* Image Container - Ukuran diperkecil agar tidak tertutup navbar jika navbar masih muncul */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full h-full max-w-5xl max-h-[70vh] flex items-center justify-center pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={image} 
            alt="Certificate Full View" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 pointer-events-auto"
          />
        </motion.div>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 text-white/60 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase select-none"
        >
          {t('certificates.full_preview', 'Sertifikat Full Preview')}
        </motion.p>
      </motion.div>,
      document.body
    )
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-8">
            {t('certificates.title', 'Sertifikat Saya')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {t('certificates.description', 'Kumpulan pencapaian dan sertifikasi profesional yang telah saya raih selama perjalanan karir saya.')}
          </p>
        </div>

        {/* Slider Container */}
        <div className="max-w-5xl mx-auto">
          {/* Sub-container untuk memusatkan panah terhadap konten saja (bukan terhadap dots) */}
          <div className="relative">
            {/* Navigation Arrows */}
            {certificates.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${currentIndex === 0 ? 'invisible' : 'visible'}`}
                >
                  <i className="ri-arrow-left-s-line text-2xl"></i>
                </button>
                <button 
                  onClick={nextSlide}
                  disabled={currentIndex >= certificates.length - 1}
                  className={`absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${currentIndex >= certificates.length - 1 ? 'invisible' : 'visible'}`}
                >
                  <i className="ri-arrow-right-s-line text-2xl"></i>
                </button>
              </>
            )}

            {/* Slider Content */}
            <div className="overflow-hidden rounded-2xl p-2" ref={constraintsRef}>
              <motion.div 
                className="flex gap-4"
                animate={{ x: `-${currentIndex * (100 / (window.innerWidth < 640 ? 2 : 5))}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {certificates.map((cert, idx) => (
                  <motion.div 
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="min-w-[calc(50%-8px)] sm:min-w-[calc(20%-13px)] aspect-[4/3] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer group"
                    onClick={() => setSelectedImage(cert.image_url)}
                  >
                    <div className="relative w-full h-full">
                      <img 
                        src={cert.image_url} 
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i className="ri-zoom-in-line text-white text-3xl"></i>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Pagination Dots */}
          {certificates.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {certificates.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Modal via Portal */}
      <AnimatePresence>
        {selectedImage && (
          <ModalPortal image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CertificateSection
