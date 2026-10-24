// checks that required fields exist and are not empty strings. fields is an array like ['name', 'email', 'password'], body is req.body
const validateRequiredFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field] || body[field].toString().trim() === '') {
      return field + ' is required'
    }
  }
    return null;
}

//  checks it looks like a valid email using a regex
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address'
  }
    return null;
}

// checks password is at least 8 characters
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