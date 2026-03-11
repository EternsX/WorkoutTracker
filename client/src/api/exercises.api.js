import { BASE_URL } from "./base_url";

const workoutExercisesUrl = (workoutId) =>
  `${BASE_URL}/workouts/${workoutId}/exercises`;

export const createExerciseUrl = (workoutId) =>
  workoutExercisesUrl(workoutId);

export const getExercisesUrl = (workoutId) =>
  workoutExercisesUrl(workoutId);

export const delExerciseUrl = (workoutId, exerciseId) =>
  `${workoutExercisesUrl(workoutId)}/${exerciseId}`;

export const updateExerciseUrl = (workoutId, exerciseId) =>
  `${workoutExercisesUrl(workoutId)}/${exerciseId}`;