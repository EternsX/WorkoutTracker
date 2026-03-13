// authApi.js
import { userUrl, loginUrl, registerUrl, logoutUrl } from "../../api/auth.api";
import { request } from "../../utils/apiHelpers";

export const fetchUserApi = () => request(userUrl);

export const loginApi = (username, password) =>
  request(loginUrl, { method: "POST", body: JSON.stringify({ username, password }) });

export const registerApi = (username, password) =>
  request(registerUrl, { method: "POST", body: JSON.stringify({ username, password }) });

export const logoutApi = () => request(logoutUrl);