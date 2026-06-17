import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";
import { loadUsersService, saveUser, editUser } from "../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    birthDate: "",
    password: "",
    role: "ROLE_USER",
    enabled: true,
  });

  async function loadUsers() {
    try {
      const data = await loadUsersService();
      setUsers(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      username: "",
      displayName: "",
      email: "",
      birthDate: "",
      password: "",
      role: "ROLE_USER",
      enabled: true,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const userData = {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        birthDate: formData.birthDate,
        password: formData.password,
        role: formData.role,
        enabled: formData.enabled,
      };

      if (editingId) {
        await editUser(editingId, userData);
      } else {
        await saveUser(userData);
      }

      await loadUsers();
      resetForm();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el usuario.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      birthDate: user.birthDate || "",
      password: "",
      role: user.role,
      enabled: user.enabled,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <PageContainer>
        <Navbar title="Usuarios" showBack variant="service" />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200 font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-black text-white mb-2">
              {editingId ? "Editar usuario" : "Crear usuario"}
            </h2>

            <p className="text-slate-300 mb-6">
              Gestiona accesos, roles y permisos de la plataforma.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Nombre visible"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white placeholder:text-slate-500"
              />

              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Usuario"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white placeholder:text-slate-500"
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white placeholder:text-slate-500"
              />

              <input
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white"
              />

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={editingId ? "Nueva contraseña opcional" : "Contraseña"}
                required={!editingId}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white placeholder:text-slate-500"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white"
              >
                <option value="ROLE_USER">Usuario / Pedidos</option>
                <option value="ROLE_WAREHOUSE_MANAGER">Bodeguero / Inventario y envíos</option>
                <option value="ROLE_ADMIN">Administrador</option>
              </select>

              <label className="flex items-center gap-3 text-slate-200">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                Usuario habilitado
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                    ? "Actualizar usuario"
                    : "Crear usuario"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-black text-white mb-6">
              Usuarios registrados
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm uppercase tracking-wide text-slate-400">
                    <th className="p-4 border-b border-white/10">Usuario</th>
                    <th className="p-4 border-b border-white/10">Correo</th>
                    <th className="p-4 border-b border-white/10">Rol</th>
                    <th className="p-4 border-b border-white/10">Estado</th>
                    <th className="p-4 border-b border-white/10">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="text-slate-200 hover:bg-white/5">
                      <td className="p-4 border-b border-white/10">
                        <strong className="text-white">
                          {user.displayName || user.username}
                        </strong>
                        <p className="text-slate-400">@{user.username}</p>
                      </td>

                      <td className="p-4 border-b border-white/10">
                        {user.email}
                      </td>

                      <td className="p-4 border-b border-white/10">
                        {user.role}
                      </td>

                      <td className="p-4 border-b border-white/10">
                        {user.enabled ? "Activo" : "Suspendido"}
                      </td>

                      <td className="p-4 border-b border-white/10">
                        <button
                          onClick={() => handleEdit(user)}
                          className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-white hover:bg-amber-400"
                        >
                          Editar permisos
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <p className="text-slate-400 mt-6">
                  No hay usuarios registrados.
                </p>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default UsersPage;