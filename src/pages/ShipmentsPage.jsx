import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadShipmentService, saveShipment, removeShipment } from "../services/shipmentService";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";
import Button from "../components/Button";

function ShipmentPage() {
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [orderNumber, setOrderNumber] = useState("ORD-DEMO-001");
  const [destinationAddress, setDestinationAddress] = useState("Av. Principal 123");
  const [totalUnits, setTotalUnits] = useState(1);

  async function loadShipments() {
    try {
      setLoading(true);
      const data = await loadShipmentService();
      setShipments(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los envíos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShipments();
  }, []);

  async function handleCreateShipment(event) {
    event.preventDefault();

    const shipmentData = {
      orderNumber,
      destinationAddress,
      totalUnits: Number(totalUnits),
    };

    try {
      await saveShipment(shipmentData);
      await loadShipments();
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el envío. Revisa JWT o servicios activos.");
    }
  }

  const handleDelete = async (trackingCode) => {
    try {
      await removeShipment(trackingCode);
      await loadShipments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-indigo-100 to-emerald-100">
          <PageContainer>
              <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-indigo-100 to-emerald-100 p-6">
                    <Navbar title="Envíos" showBack variant="service" />
                    <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8 mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">
                          Crear envío
                      </h2>

                      <form onSubmit={handleCreateShipment} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          placeholder="Número de pedido"
                        />

                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                          value={destinationAddress}
                          onChange={(e) => setDestinationAddress(e.target.value)}
                          placeholder="Dirección destino"
                        />

                        <input className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                          type="number"
                          value={totalUnits}
                          onChange={(e) => setTotalUnits(e.target.value)}
                          placeholder="Total unidades"
                        />

                        <div className="mt-2">
                            <Button type="submit" variant="primary" size="md">
                                Crear pedido
                            </Button>
                        </div>
                      </form>
                    </div>

                    {loading && <p>Cargando envíos...</p>}
                    {error && <p className="text-red-600 font-semibold">{error}</p>}

                    {!loading && (
                      <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Listado de envíos
                        </h2>

                        <table className="w-full border-collapse overflow-hidden rounded-2xl">
                          <thead>
                            <tr>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Tracking</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Pedido</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Transportista</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Ruta</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Entrega estimada</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Estado</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shipments.map((shipment) => (
                              <tr key={shipment.trackingCode} className="hover:bg-slate-50 transition">
                                <td className="p-4 border-b border-slate-200 text-slate-700 font-bold">{shipment.trackingCode}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{shipment.orderNumber}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{shipment.carrier}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{shipment.routeCode}</td>
                                <td className="p-4 border-b border-slate-200 text-slate-700">{shipment.estimatedDeliveryDate}</td>
                                <td><span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                                      {shipment.status}</span>
                                </td>
                                <td>
                                  <Button variant="danger" size="del"
                                     onClick={() => handleDelete(shipment.trackingCode)}>
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

export default ShipmentPage;