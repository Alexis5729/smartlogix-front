import { getInventoryItems } from "../api/inventoryApi";

export async function getInventoryItemsWithAvailable() {
    const items = await getInventoryItems();

    return items.map((item) => ({
        ...item,
        available: item.availableQuantity - item.reservedQuantity,
    }));
}