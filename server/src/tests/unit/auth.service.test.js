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
      rows: [{ id: 1, username: 'test' }]
    });

    const result = await authService.register({
      username: 'test',
      password: '1234'
    });

    expect(result).toEqual({ id: 1, username: 'test' });
    expect(query).toHaveBeenCalled();
  });

  test('register should throw if username exists', async () => {
    bcrypt.hash.mockResolvedValue('hashed_pw');

    query.mockResolvedValue({ rows: [] });

    await expect(
      authService.register({ username: 'test', password: '1234' })
    ).rejects.toThrow('Username already exists');
  });

  test('login should return user if credentials valid', async () => {
    query.mockResolvedValue({
      rows: [{ id: 1, username: 'test', password: 'hashed_pw' }]
    });

    bcrypt.compare.mockResolvedValue(true);

    const result = await authService.login({
      username: 'test',
      password: '1234'
    });

    expect(result).toEqual({ id: 1, username: 'test' });
  });

  test('login should fail with wrong password', async () => {
    query.mockResolvedValue({
      rows: [{ id: 1, username: 'test', password: 'hashed_pw' }]
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({ username: 'test', password: 'wrong' })
    ).rejects.toThrow('Invalid username or password');
  });

});