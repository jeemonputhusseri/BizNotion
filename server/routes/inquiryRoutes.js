const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { requireRole } = require('../middleware/requireRole')

const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController')

router.use(protect)

router.get('/', getInquiries)
router.get('/:id', getInquiryById)
router.post('/', createInquiry)
router.put('/:id', updateInquiry)
router.delete('/:id', requireRole('admin'), deleteInquiry)

module.exports = router
