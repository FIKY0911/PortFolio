import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// Isomorphic layout effect untuk sinkronisasi layout sebelum paint (menghilangkan CLS/kedipan layout)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * CategorySlider Component
 * =======================
 * Komponen navigasi slider responsif untuk kategori/tab di mobile, tablet, dan desktop.
 * 
 * Keunggulan arsitektural:
 * 1. Tombol panah kiri dan kanan fixed/stasioner di luar viewport track scroll (panah tidak ikut bergeser).
 * 2. Track scrollable 'overflow-x-auto scrollbar-none scroll-smooth' dengan preservasi touch swipe langsung.
 * 3. Gradient fade indicator dengan transisi CSS opacity mulus saat konten terpotong di kiri/kanan.
 * 4. Arsitektur flex 'min-w-max mx-auto' yang mencegah bug CSS scroll clipping pada justify-center.
 * 5. Pengamatan dimensi ganda via ResizeObserver (viewport dan content width) & event scrollend.
 * 6. Auto-scroll presisi untuk tab aktif agar selalu berada di area pandang pengguna.
 */
const CategorySlider = ({
  children,
  activeKey,
  className = '',
  containerClassName = '',
  ariaLabel,
  fadeColor = 'from-gray-50 dark:from-gray-900'
}) => {
  const { t } = useTranslation()
  const scrollRef = useRef(null)
  const trackContentRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  // Evaluasi status scroll dan batas overflow secara presisi
  const checkScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const tolerance = 2 // toleransi subpixel rendering pada layar Retina / high-DPI
    const overflow = scrollWidth > clientWidth + tolerance

    setHasOverflow(overflow)
    setCanScrollLeft(overflow && scrollLeft > tolerance)
    setCanScrollRight(overflow && Math.ceil(scrollLeft + clientWidth) < scrollWidth - tolerance)
  }, [])

  // Inisialisasi status scroll sebelum paint awal untuk mencegah CLS
  useIsomorphicLayoutEffect(() => {
    checkScrollState()
  }, [checkScrollState])

  // Listener resize, DOM mutation observer, dan font readiness
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScrollState()

    const handleResize = () => checkScrollState()
    window.addEventListener('resize', handleResize)

    // Deteksi event scrollend native atau fallback scroll
    el.addEventListener('scroll', checkScrollState, { passive: true })
    if ('onscrollend' in window) {
      el.addEventListener('scrollend', checkScrollState)
    }

    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkScrollState()
      })
      resizeObserver.observe(el)
      if (trackContentRef.current) {
        resizeObserver.observe(trackContentRef.current)
      }
    }

    // Re-evaluasi saat font rendering selesai dimuat
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(checkScrollState)
    }

    const timer = setTimeout(checkScrollState, 150)

    return () => {
      window.removeEventListener('resize', handleResize)
      el.removeEventListener('scroll', checkScrollState)
      if ('onscrollend' in window) {
        el.removeEventListener('scrollend', checkScrollState)
      }
      if (resizeObserver) resizeObserver.disconnect()
      clearTimeout(timer)
    }
  }, [checkScrollState, children])

  // Geser tab aktif ke dalam area pandang ketika activeKey berubah
  useEffect(() => {
    if (!scrollRef.current || activeKey === undefined || activeKey === null) return

    const container = scrollRef.current
    const activeEl = container.querySelector(`[data-key="${activeKey}"]`)
    if (!activeEl) return

    const containerRect = container.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    // Scroll kiri jika terpotong batas kiri (hanya jika track sudah di-scroll)
    if (container.scrollLeft > 0 && activeRect.left < containerRect.left + 28) {
      container.scrollBy({
        left: activeRect.left - containerRect.left - 36,
        behavior: 'smooth'
      })
    } else if (activeRect.right > containerRect.right - 28) {
      container.scrollBy({
        left: activeRect.right - containerRect.right + 36,
        behavior: 'smooth'
      })
    }
  }, [activeKey])

  // Handler interaksi tombol panah navigasi stasioner
  const handleScroll = (direction) => {
    const el = scrollRef.current
    if (!el) return

    const scrollAmount = Math.max(el.clientWidth * 0.7, 180)
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })

    // Cadangan update status sinkronisasi pasca animasi scroll
    setTimeout(checkScrollState, 180)
    setTimeout(checkScrollState, 450)
  }

  return (
    <nav
      aria-label={ariaLabel || t('skills.techStackCategories', 'Navigasi Kategori')}
      className={`relative w-full max-w-full select-none ${containerClassName}`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Tombol Panah Kiri (Fixed / Stasioner di luar track scroll) */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={t('skills.scrollLeft', 'Geser kategori ke kiri')}
            className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 border z-20 ${
              canScrollLeft
                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-500 hover:text-blue-600 dark:hover:text-cyan-400 active:scale-95 cursor-pointer'
                : 'bg-gray-100/60 dark:bg-gray-800/40 text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-800/60 opacity-30 cursor-not-allowed scale-95 pointer-events-none'
            }`}
          >
            <i className="ri-arrow-left-s-line text-lg sm:text-xl" />
          </button>
        )}

        {/* Viewport Konten Scrollable */}
        <div className="relative flex-1 min-w-0 overflow-hidden">
          {/* Indikator Gradien Kiri (Fade saat ada konten di kiri) */}
          {hasOverflow && (
            <div
              className={`absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r ${fadeColor} to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            />
          )}

          {/* Area Track Scrollable */}
          <div
            ref={scrollRef}
            className={`overflow-x-auto scrollbar-none scroll-smooth py-1.5 px-0.5 ${className}`}
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* Wrapper konten dengan min-w-max mx-auto untuk auto-centering tanpa scroll clipping */}
            <div
              ref={trackContentRef}
              className="flex items-center gap-2 min-w-max mx-auto px-1"
            >
              {children}
            </div>
          </div>

          {/* Indikator Gradien Kanan (Fade saat ada konten di kanan) */}
          {hasOverflow && (
            <div
              className={`absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l ${fadeColor} to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Tombol Panah Kanan (Fixed / Stasioner di luar track scroll) */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={t('skills.scrollRight', 'Geser kategori ke kanan')}
            className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 border z-20 ${
              canScrollRight
                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-500 hover:text-blue-600 dark:hover:text-cyan-400 active:scale-95 cursor-pointer'
                : 'bg-gray-100/60 dark:bg-gray-800/40 text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-800/60 opacity-30 cursor-not-allowed scale-95 pointer-events-none'
            }`}
          >
            <i className="ri-arrow-right-s-line text-lg sm:text-xl" />
          </button>
        )}
      </div>
    </nav>
  )
}

export default CategorySlider
