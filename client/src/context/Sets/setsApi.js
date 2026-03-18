// src/api/setsApi.js
import { request } from "../../utils/apiHelpers"; // your generic fetch wrapper
import { createSetUrl, delSetUrl, updateSetUrl, getSetsUrl } from "../../api/sets.api";

export const apiGetSets = async (workoutId, exerciseId) => {
  const result = await request(getSetsUrl(workoutId, exerciseId));
  return result;
};

export const apiCreateSet = async (reps, weight, workoutId, exerciseId) => {
  const result = await request(createSetUrl(workoutId, exerciseId), {
    method: "POST",
    body: JSON.stringify({ reps, weight: weight || 0 }),
  });
  return result;
};

export const apiUpdateSet = async (setId, reps, weight, workoutId, exerciseId) => {
  const result = await request(updateSetUrl(workoutId, exerciseId, setId), {
    method: "PUT",
    body: JSON.stringify({ reps, weight: weight || 0 }),
  });
  return result;
};

export const apiDeleteSet = async (setId, workoutId, exerciseId) => {
  const result = await request(delSetUrl(workoutId, exerciseId, setId), {
    method: "DELETE",
  });
  return result;
};