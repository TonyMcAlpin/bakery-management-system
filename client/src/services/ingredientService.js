import axios from "axios";

const API_URL =
  "https://bakery-management-system-gzme.onrender.com/ingredients";

function getAuthHeaders() {
  const token =
    localStorage.getItem(
      "token"
    );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getIngredients() {
  const response =
    await axios.get(
      API_URL,
      getAuthHeaders()
    );

  return response.data;
}

export async function addIngredient(
  ingredient
) {
  const response =
    await axios.post(
      API_URL,
      ingredient,
      getAuthHeaders()
    );

  return response.data;
}

export async function updateIngredient(
  id,
  ingredient
) {
  const response =
    await axios.put(
      `${API_URL}/${id}`,
      ingredient,
      getAuthHeaders()
    );

  return response.data;
}

export async function deleteIngredient(
  id
) {
  const response =
    await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );

  return response.data;
}