export function getOrderStatusLabel(status) {
  const labels = {
    PENDING: "Pendiente",
    SHIPMENT_REQUESTED: "Listo para despacho",
    REJECTED: "Rechazado",
    FAILED: "Error operativo",
    COMPLETED: "Completado",
  };

  return labels[status] || status;
}

export function getShipmentStatusLabel(status) {
  const labels = {
    PLANNED: "Planificado",
    IN_TRANSIT: "En ruta",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  };

  return labels[status] || status;
}