import { useEffect, useState } from "react";
import { loadShipmentService, saveShipment, editShipment, removeShipment } from "../services/shipmentService";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";

function ShipmentPage() {
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [orderNumber, setOrderNumber] = useState("ORD-DEMO-001");
  const [destinationAddress, setDestinationAddress] = useState("Av. Principal 123");
  const [totalUnits, setTotalUnits] = useState(1);
  const [editingTrackingCode, setEditingTrackingCode] = useState(null);

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
      if (editingTrackingCode) {
        await editShipment(editingTrackingCode, shipmentData);
      } else {
        await saveShipment(shipmentData);
      }
      await loadShipments();
      setEditingTrackingCode(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el envío. Revisa JWT o servicios activos.");
    }
  }

  function handleEdit(shipment) {
    setEditingTrackingCode(shipment.trackingCode);
    setOrderNumber(shipment.orderNumber);
    setDestinationAddress(shipment.destinationAddress || "Av. Principal 123");
    setTotalUnits(shipment.totalUnits || 1);
  }

  const handleDelete = async (trackingCode) => {
    if (!window.confirm(`¿Eliminar envío ${trackingCode}?`)) return;

    try {
      await removeShipment(trackingCode);
      await loadShipments();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el envío.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
        <PageContainer>
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Navbar />

            <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8">

          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">
              Envíos
            </h1>

            <p className="text-slate-300">
              Gestión logística, seguimiento y trazabilidad de despachos.
            </p>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-5 mb-6">
              <p className="text-red-200 font-semibold">
                {error}
              </p>
            </div>
          )}

          <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-black mb-2">
              {editingTrackingCode ? "Actualizar envío" : "Crear envío"}
            </h2>

            <p className="text-slate-400 mb-6">
              Registra despachos y administra el seguimiento de entregas.
            </p>

            <form
              onSubmit={handleCreateShipment}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >

              <input
                className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Número de pedido"
              />

              <input
                className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="Dirección destino"
              />

              <input
                className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                type="number"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                placeholder="Total unidades"
              />

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-bold shadow-lg hover:bg-indigo-500 transition"
              >
                {editingTrackingCode ? "Actualizar envío" : "Crear envío"}
              </button>

            </form>
          </div>

          {loading && (
            <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5">
              <p className="text-slate-300 animate-pulse">
                Cargando envíos...
              </p>
            </div>
          )}

          {!loading && (
            <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6">

              <h2 className="text-2xl font-black mb-6">
                Listado de envíos
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  <thead>
                    <tr className="bg-slate-900/80 text-slate-300 uppercase text-sm">
                      <th className="p-4 text-left rounded-l-xl">Tracking</th>
                      <th className="p-4 text-left">Pedido</th>
                      <th className="p-4 text-left">Transportista</th>
                      <th className="p-4 text-left">Dirección</th>
                      <th className="p-4 text-left">Entrega estimada</th>
                      <th className="p-4 text-left">Estado</th>
                      <th className="p-4 text-left rounded-r-xl">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {shipments.map((shipment) => (
                      <tr
                        key={shipment.trackingCode}
                        className="border-b border-white/10 hover:bg-white/5 transition"
                      >

                        <td className="p-4 font-bold">
                          {shipment.trackingCode}
                        </td>

                        <td className="p-4">
                          {shipment.orderNumber}
                        </td>

                        <td className="p-4">
                          {shipment.carrier}
                        </td>

                        <td className="p-4">
                          {shipment.destinationAddress}
                        </td>

                        <td className="p-4">
                          {shipment.estimatedDeliveryDate}
                        </td>

                        <td className="p-4">
                          <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 font-bold">
                            {shipment.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">

                            <button
                              onClick={() => handleEdit(shipment)}
                              className="rounded-xl bg-amber-500 px-4 py-2 text-white font-bold hover:bg-amber-400 transition"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => handleDelete(shipment.trackingCode)}
                              className="rounded-xl bg-red-500 px-4 py-2 text-white font-bold hover:bg-red-400 transition"
                            >
                              Eliminar
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </section>
        </div>
      </PageContainer>
    </div>
  );
}

export default ShipmentPage;