const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Not authorised, no token')
      err.status = 401
      return next(err)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.userId }
    next()
  } catch (error) {
    const err = new Error('Not authorised, token invalid')
    err.status = 401
    next(err)
  }
}

module.exports = { protect }
