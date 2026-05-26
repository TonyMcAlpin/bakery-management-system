import axios from "axios";

const API_URL =
  "https://bakery-management-system-gzme.onrender.com/recipes";

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

export async function getRecipes() {
  const response =
    await axios.get(
      API_URL,
      getAuthHeaders()
    );

  return response.data;
}

export async function getRecipeById(
  id
) {
  const response =
    await axios.get(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );

  return response.data;
}

export async function addRecipe(
  recipe
) {
  const response =
    await axios.post(
      API_URL,
      recipe,
      getAuthHeaders()
    );

  return response.data;
}

export async function deleteRecipe(
  id
) {
  const response =
    await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );

  return response.data;
}

export async function updateRecipe(
  id,
  recipe
) {
  const response =
    await axios.put(
      `${API_URL}/${id}`,
      recipe,
      getAuthHeaders()
    );

  return response.data;
}

export async function getRecipeCost(
  id
) {
  const response =
    await axios.get(
      `${API_URL}/${id}/cost`,
      getAuthHeaders()
    );

  return response.data;
}