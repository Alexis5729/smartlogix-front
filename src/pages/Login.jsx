import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { login } from "../api/authApi";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await login({
        credential: username,
        password,
      });

      console.log("Respuesta login:", response);

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("username", response.username);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Credenciales inválidas");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white/80 border border-slate-200 rounded-3xl shadow-2xl p-10">

        <h1 className="text-3xl font-black text-slate-900 mb-2">
          SmartLogix
        </h1>

        <p className="text-slate-500 text-lg mb-8">
          Acceso a la plataforma logística
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Usuario o email
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"/>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition duration-300">
            Iniciar sesión
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;