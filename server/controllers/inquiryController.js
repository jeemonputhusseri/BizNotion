const Inquiry = require('../models/Inquiry')
const { validateRequiredFields } = require('../validators/inputValidators')

const VALID_STATUSES = ['New', 'Contacted', 'Follow-up', 'Closed']

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

    // validate status if provided
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

// list inquiries - scoped to user, optional status filter, sorted by date desc
const getInquiries = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = { userId: req.user.id }
    if (status && VALID_STATUSES.includes(status)) {
      filter.status = status
    }

    const inquiries = await Inquiry.find(filter).sort({ date: -1 })
    res.json({ data: inquiries, totalCount: inquiries.length, currentPage: 1, totalPages: 1, limit: 10 })
  } catch (error) {
    next(error)
  }
}

// get single inquiry by id
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
}
