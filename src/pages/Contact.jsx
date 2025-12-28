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

const Contact = () => {
  const { t } = useTranslation()
  
  // useRef untuk form element (EmailJS requirement)
  const from = useRef()
  
  // Controlled component states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  /**
   * Form Submit Handler
   * ===================
   * Handle form submission dengan EmailJS.
   * 
   * FLOW:
   * 1. Prevent default form behavior
   * 2. Get credentials dari environment variables
   * 3. Prepare template parameters
   * 4. Send email via EmailJS
   * 5. Handle success/error
   * 6. Reset form jika success
   */
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent page reload

    // Get EmailJS credentials dari environment variables
    const serviceId = import.meta.env.VITE_SERVICE_ID
    const templateId = import.meta.env.VITE_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_PUBLIC_KEY

    // Template parameters yang akan dikirim ke email template
    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: 'Fiky',
      message: message,
    }

    // Send email via EmailJS
    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((res) => {
        // Success: Show success message dan reset form
        alert(t('contact.successMessage'), res)
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch((err) => {
        // Error: Show error message
        alert(t('contact.errorMessage'), err)
      })
  }

  // Intersection Observer untuk animasi
  const { ref, inView } = useInView({
    triggerOnce: true,
  })

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
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
              placeholder={t('contact.fullNamePlaceholder')}
            />
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
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
              placeholder={t('contact.emailPlaceholder')}
            />
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
              onChange={(e) => setMessage(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
              placeholder={t('contact.messagePlaceholder')}
            ></textarea>
          </div>

          {/* Tombol Kirim */}
          <Button type='submit' className='w-full'>
            {t('contact.send')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Contact
