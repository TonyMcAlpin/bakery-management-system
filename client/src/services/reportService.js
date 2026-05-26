import axios from "axios";

const API_URL =
  "https://bakery-management-system-gzme.onrender.com/reports";

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

export async function getSummaryReport(
  startDate,
  endDate
) {
  const response =
    await axios.get(
      `${API_URL}/summary`,
      {
        params: {
          startDate,
          endDate,
        },

        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    );

  return response.data;
}