import { useEffect, useState } from "react";
import {
  getInventoryItemsWithAvailable,
  saveInventoryItem,
} from "../services/inventoryService";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";
import Button from "../components/Button";

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    sku: "",
    productName: "",
    warehouseCode: "",
    initialQuantity: "",
    reorderLevel: "",
  });

  async function loadInventory() {
    try {
      setLoading(true);
      const data = await getInventoryItemsWithAvailable();
      setItems(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleCreateInventory(event) {
    event.preventDefault();

    const newItem = {
      sku: formData.sku,
      productName: formData.productName,
      warehouseCode: formData.warehouseCode,
      initialQuantity: Number(formData.initialQuantity),
      reorderLevel: Number(formData.reorderLevel),
    };

    try {
      setSaving(true);
      setError("");

      await saveInventoryItem(newItem);
      await loadInventory();

      setFormData({
        sku: "",
        productName: "",
        warehouseCode: "",
        initialQuantity: "",
        reorderLevel: "",
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo agregar el producto al inventario.");
    } finally {
      setSaving(false);
    }
  }

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
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm mb-6">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Agregar inventario
                </h2>

                <form
                  onSubmit={handleCreateInventory}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="SKU"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  />

                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Nombre del producto"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  />

                  <input
                    type="text"
                    name="warehouseCode"
                    value={formData.warehouseCode}
                    onChange={handleChange}
                    placeholder="Código de bodega"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  />

                  <input
                    type="number"
                    name="initialQuantity"
                    value={formData.initialQuantity}
                    onChange={handleChange}
                    placeholder="Cantidad inicial"
                    min="0"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  />

                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    placeholder="Nivel de reposición"
                    min="0"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  />

                  <div className="flex items-center">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Agregando..." : "Agregar inventario"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-white/80 border border-slate-200 rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Listado de inventario
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mt-6 overflow-hidden rounded-2xl">
                    <thead>
                      <tr>
                        <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">
                          SKU
                        </th>
                        <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">
                          Nombre
                        </th>
                        <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">
                          Stock
                        </th>
                        <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">
                          Reservado
                        </th>
                        <th className="p-4 bg-slate-100 text-slate-700 uppercase text-sm tracking-wide text-left border-b border-slate-200">
                          Disponible
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="p-4 text-center text-slate-500"
                          >
                            No hay productos registrados.
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.sku}>
                            <td className="p-4 border-b border-slate-200">
                              {item.sku}
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {item.productName}
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {item.availableQuantity}
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {item.reservedQuantity}
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              {item.availableQuantity - item.reservedQuantity}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

export default InventoryPage;