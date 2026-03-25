// authApi.js
import { userUrl, loginUrl, registerUrl, logoutUrl } from "../../api/auth.api";
import { request } from "../../utils/apiHelpers";

export const fetchUserApi = () => request(userUrl);

export const loginApi = async (username, password) => {
  const data = await request(loginUrl, {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  if (data?.token) {
    localStorage.setItem("token", data.token); // ✅ store token
  }

  return data;
};

export const registerApi = async (username, password) => {
  const data = await request(registerUrl, {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  if (data?.token) {
    localStorage.setItem("token", data.token); // ✅ SAVE TOKEN
  }

  return data;
};

export const logoutApi = () => request(logoutUrl);