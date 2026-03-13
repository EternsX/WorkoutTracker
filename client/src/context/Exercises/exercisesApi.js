import { request } from "../../utils/apiHelpers";
import { createExerciseUrl, delExerciseUrl, updateExerciseUrl, getExercisesUrl } from "../../api/exercises.api";

export const getExercisesApi = (workoutId) => request(getExercisesUrl(workoutId));

export const createExerciseApi = (name, workoutId) =>
  request(createExerciseUrl(workoutId), {
    method: "POST",
    body: JSON.stringify({ name })
  });

export const updateExerciseApi = (name, workoutId, exerciseId) =>
  request(updateExerciseUrl(workoutId, exerciseId), {
    method: "PUT",
    body: JSON.stringify({ name })
  });

export const deleteExerciseApi = (workoutId, exerciseId) =>
  request(delExerciseUrl(workoutId, exerciseId), { method: "DELETE" });