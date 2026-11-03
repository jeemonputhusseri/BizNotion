require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();

// only connect to db when not running tests
// tests handle the connection via mongodbmemoryserver in setup.js
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(cors());
app.use(express.json());

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
})
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many auth attempts, please try again later' },
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BizNotion API is running' })
})

app.use('/api/auth', authLimiter, require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/inquiries', require('./routes/inquiryRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
// app.use('/api/payments', require('./routes/paymentRoutes'))

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
  })
}

module.exports = app;
