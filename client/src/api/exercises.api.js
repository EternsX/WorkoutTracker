import { BASE_URL } from "./base_url";

const workoutExercisesUrl = (workoutId) =>
  `${BASE_URL}/workouts/${workoutId}/exercises`;

export const createExerciseUrl = (workoutId) =>
  workoutExercisesUrl(workoutId);

export const getExercisesUrl = (workoutId) =>
  workoutExercisesUrl(workoutId);

export const delExerciseUrl = (workoutId, workoutExerciseId) =>
  `${workoutExercisesUrl(workoutId)}/${workoutExerciseId}`;

export const updateExerciseUrl = (workoutId, workoutExerciseId) =>
  `${workoutExercisesUrl(workoutId)}/${workoutExerciseId}`;

export const updateRestTimesUrl = (workoutId, workoutExerciseId) =>
  `${workoutExercisesUrl(workoutId)}/${workoutExerciseId}/rest`;

export const updateExerciseTypeUrl = (workoutId, workoutExerciseId) =>
  `${workoutExercisesUrl(workoutId)}/${workoutExerciseId}/type`;