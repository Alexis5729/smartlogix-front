export function generateSmartRecommendations({ inventory = [], orders = [], shipments = [] }) {
  const recommendations = [];

  inventory.forEach((item) => {
    const available = item.availableQuantity - item.reservedQuantity;

    if (available <= item.reorderLevel) {
      recommendations.push({
        priority: "Alta",
        type: "Inventario",
        title: `Reponer ${item.sku}`,
        message: `${item.productName} está bajo el nivel de reposición.`,
        action: `Disponible: ${available} / mínimo sugerido: ${item.reorderLevel}`,
      });
    }
  });

  orders.forEach((order) => {
    if (order.status === "FAILED" || order.status === "REJECTED") {
      recommendations.push({
        priority: "Alta",
        type: "Pedidos",
        title: `Revisar ${order.orderNumber}`,
        message: `El pedido está en estado ${order.status}.`,
        action: order.reason || "Validar stock o servicio de envíos.",
      });
    }

    if (!order.trackingCode && order.status !== "FAILED" && order.status !== "REJECTED") {
      recommendations.push({
        priority: "Media",
        type: "Pedidos",
        title: `Pedido sin tracking`,
        message: `${order.orderNumber} aún no tiene seguimiento.`,
        action: "Coordinar despacho o generación de tracking.",
      });
    }
  });

  shipments.forEach((shipment) => {
    if (shipment.status === "PLANNED") {
      recommendations.push({
        priority: "Media",
        type: "Envíos",
        title: `Despacho pendiente`,
        message: `${shipment.trackingCode} está planificado.`,
        action: "Actualizar estado cuando salga a ruta.",
      });
    }
  });

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "Baja",
      type: "Sistema",
      title: "Operación estable",
      message: "No se detectaron riesgos críticos.",
      action: "Mantener seguimiento operativo normal.",
    });
  }

  return recommendations.slice(0, 3);
}