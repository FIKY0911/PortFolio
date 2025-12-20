import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import emailjs from '@emailjs/browser'
import Button from '../components/Button'

const Contact = () => {
  const { t } = useTranslation()
  const from = useRef()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const serviceId = import.meta.env.VITE_SERVICE_ID
    const templateId = import.meta.env.VITE_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_PUBLIC_KEY

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: 'Fiky',
      message: message,
    }

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((res) => {
        alert(t('contact.successMessage'), res)
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch((err) => {
        alert(t('contact.errorMessage'), err)
      })
  }

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
