import * as authService from '../../services/auth.service.js';
import { query } from '../../config/db.js';
import bcrypt from 'bcrypt';

jest.mock('../../config/db.js', () => ({
  query: jest.fn()
}));

jest.mock('bcrypt');

describe('Auth Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('register should create user', async () => {
    bcrypt.hash.mockResolvedValue('hashed_pw');

    query.mockResolvedValue({
      rows: [{ id: 1 }]
    });

    const result = await authService.register({
      username: 'test',
      email: 'test@example.com',
      password: '1234'
    });

    expect(result).toEqual({ id: 1 });
    expect(query).toHaveBeenCalled();
  });

  test('register should throw if username exists', async () => {
    bcrypt.hash.mockResolvedValue('hashed_pw');

    query.mockRejectedValue({
      code: "23505",
      detail: "username already exists"
    });

    await expect(
      authService.register({ username: 'test', email: 'test@example.com', password: '1234' })
    ).rejects.toThrow('Username already exists');
  });

  test('login should return user if credentials valid', async () => {
    query.mockResolvedValue({
      rows: [{ id: 1 }]
    });

    bcrypt.compare.mockResolvedValue(true);

    const result = await authService.login({
      usernameOrEmail: 'test',
      password: '1234'
    });

    expect(result).toEqual({ id: 1 });
  });

  test('login should fail with wrong password', async () => {
    query.mockResolvedValue({
      rows: [{ id: 1 }]
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({ usernameOrEmail: 'test', password: 'wrong' })
    ).rejects.toThrow('Invalid username or password');
  });

  test('verify should throw if user invalid', async () => {
    query.mockResolvedValue({ rows: [] });

    await expect(
      authService.verify({ id: 999 })
    ).rejects.toThrow('User not found');
  });

  test('verify should succeed if user exists', async () => {
    query.mockResolvedValue({ rows: [{ id: 999 }] });

    await expect(
      authService.verify({ id: 999 })
    ).resolves.toEqual({ id: 999 });
  });
});
