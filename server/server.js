require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

connectDB()


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BizNotion API is running' })
})


// routes - current plan
// app.use('/api/auth', require('./routes/authRoutes'))
// app.use('/api/products', require('./routes/productRoutes'))
// app.use('/api/inquiries', require('./routes/inquiryRoutes'))
// app.use('/api/dashboard', require('./routes/dashboardRoutes'))
// app.use('/api/payments', require('./routes/paymentRoutes'))

// error middleware
app.use(require('./middleware/errorMiddleware'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})

module.exports = app