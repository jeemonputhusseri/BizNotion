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

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    const filter = { userId: req.user.id }
    if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status
    }

    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ])

    res.json({
      data: products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    })
  } catch (error) {
    next(error)
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id })
    if (!product) {
      const err = new Error('Product not found')
      err.status = 404
      return next(err)
    }
    res.json(product)
  } catch (error) {
    next(error)
  }
}


const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true, runValidators: true }
    )
    if (!product) { const err = new Error('Product not found'); err.status = 404; return next(err) }
    res.json(product)
  } catch (error) { next(error) }
}

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!product) { const err = new Error('Product not found'); err.status = 404; return next(err) }
    res.json({ message: 'Product deleted' })
  } catch (error) { next(error) }
}



module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
}
