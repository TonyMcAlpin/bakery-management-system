import axios from "axios";

const API_URL =
  "http://localhost:5000/auth";

export async function login(
  username,
  password
) {
  const response =
    await axios.post(
      `${API_URL}/login`,
      {
        username,
        password,
      }
    );

  return response.data;
}

export function logout() {
  localStorage.removeItem(
    "token"
  );
}

export function saveToken(
  token
) {
  localStorage.setItem(
    "token",
    token
  );
}

export function getToken() {
  return localStorage.getItem(
    "token"
  );
}

export function isAuthenticated() {
  return !!getToken();
}