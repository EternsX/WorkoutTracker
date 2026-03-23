import { BASE_URL } from "./base_url";
const API_URL = `${BASE_URL}/session`;

export const startSessionUrl = (workoutId) => `${API_URL}/${workoutId}/start`;
export const getSessionUrl = `${API_URL}/`;
export const updateProgressUrl = (sessionId) => `${API_URL}/${sessionId}/progress`;
export const endSessionUrl = (sessionId) => `${API_URL}/${sessionId}/end`;