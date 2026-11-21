require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const adminRoutes = require('./routes/adminRoutes')


const isTestEnv = process.env.NODE_ENV === 'test';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// only connect to db when not running tests
// tests handle the connection via mongodbmemoryserver in setup.js
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://biznotion.netlify.app'
    : 'http://localhost:5173',
}));

app.use(express.json());

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many auth attempts, please try again later' },
  })
  

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later' },
  })

  if (!isTestEnv) {
    app.use(helmet())
    app.use(limiter)
  }

app.use('/api/admin', adminRoutes)

// express-mongo-sanitize is incompatible with Express v5 (req.query is read-only)
// manually sanitize req.body and req.params by stripping keys starting with $
app.use((req, res, next) => {
  const stripDollar = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$')) {
          delete obj[key]
        } else {
          stripDollar(obj[key])
        }
      }
    }
  }
  stripDollar(req.body)
  stripDollar(req.params)
  next()
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BizNotion API is running' })
})

app.use('/api/auth', isTestEnv ? [] : authLimiter, require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/inquiries', require('./routes/inquiryRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
app.use('/api/payments', require('./routes/paymentRoutes'))

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
  })
}

module.exports = app;
