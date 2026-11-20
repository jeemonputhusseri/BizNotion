const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    const err = new Error('Access denied. Admin privileges required.')
    err.status = 403
    return next(err)
  }
  next()
}

module.exports = requireAdmin
