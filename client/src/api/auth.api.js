import { BASE_URL } from "./base_url";
const API_URL = `${BASE_URL}/auth`;
console.log(import.meta.env)
console.log(BASE_URL)
export const userUrl = `${API_URL}/user`;
export const loginUrl = `${API_URL}/login`;
export const registerUrl = `${API_URL}/register`;
export const logoutUrl = `${API_URL}/logout`;