import { BASE_URL } from "./base_url";
const API_URL = `${BASE_URL}/workouts`;

export const createWorkoutUrl = `${API_URL}`;
export const delWorkoutUrl = (id) => `${API_URL}/${id}`;
export const updateWorkoutUrl = (id) => `${API_URL}/${id}`;
export const getWorkoutsUrl = `${API_URL}`;