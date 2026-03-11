import { BASE_URL } from "./base_url";

const workoutSetsUrl = (workoutId, exerciseId) =>
  `${BASE_URL}/workouts/${workoutId}/${exerciseId}/sets`;

export const createSetUrl = (workoutId, exerciseId) =>
  workoutSetsUrl(workoutId, exerciseId);

export const getSetsUrl = (workoutId, exerciseId) =>
  workoutSetsUrl(workoutId, exerciseId);

export const delSetUrl = (workoutId, exerciseId, setId) =>
  `${workoutSetsUrl(workoutId, exerciseId)}/${setId}`;

export const updateSetUrl = (workoutId, exerciseId, setId) =>
  `${workoutSetsUrl(workoutId, exerciseId)}/${setId}`;