import { Link } from "react-router-dom";
import { FaBoxes, FaClipboardList, FaTruck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import PageContainer from "../layout/PageContainer";

function DashboardPage() {

    const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-blue-100 to-cyan-100 p-6">
        <PageContainer>
           <Navbar />
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                   {role !== "ROLE_USER" && (
                   <Link to="/inventory" className="group relative overflow-hidden rounded-3xl bg-white/80 border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                     <div className=" absolute -top-10 -right-10 w-30 h-30 bg-cyan-300 rounded-full opacity-15 group-hover:scale-130 transition duration-700"></div>
                     <FaBoxes size={40}/>
                     <h2 className="text-3xl font-bold text-slate-900 mb-3">
                       Inventario
                     </h2>
                     <p className="text-slate-500 text-lg">
                         Consultar productos, stock y disponibilidad
                     </p>
                   </Link>
                   )}

                   {role !== "ROLE_WAREHOUSE_MANAGER" && (
                   <Link to="/orders" className="group relative overflow-hidden rounded-3xl bg-white/80 border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                     <div className=" absolute -top-10 -right-10 w-30 h-30 bg-cyan-300 rounded-full opacity-15 group-hover:scale-130 transition duration-700"></div>
                     <FaClipboardList size={40} />
                     <h2 className="text-3xl font-bold text-slate-900 mb-3">
                         Pedidos
                     </h2>
                     <p className="text-slate-500 text-lg">
                         Gestionar pedidos y solicitudes de envío.
                     </p>
                   </Link>
                   )}

                   {role !== "ROLE_USER" && (
                   <Link to="/shipments" className="group relative overflow-hidden rounded-3xl bg-white/80 border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                     <div className=" absolute -top-10 -right-10 w-30 h-30 bg-cyan-300 rounded-full opacity-15 group-hover:scale-130 transition duration-700"></div>
                     <FaTruck size={40} />
                     <h2 className="text-3xl font-bold text-slate-900 mb-3">
                         Envíos
                     </h2>
                     <p className="text-slate-500 text-lg">
                         Consultar y registrar envíos asociados a pedidos.
                     </p>
                   </Link>
                   )}
                 </div>
        </PageContainer>
    </div>
  );
}

export default DashboardPage;