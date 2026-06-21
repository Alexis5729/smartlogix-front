import axios from "axios";
import { getAuthHeaders } from "../middleware/authHeaders";

const API_URL = "http://localhost:8080";

export async function getInventoryItems() {
  const response = await axios.get(`${API_URL}/api/inventory/items`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function createInventoryItem(itemData) {
  const response = await axios.post(
    `${API_URL}/api/inventory/items`,
    itemData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}

export async function deleteInventoryItem(sku) {
  await axios.delete(`${API_URL}/api/inventory/items/${sku}`, {
    headers: getAuthHeaders(),
  });
}

export async function updateInventoryItem(sku, itemData) {
  const response = await axios.put(
    `${API_URL}/api/inventory/items/${sku}`,
    itemData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}