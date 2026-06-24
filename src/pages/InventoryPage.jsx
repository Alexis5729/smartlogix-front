import { useEffect, useState } from "react";
import { getInventoryItemsWithAvailable, saveInventoryItem, editInventoryItem, removeInventoryItem } from "../services/inventoryService";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  const [formData, setFormData] = useState({
    sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
    productName: "Auriculares Hyperx",
    warehouseCode: "BOD-001",
    initialQuantity: "25",
    reorderLevel: "5",
  });

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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleCreateInventory(event) {
    event.preventDefault();

    const cleanSku = formData.sku.trim();
    const cleanProductName = formData.productName.trim();
    const cleanWarehouseCode = formData.warehouseCode.trim();
    const parsedQuantity = Number(formData.initialQuantity);
    const parsedReorderLevel = Number(formData.reorderLevel);

    if (!cleanSku) {
      setError("Ingresa un SKU válido.");
      return;
    }

    if (!cleanProductName) {
      setError("Ingresa el nombre del producto.");
      return;
    }

    if (!cleanWarehouseCode) {
      setError("Ingresa el código de bodega.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      setError("La cantidad no puede ser negativa.");
      return;
    }

    if (!Number.isInteger(parsedQuantity)) {
      setError("La cantidad debe ser un número entero.");
      return;
    }

    if (!Number.isFinite(parsedReorderLevel) || parsedReorderLevel < 0) {
      setError("El nivel de reposición no puede ser negativo.");
      return;
    }

    if (!Number.isInteger(parsedReorderLevel)) {
      setError("El nivel de reposición debe ser un número entero.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingSku) {
        const currentItem = items.find((item) => item.sku === editingSku);
        const reservedQuantity = Number(currentItem?.reservedQuantity || 0);

        if (parsedQuantity < reservedQuantity) {
          setError(
            `No puedes dejar el stock en ${parsedQuantity}, porque ya existen ${reservedQuantity} unidades reservadas.`
          );
          return;
        }

        await editInventoryItem(editingSku, {
          productName: cleanProductName,
          warehouseCode: cleanWarehouseCode,
          availableQuantity: parsedQuantity,
          reservedQuantity,
          reorderLevel: parsedReorderLevel,
        });
      } else {
        await saveInventoryItem({
          sku: cleanSku,
          productName: cleanProductName,
          warehouseCode: cleanWarehouseCode,
          initialQuantity: parsedQuantity,
          reorderLevel: parsedReorderLevel,
        });
      }

      const data = await getInventoryItemsWithAvailable();
      setItems(data);

      setEditingSku(null);

      setFormData({
        sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
        productName: "Auriculares Hyperx",
        warehouseCode: "BOD-001",
        initialQuantity: "25",
        reorderLevel: "5",
      });
    } catch (err) {
      console.error(err);
      setError(
        editingSku
          ? "No se pudo actualizar el producto."
          : "No se pudo agregar el producto al inventario."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setEditingSku(item.sku);

    setFormData({
      sku: item.sku,
      productName: item.productName,
      warehouseCode: item.warehouseCode,
      initialQuantity: String(item.availableQuantity),
      reorderLevel: String(item.reorderLevel),
    });
  }

  async function handleDelete(sku) {
    if (!window.confirm(`¿Eliminar producto ${sku}?`)) return;

    try {
      await removeInventoryItem(sku);

      const data = await getInventoryItemsWithAvailable();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto.");
    }
  }

    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
          <PageContainer>
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Navbar />

              <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8">

            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-black mb-2">Inventario</h1>
                <p className="text-slate-300">Gestión de productos, stock disponible y reposición.</p>
              </div>
            </div>

            {loading && (
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 mb-6">
                <p className="text-slate-300 animate-pulse">Cargando inventario...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-5 mb-6">
                <p className="text-red-200 font-semibold">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6 mb-8">
                  <h2 className="text-2xl font-black mb-2">Agregar inventario</h2>
                  <p className="text-slate-400 mb-6">Registra nuevos productos o actualiza existencias.</p>

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
                      disabled={Boolean(editingSku)}
                      className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />

                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="Nombre del producto"
                      required
                      className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <input
                      type="text"
                      name="warehouseCode"
                      value={formData.warehouseCode}
                      onChange={handleChange}
                      placeholder="Código de bodega"
                      required
                      className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <input
                      type="number"
                      name="initialQuantity"
                      value={formData.initialQuantity}
                      onChange={handleChange}
                      placeholder="Cantidad inicial"
                      min="0"
                      required
                      className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleChange}
                      placeholder="Nivel de reposición"
                      min="0"
                      required
                      className="bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-bold shadow-lg hover:bg-indigo-500 transition disabled:opacity-60"
                    >
                      {saving
                        ? editingSku
                          ? "Actualizando..."
                          : "Agregando..."
                        : editingSku
                          ? "Actualizar inventario"
                          : "Agregar inventario"}
                    </button>
                  </form>
                </div>

                <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6">
                  <h2 className="text-2xl font-black mb-6">Listado de inventario</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900/80 text-slate-300 uppercase text-sm">
                          <th className="p-4 text-left rounded-l-xl">SKU</th>
                          <th className="p-4 text-left">Nombre</th>
                          <th className="p-4 text-left">Stock</th>
                          <th className="p-4 text-left">Reservado</th>
                          <th className="p-4 text-left">Disponible</th>
                          <th className="p-4 text-left rounded-r-xl">Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {items.map((item) => (
                          <tr key={item.sku} className="border-b border-white/10 hover:bg-white/5 transition">
                            <td className="p-4 font-bold">{item.sku}</td>
                            <td className="p-4">{item.productName}</td>
                            <td className="p-4">{item.availableQuantity}</td>
                            <td className="p-4">{item.reservedQuantity}</td>
                            <td className="p-4">
                              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 font-bold">
                                {item.availableQuantity - item.reservedQuantity}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="rounded-xl bg-amber-500 px-4 py-2 text-white font-bold hover:bg-amber-400 transition"
                                >
                                  Editar
                                </button>

                                <button
                                  onClick={() => handleDelete(item.sku)}
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
              </>
            )}
          </section>
          </div>
        </PageContainer>
      </div>
    );
}

export default InventoryPage;