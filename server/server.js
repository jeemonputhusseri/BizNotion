require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

// only connect to db when not running tests
// tests handle the connection via mongodbmemoryserver in setup.js
if (process.env.NODE_ENV !== 'test') {
  connectDB()
}

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BizNotion API is running' })
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
// app.use('/api/inquiries', require('./routes/inquiryRoutes'))
// app.use('/api/dashboard', require('./routes/dashboardRoutes'))
// app.use('/api/payments', require('./routes/paymentRoutes'))

app.use(require('./middleware/errorMiddleware'))

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
  })
}

module.exports = app
