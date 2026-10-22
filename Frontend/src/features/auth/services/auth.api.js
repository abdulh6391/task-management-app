import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "http://localhost:3005/api",
  withCredentials: true,
});

export async function registerUser({ username, email, password }) {
  const response = await authApiInstance.post("/register", {
    username: username.trim(),
    email: email.trim(),
    password,
  });

  return response.data;
}

export async function loginUser({ identifier, password }) {
  const response = await authApiInstance.post("/login", {
    identifier: identifier.trim(),
    password: password.trim(),
  });
  return response.data;
}

export async function getCurrentUser() {
  const response = await authApiInstance.get("/me");
  return response.data;
}
