const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id

    const [productCount, openInquiryCount, closedInquiryCount, recentInquiries] =
      await Promise.all([
        Product.countDocuments({ userId }),
        Inquiry.countDocuments({ userId, status: { $in: ['New', 'Contacted', 'Follow-up'] } }),
        Inquiry.countDocuments({ userId, status: 'Closed' }),
        Inquiry.find({ userId })
          .sort({ date: -1 })
          .limit(5)
          .select('customerName productInterest status date'),
      ])

    res.json({ productCount, openInquiryCount, closedInquiryCount, recentInquiries })
  } catch (error) {
    next(error)
  }
}

module.exports = { getDashboard };
