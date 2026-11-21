const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailSender');


const {
    validateRequiredFields,
    validateEmail,
    validatePasswordLength
} = require('../validators/inputValidators');


const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // validate required
    const requiredError = validateRequiredFields(['name', 'email', 'password'], req.body)
    if (requiredError) {
      const err = new Error(requiredError)
      err.status = 400
      return next(err)
    }

    const emailError = validateEmail(email)
    if (emailError) {
      const err = new Error(emailError)
      err.status = 400
      return next(err)
    }

    const passwordError = validatePasswordLength(password)
    if (passwordError) {
      const err = new Error(passwordError)
      err.status = 400
      return next(err)
    }

    //validate if email already there
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const err = new Error('Email already registered')
      err.status = 409
      return next(err)
    }

    // hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // save
    const user = await User.create({ name, email, passwordHash })

    try {
      await sendEmail('welcome.html', user.email, {
        name: user.name,
        subject: 'Welcome to BizNotion!'
      });
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const requiredError = validateRequiredFields(['email', 'password'], req.body)
    if (requiredError) {
      const err = new Error(requiredError)
      err.status = 400
      return next(err)
    }

    const user = await User.findOne({ email })
    if (!user) {
      const err = new Error('Invalid credentials')
      err.status = 401
      return next(err)
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      const err = new Error('Invalid credentials')
      err.status = 401
      return next(err)
    }

    //sign jwt
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail('otp.html', user.email, {
      name: user.name,
      otp: otp,
      subject: 'BizNotion - Password Reset OTP'
    });

    res.status(200).json({
      message: 'OTP sent to your email',
      userId: user._id
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { otp, password, confirmPassword } = req.body;

    if (!otp || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Invalid request' });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};


module.exports = { registerUser, loginUser, forgotPassword, resetPassword }