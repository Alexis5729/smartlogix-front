import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInventoryItemsWithAvailable } from "../services/inventoryService";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await getInventoryItemsWithAvailable();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el inventario.");
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-pink-100">
          <PageContainer>
              <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-pink-100 p-6">
                      <Navbar title="Inventario" showBack variant="service" />

                    {loading && (
                      <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8">
                          <p className="text-slate-500 font-medium animate-pulse">
                              Cargando inventario...
                          </p>
                      </div>
                    )}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                          <p className="text-red-600 font-semibold">
                              {error}
                          </p>
                      </div>
                    )}

                    {!loading && !error && (
                      <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8">
                        <table className="w-full border-collapse mt-6 overflow-hidden rounded-2xl">
                          <thead>
                            <tr>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">SKU</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Nombre</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Stock</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Reservado</th>
                              <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">Disponible</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => (
                              <tr key={item.sku}>
                                <td className="p-4 border-b border-slate-200">{item.sku}</td>
                                <td className="p-4 border-b border-slate-200">{item.productName}</td>
                                <td className="p-4 border-b border-slate-200">{item.availableQuantity}</td>
                                <td className="p-4 border-b border-slate-200">{item.reservedQuantity}</td>
                                <td className="p-4 border-b border-slate-200">{item.availableQuantity - item.reservedQuantity}</td>
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

export default InventoryPage;