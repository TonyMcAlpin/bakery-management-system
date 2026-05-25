import axios from "axios";

const API_URL =
  "https://bakery-management-system-gzme.onrender.com/auth";
  
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

export async function getPurchases() {
  const response =
    await axios.get(
      API_URL,
      getAuthHeaders()
    );

  return response.data;
}

export async function addPurchase(
  purchase
) {
  const response =
    await axios.post(
      API_URL,
      purchase,
      getAuthHeaders()
    );

  return response.data;
}

export async function deletePurchase(
  id
) {
  const response =
    await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );

  return response.data;
}