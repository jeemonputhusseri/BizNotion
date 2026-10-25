const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

router.use(protect)
// all product routes require auth

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
