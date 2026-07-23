/**
 * ============================================================================
 * Contact.jsx - Contact Form dengan EmailJS Integration
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. FORM HANDLING PATTERN
 *    - Controlled components dengan useState
 *    - useRef untuk form reference (EmailJS requirement)
 *    - Separate state untuk setiap input field
 *    - Form validation (bisa ditambahkan)
 * 
 * 2. EMAILJS INTEGRATION
 *    - Third-party service untuk send email dari client-side
 *    - Tidak perlu backend server
 *    - Environment variables untuk credentials
 *    - Template-based email system
 *    
 *    SETUP EMAILJS:
 *    a. Daftar di emailjs.com
 *    b. Create email service (Gmail, Outlook, dll)
 *    c. Create email template
 *    d. Get Service ID, Template ID, Public Key
 *    e. Simpan di .env file
 * 
 * 3. ENVIRONMENT VARIABLES
 *    - import.meta.env untuk Vite (process.env untuk CRA)
 *    - VITE_ prefix wajib untuk Vite
 *    - Jangan commit .env ke git (add ke .gitignore)
 *    - Use .env.example untuk dokumentasi
 *    
 *    SECURITY NOTE:
 *    - Public key aman di client-side (by design)
 *    - EmailJS punya rate limiting
 *    - Jangan expose private key
 * 
 * 4. CONTROLLED COMPONENTS
 *    - value={state} untuk bind input ke state
 *    - onChange handler untuk update state
 *    - Single source of truth (state)
 *    - Predictable data flow
 *    
 *    BENEFITS:
 *    - Easy validation
 *    - Easy to reset form
 *    - Predictable behavior
 *    - Easy to debug
 * 
 * 5. FORM SUBMISSION PATTERN
 *    - e.preventDefault() untuk prevent default form behavior
 *    - Async operation dengan promise
 *    - Success/Error handling
 *    - Reset form setelah success
 *    - User feedback dengan alert (bisa diganti toast)
 * 
 * 6. USEREF HOOK
 *    - Persist value across renders tanpa trigger re-render
 *    - Access DOM element directly
 *    - Tidak trigger re-render saat value berubah
 *    - Perfect untuk form reference, timers, previous values
 * 
 * 7. ACCESSIBILITY BEST PRACTICES
 *    - htmlFor attribute untuk label
 *    - id attribute untuk input
 *    - autoComplete attribute untuk browser autofill
 *    - Semantic HTML (form, label, input)
 *    - Placeholder text untuk guidance
 * 
 * IMPROVEMENT IDEAS:
 * - Add form validation (required, email format, min length)
 * - Replace alert dengan toast notification
 * - Add loading state saat submit
 * - Disable button saat loading
 * - Add success animation
 * - Add error messages per field
 * - Add reCAPTCHA untuk prevent spam
 * 
 * TIPS UNTUK JUNIOR:
 * - Always validate input di client dan server
 * - Never trust client-side data
 * - Use environment variables untuk credentials
 * - Provide clear user feedback
 * - Handle loading dan error states
 * - Test dengan berbagai input scenarios
 */

import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import emailjs from '@emailjs/browser'
import Button from '../components/Button'
import { validateContactForm } from '../lib/sanitize'

const Contact = () => {
  const { t } = useTranslation()
  const from = useRef()

  const { ref, inView } = useInView({
    triggerOnce: true,
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    setErrors({})
    setStatus('loading')

    const formData = { name, email, message }
    const { isValid, errors: validationErrors, sanitized } = validateContactForm(formData)

    if (!isValid) {
      setErrors(validationErrors)
      setStatus(null)
      return
    }

    const serviceId = import.meta.env.VITE_SERVICE_ID
    const templateId = import.meta.env.VITE_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_PUBLIC_KEY

    const templateParams = {
      from_name: sanitized.name,
      from_email: sanitized.email,
      to_name: 'Fiky',
      message: sanitized.message,
    }

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 flex items-center transition-colors duration-300'>
      <div
        ref={ref}
        className={`max-w-xl mx-auto w-full bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md dark:shadow-gray-900/50 ${
          inView ? 'animate__animated animate__fadeInUp' : ''
        }`}
      >
        <h1 className='text-3xl font-bold text-center text-gray-800 dark:text-white mb-2'>
          {t('contact.title')}
        </h1>
        <p className='text-gray-600 dark:text-gray-400 text-center mb-8'>
          {t('contact.subtitle')}
        </p>

        <form onSubmit={handleSubmit} ref={from}>
          {/* Honeypot field - hidden from users, will be checked for spam */}
          <div className='hidden'>
            <label htmlFor='website' className='sr-only'>Website</label>
            <input
              type='text'
              id='website'
              name='website'
              tabIndex='-1'
              className='hidden'
            />
          </div>

          {/* Nama Lengkap */}
          <div className='mb-5'>
            <label
              htmlFor='fullName'
              className='block text-gray-700 dark:text-gray-300 font-medium mb-2'
            >
              {t('contact.fullName')}
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              autoComplete='name'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder={t('contact.fullNamePlaceholder')}
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{t(errors.name)}</p>
            )}
          </div>

          {/* Email */}
          <div className='mb-5'>
            <label
              htmlFor='email'
              className='block text-gray-700 dark:text-gray-300 font-medium mb-2'
            >
              {t('contact.email')}
            </label>
            <input
              type='email'
              id='email'
              name='email'
              autoComplete='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder={t('contact.emailPlaceholder')}
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{t(errors.email)}</p>
            )}
          </div>

          {/* Pesan */}
          <div className='mb-6'>
            <label
              htmlFor='message'
              className='block text-gray-700 dark:text-gray-300 font-medium mb-2'
            >
              {t('contact.message')}
            </label>
            <textarea
              id='message'
              name='message'
              rows='5'
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (errors.message) setErrors({ ...errors, message: '' })
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${errors.message ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder={t('contact.messagePlaceholder')}
            />
            {errors.message && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{t(errors.message)}</p>
            )}
          </div>

          {/* Form Status Message */}
          {status === 'success' && (
            <div className='mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg text-green-800 dark:text-green-200'>
              {t('contact.successMessage')}
            </div>
          )}
          {status === 'error' && (
            <div className='mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg text-red-800 dark:text-red-200'>
              {t('contact.errorMessage')}
            </div>
          )}

          {/* Tombol Kirim */}
          <Button
            type='submit'
            className={`w-full ${status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? t('common.loading') : t('contact.send')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Contact
