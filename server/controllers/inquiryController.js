const Inquiry = require('../models/Inquiry');
const { validateRequiredFields } = require('../validators/inputValidators');

const VALID_STATUSES = ['New', 'Contacted', 'Follow-up', 'Closed'];

// create inquiry
const createInquiry = async (req, res, next) => {
  try {
    const { customerName, contact, productInterest, status, notes, date } = req.body

    const requiredError = validateRequiredFields(['customerName', 'contact', 'productInterest'], req.body)
    if (requiredError) {
      const err = new Error(requiredError)
      err.status = 400
      return next(err)
    }

    // validate status
    if (status && !VALID_STATUSES.includes(status)) {
      const err = new Error('Invalid inquiry status')
      err.status = 400
      return next(err)
    }

    const inquiry = await Inquiry.create({
      userId: req.user.id,
      customerName,
      contact,
      productInterest,
      status: status || 'New',
      notes: notes || '',
      date: date || Date.now(),
    })

    res.status(201).json(inquiry)
  } catch (error) {
    next(error)
  }
}

// list inquiries
const getInquiries = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    const filter = { userId: req.user.id }
    if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status
    }

    const [inquiries, totalCount] = await Promise.all([
      Inquiry.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ])

    res.json({
      data: inquiries,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    })
  } catch (error) {
    next(error)
  }
};

// get single inquiry
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.params.id, userId: req.user.id })
    if (!inquiry) {
      const err = new Error('Inquiry not found')
      err.status = 404
      return next(err)
    }
    res.json(inquiry)
  } catch (error) {
    next(error)
  }
}

// update inquiry
const updateInquiry = async (req, res, next) => {
  try {
    const { status } = req.body
    if (status && !VALID_STATUSES.includes(status)) {
      const err = new Error('Invalid inquiry status')
      err.status = 400
      return next(err)
    }

    const inquiry = await Inquiry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true, runValidators: true }
    )
    if (!inquiry) {
      const err = new Error('Inquiry not found')
      err.status = 404
      return next(err)
    }
    res.json(inquiry)
  } catch (error) {
    next(error)
  }
}

// delete inquiry
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!inquiry) {
      const err = new Error('Inquiry not found')
      err.status = 404
      return next(err)
    }
    res.json({ message: 'Inquiry deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
};
