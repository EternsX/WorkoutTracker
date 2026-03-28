import { request } from "../../utils/apiHelpers";
import { createExerciseUrl, delExerciseUrl, updateExerciseTypeUrl, updateExerciseUrl, getExercisesUrl, updateRestTimesUrl } from "../../api/exercises.api";

export const getExercisesApi = (workoutId) => request(getExercisesUrl(workoutId));

export const createExerciseApi = (name, workoutId) =>
  request(createExerciseUrl(workoutId), {
    method: "POST",
    body: JSON.stringify({ name })
  });

export const updateExerciseApi = (name, type, workoutId, exerciseId) =>
  request(updateExerciseUrl(workoutId, exerciseId), {
    method: "PUT",
    body: JSON.stringify({ name, type })
  });

export const updateRestTimersApi = (restFields, workoutId, exerciseId) =>
  request(updateRestTimesUrl(workoutId, exerciseId), {
    method: "PATCH",
    body: JSON.stringify({ ...restFields })
  });

export const updateExerciseTypeApi = (type, workoutId, exerciseId) =>
  request(updateExerciseTypeUrl(workoutId, exerciseId), {
    method: "PATCH",
    body: JSON.stringify({ type })
  });

export const deleteExerciseApi = (workoutId, exerciseId) =>
  request(delExerciseUrl(workoutId, exerciseId), { method: "DELETE" });