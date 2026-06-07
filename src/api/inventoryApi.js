import axios from "axios";
import { getAuthHeaders } from "../middleware/authHeaders";

const API_URL = "http://localhost:8080";

export async function getInventoryItems() {
  const response = await axios.get(`${API_URL}/api/inventory/items`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}