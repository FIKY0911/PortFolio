import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import AgentEngine from '../lib/agentEngine'
import Button from '../components/Button'

const AgenticBrowser = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const engine = useRef(new AgentEngine())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role, content, action = null) => {
    const msg = { role, content, action, timestamp: Date.now() }
    setMessages(prev => [...prev, msg])
    return msg
  }

  const handleUserInput = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isProcessing) return

    const userInput = inputValue
    setInputValue('')
    setIsProcessing(true)

    addMessage('user', userInput)

    const intent = engine.current.parseIntent(userInput)
    const result = engine.current.execute(intent, { location: location.pathname })

    if (result.navigateTo) {
      navigate(result.navigateTo)
    } else if (result.scroll === 'down') {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
    } else if (result.scroll === 'up') {
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' })
    } else if (result.download) {
      const link = document.createElement('a')
      link.href = '/CV Mohamad Fiky.pdf'
      link.download = 'CV Mohamad Fiky.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    if (result.message) {
      addMessage('assistant', result.message, intent.action)
    }

    setIsProcessing(false)
  }

  const quickCommands = [
    { label: 'About Fiky', input: 'Tell me about Fiky' },
    { label: 'Show Skills', input: 'Show me skills' },
    { label: 'View Projects', input: 'Show me projects' },
    { label: 'Go to Projects', input: 'Go to projects' },
    { label: 'Contact Info', input: 'How to contact Fiky' },
    { label: 'Download CV', input: 'Download CV' },
    { label: 'Help', input: 'What can you do?' }
  ]

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      addMessage('assistant', t('agentic.welcome'))
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? 'w-96 h-[500px] md:w-[420px]' : 'w-14 h-14'
        }`}
      >
        {!isOpen && (
          <button
            onClick={toggleOpen}
            className='w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform'
            aria-label='Open AI Assistant'
          >
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
          </button>
        )}

        {isOpen && (
          <div className='w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-2xl'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-bold text-sm'>{t('agentic.title')}</h3>
                  <p className='text-xs opacity-90'>{t('agentic.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={toggleOpen}
                className='w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-4' ref={containerRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className='text-sm whitespace-pre-wrap'>{msg.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className='flex justify-start'>
                  <div className='bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-none animate-pulse'>
                    <div className='flex gap-1'>
                      <span className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                      <span className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                      <span className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex flex-wrap gap-2 mb-3'>
                {quickCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(cmd.input)
                      handleUserInput({ preventDefault: () => {} })
                    }}
                    className='px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap'
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleUserInput} className='flex gap-2'>
                <input
                  type='text'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('agentic.placeholder')}
                  className='flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400'
                  disabled={isProcessing}
                  aria-label='Ask AI assistant'
                />
                <Button
                  type='submit'
                  disabled={isProcessing || !inputValue.trim()}
                  className='px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                >
                  {isProcessing ? t('common.loading') : 'Send'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AgenticBrowser