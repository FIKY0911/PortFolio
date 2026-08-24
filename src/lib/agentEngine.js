/**
 * Agent Engine - Portfolio Agentic Browser
 * Parses natural language commands and executes browser actions
 */

class AgentEngine {
  constructor() {
    this.conversationHistory = []
  }

  parseIntent(input) {
    const normalized = input.toLowerCase().trim()

    if (normalized.match(/(go to|navigate|buka|pindah|ke)\s*(home|beranda|halaman utama)/)) {
      return { action: 'navigate', path: '/', desc: 'Navigating to Home' }
    }
    if (normalized.match(/(go to|navigate|buka|pindah|ke)\s*(about|tentang)/)) {
      return { action: 'navigate', path: '/about', desc: 'Navigating to About' }
    }
    if (normalized.match(/(go to|navigate|buka|pindah|ke)\s*(skill|skills|teknologi|tech)/)) {
      return { action: 'navigate', path: '/skill', desc: 'Navigating to Skills' }
    }
    if (normalized.match(/(go to|navigate|buka|pindah|ke)\s*(project|proyek)/)) {
      return { action: 'navigate', path: '/project', desc: 'Navigating to Projects' }
    }
    if (normalized.match(/(go to|navigate|buka|pindah|ke)\s*(contact|kontak|hubungi)/)) {
      return { action: 'navigate', path: '/contact', desc: 'Navigating to Contact' }
    }

    if (normalized.match(/(scroll|gulir)\s*(down|bawah)/)) {
      return { action: 'scroll', direction: 'down', desc: 'Scrolling down' }
    }
    if (normalized.match(/(scroll|gulir)\s*(up|atas)/)) {
      return { action: 'scroll', direction: 'up', desc: 'Scrolling up' }
    }
    if (normalized.match(/(scroll|gulir)\s*(top|paling atas|awal)/)) {
      return { action: 'scrollToTop', desc: 'Scrolling to top' }
    }

    if (normalized.match(/(siapa|who|about).*(kamu|you|fiky|nama|name)/)) {
      return { action: 'answer', type: 'about', desc: 'Telling about Fiky' }
    }
    if (normalized.match(/(skill|keahlian|bisa|tech|stack|tools|teknologi)/)) {
      return { action: 'answer', type: 'skills', desc: 'Listing skills' }
    }
    if (normalized.match(/(project|proyek|portfolio|karya|aplikasi)/)) {
      return { action: 'answer', type: 'projects', desc: 'Listing projects' }
    }
    if (normalized.match(/(hubungi|contact|email|pesan|message)/)) {
      return { action: 'answer', type: 'contact', desc: 'Contact information' }
    }
    if (normalized.match(/(download|unduh|cv|resume)/)) {
      return { action: 'downloadCV', desc: 'Downloading CV' }
    }

    if (normalized.match(/(halo|hai|hi|hello|hey|selamat)/)) {
      return { action: 'answer', type: 'greeting', desc: 'Greeting' }
    }

    if (normalized.match(/(apa yang bisa|bisa apa|help|bantuan|fitur)/)) {
      return { action: 'answer', type: 'help', desc: 'Showing capabilities' }
    }

    return { action: 'answer', type: 'unknown', desc: 'I do not understand', input }
  }

  execute(intent, context = {}) {
    switch (intent.action) {
      case 'navigate':
        return { success: true, message: intent.desc, navigateTo: intent.path }

      case 'scroll':
        return {
          success: true,
          message: intent.desc,
          scroll: intent.direction === 'down' ? 'down' : 'up'
        }

      case 'scrollToTop':
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return { success: true, message: intent.desc }

      case 'downloadCV':
        return { success: true, message: 'Downloading CV...', download: true }

      case 'answer':
        return { success: true, message: this.generateAnswer(intent.type, context) }

      default:
        return { success: false, message: 'Command not recognized' }
    }
  }

  generateAnswer(type, context) {
    const answers = {
      about: "Fiky is a Fullstack Developer focused on modern web applications using React and JavaScript. He is an Information Technology student passionate about clean code and AI integration.",
      skills: "Fiky works with: Languages (HTML, CSS, JavaScript, TypeScript), Frameworks (Next.js, Tailwind CSS, Clerk, React), and Version Control (Git).",
      projects: "3 projects: Grocerystore (e-commerce with Next.js + Clerk), Coffeeshop (HTML/CSS/JS), and Relecta (React + AI Agent for IndoCeis competition).",
      contact: "You can contact Fiky through the Contact page. Send a message via the form powered by EmailJS.",
      greeting: "Hello! I am Fiky's portfolio assistant. How can I help you? Ask about skills, projects, or navigate anywhere.",
      help: "I can help you navigate the portfolio. Try: 'go to projects', 'show me skills', 'tell me about Fiky', 'scroll down', or 'download CV'.",
      unknown: "Sorry, I did not understand that. Try commands like 'go to about', 'show me projects', 'tell me about Fiky', or 'help'."
    }
    return answers[type] || answers.unknown
  }
}

export default AgentEngine
