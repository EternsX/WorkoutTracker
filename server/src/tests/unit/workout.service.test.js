import * as workoutService from '../../services/workouts.service.js';
import { query } from '../../config/db.js';
import { doesUserOwnWorkout } from '../../config/validations.js';

jest.mock('../../config/db.js', () => ({
  query: jest.fn()
}));

jest.mock('../../config/validations.js', () => ({
  doesUserOwnWorkout: jest.fn()
}));

describe('Workout Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createWorkout should insert workout', async () => {
    query.mockResolvedValue({
      rows: [{ id: 1, name: 'Push Day' }]
    });

    const result = await workoutService.createWorkout('Push Day', 1);

    expect(result).toEqual({ id: 1, name: 'Push Day' });
  });

  test('getWorkouts should return workouts', async () => {
    query.mockResolvedValue({
      rows: [{ id: 1, name: 'Push Day' }]
    });

    const result = await workoutService.getWorkouts(1);

    expect(result.length).toBe(1);
  });

  test('updateWorkout should throw if not owner', async () => {
    doesUserOwnWorkout.mockResolvedValue(false);

    await expect(
      workoutService.updateWorkout('New', 1, 1)
    ).rejects.toEqual({ statusCode: 403, message: 'Access denied' });
  });

});