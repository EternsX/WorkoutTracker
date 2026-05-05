import { request } from "../../utils/apiHelpers";
import { createExerciseUrl, delExerciseUrl, updateExerciseTypeUrl, updateExerciseUrl, getExercisesUrl, updateRestTimesUrl, swapExerciseAPI } from "../../api/exercises.api";

export const getExercisesApi = (workoutId) => request(getExercisesUrl(workoutId));

export const createExerciseApi = (name, workoutId) =>
  request(createExerciseUrl(workoutId), {
    method: "POST",
    body: JSON.stringify({ name })
  });

export const updateExerciseApi = (name, workoutId, workoutExerciseId) =>
  request(updateExerciseUrl(workoutId, workoutExerciseId), {
    method: "PUT",
    body: JSON.stringify({ name })
  });

export const updateRestTimersApi = (restFields, workoutId, workoutExerciseId) =>
  request(updateRestTimesUrl(workoutId, workoutExerciseId), {
    method: "PATCH",
    body: JSON.stringify({ ...restFields })
  });

export const updateExerciseTypeApi = (type, workoutId, workoutExerciseId) =>
  request(updateExerciseTypeUrl(workoutId, workoutExerciseId), {
    method: "PATCH",
    body: JSON.stringify({ type })
  });

export const deleteExerciseApi = (workoutId, workoutExerciseId) =>
  request(delExerciseUrl(workoutId, workoutExerciseId), { method: "DELETE" });

export const swapExercisesApi = (workoutId, targetId, sourceId) =>
  request(swapExerciseAPI(workoutId, sourceId), {
    method: "PATCH",
    body: JSON.stringify({ targetId })
  });