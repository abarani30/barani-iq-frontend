import Cookies from "js-cookie";
const BASE_URL = "https://barani-iq-backend.herokuapp.com";

export const addNewUser = async (values, callback) => {
  const res = await fetch(`${BASE_URL}/api/users/register`, {
    body: JSON.stringify(values),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};

export const userLogin = async (values, callback) => {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    body: JSON.stringify(values),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};

export const updateUserPassword = async (email, callback) => {
  const res = await fetch(`${BASE_URL}/api/users/forgot-password`, {
    body: JSON.stringify(email),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};

export const isAuthenticated = async (callback) => {
  const res = await fetch(`${BASE_URL}/api/users/isAuthenticated`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "POST",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};
