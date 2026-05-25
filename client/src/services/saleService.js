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

export async function getSales() {
  const response =
    await axios.get(
      API_URL,
      getAuthHeaders()
    );

  return response.data;
}

export async function addSale(
  sale
) {
  const response =
    await axios.post(
      API_URL,
      sale,
      getAuthHeaders()
    );

  return response.data;
}

export async function deleteSale(
  id
) {
  const response =
    await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );

  return response.data;
}