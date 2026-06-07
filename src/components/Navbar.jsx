import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleLabel } from "../utils/roleUtils";
import logo from "../assets/logo-smartlogix.png";
import Button from "../components/Button";

function Navbar({
    title = "SmartLogix",
    subtitle = "Inteligencia • Logística • Eficiencia",
    showBack = false,
    backTo = "/dashboard",
    variant = "dashboard",
}) {
    const { role, username } = useAuth();
    const roleLabel = getRoleLabel(role);
    const navigate = useNavigate();

    function logout() {
        localStorage.clear();
        navigate("/");
    }

    const isService = variant === "service";

    return (
        <header
            className={`flex justify-between items-center bg-white/80 shadow-lg ${
                isService
                    ? "mb-6 px-5 py-3 rounded-2xl"
                    : "mb-8 px-6 py-3 rounded-3xl"
            }`}>

            <div className="flex items-center gap-6">
                    <img
                        src={logo}
                        alt="SmartLogix"
                        className={isService
                            ? "w-20 h-20 object-contain"
                            : "w-30 h-30 object-contain"}/>


                <div className="flex flex-col gap-1">
                    {showBack && (
                        <Link to={backTo}
                            className="text-blue-600 font-semibold hover:text-blue-800 transition text-sm">
                            ← Volver al Dashboard
                        </Link>
                    )}

                    <h1
                        className={`font-black text-slate-900 ${
                            isService ? "text-2xl" : "text-3xl"
                        }`}>
                        {title}
                    </h1>

                    {!isService && (
                        <>
                            <p className="text-slate-500">
                                {subtitle}
                            </p>

                            <p className="text-slate-400 text-sm">
                                Bienvenido, {username}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div
                    className={`bg-blue-50 rounded-full font-semibold text-blue-600 shadow-sm ${
                        isService ? "px-4 py-2" : "px-5 py-3"
                    }`}>
                    <span>{roleLabel}</span>
                </div>

                <Button variant="danger" size={isService ? "sm" : "pill"} onClick={logout}>
                    Cerrar sesión
                </Button>
            </div>
        </header>
    );
}

export default Navbar;