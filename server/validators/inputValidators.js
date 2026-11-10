
const validateRequiredFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field] || body[field].toString().trim() === '') {
      return field + ' is required'
    }
  }
  return null;
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address'
  }
  return null;
}

const validatePasswordLength = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  return null;
}

module.exports = {
    validateRequiredFields,
    validateEmail,
    validatePasswordLength,
}