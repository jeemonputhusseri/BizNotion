const crypto = require('crypto')
const Razorpay = require('razorpay')
const Product = require('../models/Product')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res, next) => {
  try {
    const { productId } = req.body

    if (!productId) {
      const err = new Error('productId is required')
      err.status = 400
      return next(err)
    }

    const product = await Product.findOne({ _id: productId, userId: req.user.id })
    if (!product) {
      const err = new Error('Product not found')
      err.status = 404
      return next(err)
    }

    if (product.status !== 'Listed') {
      const err = new Error('Only Listed products can be sold')
      err.status = 400
      return next(err)
    }

    const order = await razorpay.orders.create({
      amount: Math.round(product.price * 100), // paise
      currency: 'INR',
      receipt: productId.toString(),
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    next(error)
  }
}

const verifyPayment = async (req, res, next) => {
  try {
    const { productId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      const err = new Error('Payment verification failed')
      err.status = 400
      return next(err)
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, userId: req.user.id },
      { status: 'Sold' },
      { new: true }
    )

    if (!product) {
      const err = new Error('Product not found')
      err.status = 404
      return next(err)
    }

    res.json({ message: 'Payment verified', product })
  } catch (error) {
    next(error)
  }
}

module.exports = { createOrder, verifyPayment };
