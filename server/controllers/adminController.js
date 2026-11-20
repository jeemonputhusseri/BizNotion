const User = require('../models/User')
const Product = require('../models/Product')
const Inquiry = require('../models/Inquiry')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 })

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [productCount, inquiryCount] = await Promise.all([
          Product.countDocuments({ userId: user._id }),
          Inquiry.countDocuments({ userId: user._id })
        ])

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          productCount,
          inquiryCount
        }
      })
    )

    res.json(usersWithStats)
  } catch (error) {
    next(error)
  }
}

const getUserProducts = async (req, res, next) => {
  try {
    const { userId } = req.params
    const products = await Product.find({ userId }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    next(error)
  }
}

const getUserInquiries = async (req, res, next) => {
  try {
    const { userId } = req.params
    const inquiries = await Inquiry.find({ userId }).sort({ date: -1 })
    res.json(inquiries)
  } catch (error) {
    next(error)
  }
}

module.exports = { getUsers, getUserProducts, getUserInquiries }

