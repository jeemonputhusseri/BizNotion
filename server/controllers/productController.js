const Product = require('../models/Product')
const { validateRequiredFields } = require('../validators/inputValidators')

const VALID_STATUSES = ['Draft', 'Listed', 'Sold']

// create product
const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, status, description, imageUrl, notes } = req.body

    // validate required fields
    const requiredError = validateRequiredFields(['name', 'category', 'price', 'status'], req.body)
    if (requiredError) {
      const err = new Error(requiredError)
      err.status = 400
      return next(err)
    }

    // validate price
    if (typeof price !== 'number' || price < 0) {
      const err = new Error('Price must be a non-negative number')
      err.status = 400
      return next(err)
    }

    // validate status
    if (!VALID_STATUSES.includes(status)) {
      const err = new Error('Invalid product status')
      err.status = 400
      return next(err)
    }

    const product = await Product.create({
      userId: req.user.id,
      name,
      category,
      price,
      status,
      description: description || '',
      imageUrl: imageUrl || null,
      notes: notes || '',
    })

    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}


module.exports = {
  createProduct,
}
