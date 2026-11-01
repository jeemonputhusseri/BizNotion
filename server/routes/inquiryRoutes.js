const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
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
router.delete('/:id', deleteInquiry)

module.exports = router
