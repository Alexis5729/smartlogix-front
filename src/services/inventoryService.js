import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "../api/inventoryApi";


export async function getInventoryItemsWithAvailable() {
  const items = await getInventoryItems();

  return items.map((item) => ({
    ...item,
    available: item.availableQuantity - item.reservedQuantity,
  }));
}

export async function saveInventoryItem(itemData) {
  return await createInventoryItem(itemData);
}

export async function editInventoryItem(sku, itemData) {
  return await updateInventoryItem(sku, itemData);
}

export async function removeInventoryItem(sku) {
  return await deleteInventoryItem(sku);
}
