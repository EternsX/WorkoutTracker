// authApi.js
import { userUrl, loginUrl, registerUrl, logoutUrl, verifyUrl, updateUsernameUrl, updateEmailUrl, deleteAccountUrl } from "../../api/auth.api";
import { request } from "../../utils/apiHelpers";

export const fetchUserApi = () => request(userUrl);

export const loginApi = async (usernameOrEmail, password) => {
  const data = await request(loginUrl, {
    method: "POST",
    body: JSON.stringify({ usernameOrEmail, password })
  });

  if (data?.token) {
    localStorage.setItem("token", data.token); // ✅ store token
  }

  return data;
};

export const registerApi = async (username, email, password) => {
  const data = await request(registerUrl, {
    method: "POST",
    body: JSON.stringify({ username, email, password })
  });

  if (data?.token) {
    localStorage.setItem("token", data.token); // ✅ SAVE TOKEN
  }

  return data;
};

export const logoutApi = () => request(logoutUrl);

export const verifyApi = (token) => request(verifyUrl(token));

export const updateUsernameApi = (username) => request(updateUsernameUrl, {
  method: "PUT",
  body: JSON.stringify({ username })
});

export const updateEmailApi = (email) => request(updateEmailUrl, {
  method: "PUT",
  body: JSON.stringify({ email })
});

export const deleteAccountApi = () => request(deleteAccountUrl, {
  method: "DELETE"
});