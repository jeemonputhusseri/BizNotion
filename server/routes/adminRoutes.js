const express = require('express')
const router = express.Router()
const { protect: authMiddleware } = require('../middleware/authMiddleware')
const requireAdmin = require('../middleware/requireAdmin')
const { getUsers, getUserProducts, getUserInquiries } = require('../controllers/adminController')

router.use(authMiddleware)
router.use(requireAdmin)

router.get('/users', getUsers)
router.get('/users/:userId/products', getUserProducts)
router.get('/users/:userId/inquiries', getUserInquiries)

module.exports = router
