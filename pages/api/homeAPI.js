import Cookies from "js-cookie";

const BASE_URL = "https://barani-iq-backend.herokuapp.com";

export const addNewPost = async (values, callback) => {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "POST",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.post, null);
};

export const getAllPosts = async (callback) => {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "GET",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.post, null);
};

export const deletePost = async (postId, callback) => {
  const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "DELETE",
  });

  return callback("Post has been deleted", null);
};

export const AddorRemoveLike = async (postId, callback) => {
  const res = await fetch(`${BASE_URL}/api/posts/like/${postId}`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "PUT",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.post, null);
};

export const AddorRemoveSave = async (postId, callback) => {
  const res = await fetch(`${BASE_URL}/api/posts/save/${postId}`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "PUT",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.post, null);
};

export const userProfile = async (callback) => {
  const res = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "GET",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};

export const updateUserProfile = async (data, callback) => {
  const res = await fetch(`${BASE_URL}/api/users/update`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "PUT",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};

export const getAllUsers = async (callback) => {
  const res = await fetch(`${BASE_URL}/api/users/all`, {
    headers: {
      "Content-Type": "application/json",
      token: Cookies.get("authToken"),
    },
    method: "GET",
  });

  const result = await res.json();
  if (result.status === "error") return callback(null, result.errorMsg);
  return callback(result.user, null);
};
