import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadOrderService, saveOrder, removeOrder } from "../services/orderService";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";
import Button from "../components/Button";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState("Cliente Demo");
  const [customerEmail, setCustomerEmail] = useState("cliente@smartlogix.com");
  const [shippingAddress, setShippingAddress] = useState("Av. Principal 123");
  const [sku, setSku] = useState("SKU-1001");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(19990);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await loadOrderService();
      setOrders(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleCreateOrder(event) {
    event.preventDefault();

    const orderData = {
      customerName,
      customerEmail,
      shippingAddress,
      lines: [
        {
          sku,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
        },
      ],
    };

    try {
      await saveOrder(orderData);
      await loadOrders();
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el pedido. Revisa stock, JWT o servicios activos.");
    }
  }

  const handleDelete = async (orderNumber) => {
    try {
      await removeOrder(orderNumber);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-blue-100 to-stone-100">
          <PageContainer>
              <div className="min-h-screen bg-gradient-to-br from-rose-100 via-blue-100 to-stone-100 p-6">
                      <Navbar title="Pedidos" showBack variant="service" />

                    <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8 mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Crear pedido
                      </h2>

                      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nombre cliente" />
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email cliente" />
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Dirección envío" />
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="SKU" />
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                        type="number" value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Cantidad" />
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                        type="number" value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        placeholder="Precio unitario" />

                        <div className="mt-2">
                            <Button type="submit" variant="primary" size="md">
                                Crear pedido
                            </Button>
                        </div>
                      </form>
                    </div>

                    {loading && <p>Cargando pedidos...</p>}
                    {error && <p className="text-red-600 font-semibold">{error}</p>}

                    {!loading && (
                      <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8 mt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Listado de pedidos
                        </h2>

                        <table className="w-full border-collapse overflow-hidden rounded-2xl">
                          <thead>
                            <tr>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Número</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Estado</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Total</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Tracking</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Fecha</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order.orderNumber}>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{order.orderNumber}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{order.status}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">${order.totalAmount}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{order.trackingCode || "Sin tracking"}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{order.createdAt}</td>
                                <td>
                                  <Button variant="danger" size="del"
                                      onClick={() => handleDelete(order.orderNumber)}>
                                      Eliminar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
          </PageContainer>
      </div>

  );
}

export default OrdersPage;