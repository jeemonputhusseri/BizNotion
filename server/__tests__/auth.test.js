const request = require('supertest')
const app = require('../server')
const db = require('./setup')

beforeAll(async () => {
  await db.connect()
})

beforeEach(async () => {
  await db.clear()
})

afterAll(async () => {
  await db.close()
})

describe('POST /api/auth/register', () => {
  it('creates a new user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('test@test.com')
    expect(res.body.user).not.toHaveProperty('passwordHash')
  })

  it('rejects duplicate email with 409', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Email already registered')
  })

  it('rejects password shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'short' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Password must be at least 8 characters')
  })

  it('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123' })
  })

  it('returns a token with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.name).toBe('Test User')
  })

  it('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('rejects non existent email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'password123' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })
})
