// workoutsApi.js
import { request } from "../../utils/apiHelpers";
import { createWorkoutUrl, delWorkoutUrl, updateWorkoutUrl, getWorkoutsUrl } from "../../api/workouts.api";

export const getWorkoutsApi = () => request(getWorkoutsUrl);
export const createWorkoutApi = (name) =>
  request(createWorkoutUrl, { method: "POST", body: JSON.stringify({ name }) });
export const updateWorkoutApi = (workoutId, name) =>
  request(updateWorkoutUrl(workoutId), { method: "PUT", body: JSON.stringify({ name }) });
export const deleteWorkoutApi = (workoutId) =>
  request(delWorkoutUrl(workoutId), { method: "DELETE" });