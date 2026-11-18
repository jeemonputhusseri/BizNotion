# BizNotion

A small business CRM for tracking products and customer inquiries. MERN stack with JWT auth and Razorpay payments. This is my capstone project for the Scaler Neovarsity MS CS program.

## Live Demo

Frontend: https://biznotion.netlify.app

Backend API: https://biznotion-api.onrender.com

## What it does

A small business owner needs one place to manage their product catalog and keep up with who is asking about what. So BizNotion lets you add products and tag them as Draft, Listed, or Sold. When a customer reaches out, you log an inquiry and move it through a pipeline: New, Contacted, Follow up, Closed. There is a dashboard page that shows you counts and the most recent inquiries so you can see what needs attention without digging.

Razorpay is wired in on the product side. A customer can pay for a Listed product through the Razorpay checkout, and once the payment verifies, the product gets marked Sold automatically.

## Features

- User registration and login with JWT auth, passwords hashed with bcrypt
- Product CRUD with status tracking (Draft, Listed, Sold)
- Inquiry CRUD with a status pipeline (New, Contacted, Follow-up, Closed)
- Dashboard page with aggregate counts and recent inquiries at a glance
- Razorpay payment integration - checkout verifies and auto-marks the product Sold
- Pagination and filtering on all list endpoints
- Input validation on every write operation
- Protected routes on the frontend - unauthenticated users get bounced to login
- Axios interceptor auto-attaches the JWT and handles 401s by clearing storage and redirecting
- Security middleware: Helmet headers, rate limiting, and NoSQL injection sanitization
- Responsive UI built with Tailwind CSS and shadcn/ui
- Backend tests with Jest, Supertest, and an in-memory MongoDB

## Tech stack

Backend runs on Node.js with Express v5 and MongoDB through Mongoose v9.
Auth uses JWT signed with a secret, passwords hashed with bcrypt.
Helmet handles HTTP header security and there is rate limiting on all routes (tighter on auth).
Razorpay handles payments.
Tests run on Jest with Supertest, and mongodb-memory-server gives each test run a throwaway database so nothing ever touches your real Atlas instance.

Frontend is React 19 with Vite 8.
Routing is React Router v7, HTTP goes through Axios with an interceptor that attaches the JWT.
Styling is Tailwind CSS v4 with shadcn/ui components, and lucide-react for icons.
Auth state lives in a React Context (AuthProvider) since there is not much global state to justify Redux or anything heavier.

## Getting started

You need Node.js 18+, a MongoDB Atlas connection string, and Razorpay test keys (the test mode keys work fine for local dev).

Clone the repo and install both sides:

```
cd server && npm install
cd ../client && npm install
```

### Environment variables

Drop a `.env` in `server/` with these:

```
MONGO_URI=your_atlas_connection_string
JWT_SECRET=pick_a_long_random_string
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

And one in `client/`:

```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Both are gitignored already, so they will not end up in a commit.

### Running it

From `server/`, `npm run dev` starts the API on port 5000 with nodemon for auto-reload. Use `npm start` for production.

From `client/`, `npm run dev` fires up the Vite dev server on 5173. It sends API requests to whatever `VITE_API_URL` points at, so as long as that matches your backend you are good. `npm run build` outputs a production bundle to `dist/`.

### Tests

`npm test` from `server/`. The setup file in `__tests__/` spins up an in-memory MongoDB before anything runs and the teardown file closes it after. Tests run in band so they do not trip over each other. Right now there are auth tests; product and inquiry tests are next on the list.

## Project structure

```
server/
  config/db.js              - mongoose connection
  controllers/               - auth, product, inquiry, dashboard, payment
  middleware/                - auth, requireRole, error handler
  models/                   - User, Product, Inquiry
  routes/                   - auth, product, inquiry, dashboard, payment
  validators/               - input validation
  __tests__/                - setup, teardown, auth tests
  server.js                 - express app and entry point
  jest.config.js

client/src/
  api/axiosInstance.js      - axios instance with request/response interceptors
  components/
    common/                  - NavBar, ProtectedRoute, StatusBadge, Layout
    dashboard/               - StatCard, RecentInquiries
    inquiries/               - InquiryCard, InquiryList
    products/                - ProductCard, ProductList, PaymentButton
    ui/                      - shadcn/ui components
  context/AuthProvider.jsx
  hooks/useAuth.js
  lib/utils.js              - cn() className helper
  pages/                    - Login, Register, Dashboard, Products, ProductForm, Inquiries, InquiryForm
```

## API

Everything except the auth routes needs `Authorization: Bearer <token>` in the header.

```
POST   /api/auth/register            - register, no auth
POST   /api/auth/login               - login, returns JWT, no auth

GET    /api/products                 - list, paginated and filterable
POST   /api/products                 - create
PUT    /api/products/:id             - update
DELETE /api/products/:id             - delete

GET    /api/inquiries                - list, paginated and filterable
POST   /api/inquiries                - create
PUT    /api/inquiries/:id            - update
DELETE /api/inquiries/:id            - delete

GET    /api/dashboard                - counts and recent inquiries

POST   /api/payments/create-order    - create a Razorpay order
POST   /api/payments/verify          - verify signature, mark product Sold
```

The list endpoints take `?page=` and `?limit=` (default page 1, limit 10, max 50). The response gives you back `data`, `totalCount`, `currentPage`, `totalPages`, and `limit`, so the frontend has everything it needs to render pagination in one trip.

Errors always come back as `{ "message": "..." }`. Controllers catch unexpected errors and hand them to `next(err)`, and a central error middleware shapes the response so the client always knows what to parse.

## Data models

The User model stores `name`, `email` (unique, lowercased), a bcrypt `passwordHash`, and a `role` that defaults to "user". The password never gets stored or returned in plaintext.

Product has a `userId` ref back to the owner, plus `name`, `category`, `price`, and a `status` field that goes Draft -> Listed -> Sold (defaults to Draft). There are optional `description`, `imageUrl`, and `notes` fields, and Mongoose timestamps handle createdAt/updatedAt.

Inquiry also refs the owning user. It has `customerName`, `contact` (phone or email), an optional `productInterest`, a `status` that runs New -> Contacted -> Follow-up -> Closed (defaults to New), and `notes`. The `date` field defaults to `Date.now` without parentheses, so Mongoose calls the function when a new inquiry is created rather than stamping every record with the server start time.

## How auth works

When someone registers or logs in, the server signs a JWT with `JWT_SECRET` and sends it back. The client drops it in localStorage, and the Axios request interceptor sticks it in the Authorization header on every call after that. If the server ever responds with 401, the response interceptor wipes the token and redirects to /login. On the server side, `authMiddleware` decodes the token and puts the user id on `req.user` so controllers know who is making the request.

The `ProtectedRoute` component on the frontend is the gatekeeper for pages that need a login. It checks whether there is a user in context, and if not, it bounces you to /login instead of rendering the page.

## How payments work

It starts when a user clicks the pay button on a Listed product. The frontend calls `/api/payments/create-order` with the product id, the server creates a Razorpay order, and the checkout dialog opens with that order. Once the customer pays, Razorpay sends back a payment id and a signature. The frontend forwards those to `/api/payments/verify`, the server checks the signature against the Razorpay key secret, and if it all checks out the product status gets set to Sold.

## Security

Helmet sets safe HTTP headers on responses. Rate limiting is 100 requests per 15 minutes across the board, but auth routes are capped at 10 per 15 minutes since brute force is the main concern there. One thing worth calling out: express-mongo-sanitize does not work with Express v5 because `req.query` became read-only, so there is a small custom middleware that strips any key starting with `$` from `req.body` and `req.params` to block NoSQL operator injection. Passwords are hashed with bcrypt before they are saved, and plaintext is never stored or sent back.


## Deployment

Deploy the backend first, because the frontend needs to know its URL.

### Backend on Render

Create a new web service pointing at the repo with the root directory set to `server`. Build command is `npm install` and start command is `npm start`. Then set the environment variables in the Render dashboard:

- `MONGO_URI` - your Atlas connection string (make sure the IP allowlist includes Render's outbound IPs)
- `JWT_SECRET` - a fresh long random string, not your dev one
- `PORT` - Render sets this automatically, but you can leave the default
- `NODE_ENV` - set to production
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` - use your live keys for a real deployment


### Frontend on Netlify

Create a new site from the repo with the base directory set to `client`. Build command is `npm run build` and the publish directory is `dist`. Set two environment variables:

- `VITE_API_URL` - the Render backend URL from the step above
- `VITE_RAZORPAY_KEY_ID` - your Razorpay key id

One gotcha to watch for: React Router handles client-side routing, but Netlify serves static files. If someone refreshes on `/products` or `/dashboard`, Netlify looks for a file at that path and 404s. To fix it, add a `_redirects` file in `client/public/` with this single line:

```
/*  /index.html  200
```

That tells Netlify to serve index.html for any route and let React Router sort it out. The file gets copied into `dist/` at build time.


## Scripts

server/
- `npm run dev` - nodemon with auto-reload
- `npm start` - production start
- `npm test` - jest test suite

client/
- `npm run dev` - vite dev server
- `npm run build` - production build
- `npm run lint` - eslint
- `npm run format` - prettier write
