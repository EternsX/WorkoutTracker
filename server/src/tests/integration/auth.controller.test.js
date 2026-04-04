import request from 'supertest';
import express from 'express';
import * as authService from '../../services/auth.service.js';
import {
  register,
  login,
  logout,
  user as getUser
} from '../../controllers/auth.controller.js';

import { validate } from '../../middleware/validate.js';
import {
  registerSchema,
  loginSchema
} from '../../validators/auth.validator.js';

jest.mock('../../services/auth.service.js');

const app = express();
app.use(express.json());

// ✅ Routes WITH validation
app.post('/register', validate(registerSchema), register);
app.post('/login', validate(loginSchema), login);
app.post('/logout', logout);
app.get('/user', getUser);

// ✅ Error handler (important for failed tests)
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message
  });
});

describe('Auth Controller', () => {

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= REGISTER =================

  describe('POST /register', () => {

    test('should return user + token', async () => {
      authService.register.mockResolvedValue({
        id: 1,
        username: 'test'
      });

      const res = await request(app)
        .post('/register')
        .send({ username: 'test', password: '123456' });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.username).toBe('test');
      expect(res.body.token).toBeDefined();
    });

    test('should fail if username already exists', async () => {
      const error = new Error('Username already exists');
      error.statusCode = 400;

      authService.register.mockRejectedValue(error);

      const res = await request(app)
        .post('/register')
        .send({ username: 'test', password: '123456' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Username already exists');
    });

    test('should fail validation with bad input', async () => {
      const res = await request(app)
        .post('/register')
        .send({ username: '', password: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(authService.register).not.toHaveBeenCalled(); // 🔥 important
    });

  });

  // ================= LOGIN =================

  describe('POST /login', () => {

    test('should return user + token', async () => {
      authService.login.mockResolvedValue({
        id: 1,
        username: 'test'
      });

      const res = await request(app)
        .post('/login')
        .send({ username: 'test', password: '123456' });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.username).toBe('test');
      expect(res.body.token).toBeDefined();
    });

    test('should fail with invalid credentials', async () => {
      const error = new Error('Invalid username or password');
      error.statusCode = 401;

      authService.login.mockRejectedValue(error);

      const res = await request(app)
        .post('/login')
        .send({ username: 'test', password: 'wrong' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid username or password');
    });

    test('should fail validation with missing fields', async () => {
      const res = await request(app)
        .post('/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(authService.login).not.toHaveBeenCalled(); // 🔥 important
    });

  });

  // ================= LOGOUT =================

  describe('POST /logout', () => {

    test('should return logout message', async () => {
      const res = await request(app).post('/logout');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Logged out');
    });

  });

  // ================= GET USER =================

  describe('GET /user', () => {

    test('should return null if no user', async () => {
      const res = await request(app).get('/user');

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeNull();
    });

    test('should return user if authenticated', async () => {
      app.get('/user-auth-test', (req, res, next) => {
        req.user = { id: 1, username: 'test' };
        next();
      }, getUser);

      const res = await request(app).get('/user-auth-test');

      expect(res.statusCode).toBe(200);
      expect(res.body.user.username).toBe('test');
    });

  });

});