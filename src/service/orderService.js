import { getOrders, createOrder, deleteOrder } from "../api/orderApi";

export async function loadOrderService() {
    return await getOrders();
}

export async function saveOrder(orderData) {
    return await createOrder(orderData);
}

export async function removeOrder(orderNumber) {
    return await deleteOrder(orderNumber);
}