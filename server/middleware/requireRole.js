const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error('Not authorized for this action')
      err.status = 403
      return next(err)
    }
    next()
  }
}

module.exports = { requireRole }