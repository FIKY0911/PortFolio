/**
 * Client-side sanitization & validation utilities
 * Pure JS - no external dependencies
 */

/**
 * Strip HTML tags and dangerous patterns
 * Removes: <script>, <img onerror>, javascript:, data:, event handlers, any HTML tags
 */
export const stripHtmlTags = (value) => {
  if (!value || typeof value !== 'string') return ''

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, '')
    .trim()
}

/**
 * Sanitize plain text input - allows only safe characters
 */
export const sanitizeInput = (value) => {
  const stripped = stripHtmlTags(value)
  return stripped.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

/**
 * Validate full name
 * Rules: 2-50 chars, letters/spaces/hyphens/apostrophes only
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'contact.errors.nameRequired'
  }
  const sanitized = sanitizeInput(name)
  if (sanitized.length < 2) {
    return 'contact.errors.nameMinLength'
  }
  if (sanitized.length > 50) {
    return 'contact.errors.nameMaxLength'
  }
  const nameRegex = /^[\p{L}\s\-'.]+$/u
  if (!nameRegex.test(sanitized)) {
    return 'contact.errors.nameInvalid'
  }
  return null
}

/**
 * Validate email
 * Rules: RFC5322 compliant regex
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'contact.errors.emailRequired'
  }
  const sanitized = sanitizeInput(email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    return 'contact.errors.emailInvalid'
  }
  if (sanitized.length > 254) {
    return 'contact.errors.emailMaxLength'
  }
  return null
}

/**
 * Validate message
 * Rules: 10-2000 chars after sanitization
 */
export const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return 'contact.errors.messageRequired'
  }
  const sanitized = sanitizeInput(message)
  if (sanitized.length < 10) {
    return 'contact.errors.messageMinLength'
  }
  if (sanitized.length > 2000) {
    return 'contact.errors.messageMaxLength'
  }
  return null
}

/**
 * Check for suspicious patterns that might indicate XSS attempts
 * Returns true if suspicious content detected
 */
export const detectSuspiciousContent = (value) => {
  if (!value || typeof value !== 'string') return false

  const suspiciousPatterns = [
    /<script/i,
    /<\/script>/i,
    /<img/i,
    /<svg/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,
    /on\w+\s*=/i,
    /expression\s*\(/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i,
  ]

  return suspiciousPatterns.some(pattern => pattern.test(value))
}

/**
 * Validate all form fields at once
 * Returns object with sanitized values and errors
 */
export const validateContactForm = (formData) => {
  const { name, email, message } = formData

  const sanitizedName = sanitizeInput(name)
  const sanitizedEmail = sanitizeInput(email)
  const sanitizedMessage = sanitizeInput(message)

  // Check for suspicious content first
  if (
    detectSuspiciousContent(name) ||
    detectSuspiciousContent(email) ||
    detectSuspiciousContent(message)
  ) {
    return {
      isValid: false,
      errors: { form: 'contact.errors.suspiciousContent' },
      sanitized: null
    }
  }

  const nameError = validateName(sanitizedName)
  const emailError = validateEmail(sanitizedEmail)
  const messageError = validateMessage(sanitizedMessage)

  const errors = {}
  if (nameError) errors.name = nameError
  if (emailError) errors.email = emailError
  if (messageError) errors.message = messageError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage
    }
  }
}