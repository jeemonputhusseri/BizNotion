const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

const {
    validateRequiredFields,
    validateEmail,
    validatePasswordLength
} = require('../validators/inputValidators');


const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // validate required fields
    const requiredError = validateRequiredFields(['name', 'email', 'password'], req.body)
    if (requiredError) {
      const err = new Error(requiredError)
      err.status = 400
      return next(err)
    }

    // validate email format
    const emailError = validateEmail(email)
    if (emailError) {
      const err = new Error(emailError)
      err.status = 400
      return next(err)
    }

    // validate password
    const passwordError = validatePasswordLength(password)
    if (passwordError) {
      const err = new Error(passwordError)
      err.status = 400
      return next(err)
    }

    // validate if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const err = new Error('Email already registered')
      err.status = 409
      return next(err)
    }

    // hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // save user to db
    const user = await User.create({ name, email, passwordHash })

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // validate fields
    const requiredError = validateRequiredFields(['email', 'password'], req.body)
    if (requiredError) {
      const err = new Error(requiredError)
      err.status = 400
      return next(err)
    }

    // find user by email
    const user = await User.findOne({ email })
    if (!user) {
      const err = new Error('Invalid credentials')
      err.status = 401
      return next(err)
    }

    // compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      const err = new Error('Invalid credentials')
      err.status = 401
      return next(err)
    }

    // sign jwt
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { registerUser, loginUser }