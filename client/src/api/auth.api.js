import { BASE_URL } from "./base_url";
const API_URL = `${BASE_URL}/auth`;

export const userUrl = `${API_URL}/user`;
export const loginUrl = `${API_URL}/login`;
export const registerUrl = `${API_URL}/register`;
export const logoutUrl = `${API_URL}/logout`;
export const verifyUrl = (token) => `${API_URL}/verify/${token}`;
export const updateUsernameUrl = `${API_URL}/update-username`;
export const updateEmailUrl = `${API_URL}/update-email`;
export const deleteAccountUrl = `${API_URL}/delete-account`;