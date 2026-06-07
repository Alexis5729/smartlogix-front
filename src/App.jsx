import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrderPage";
import ShipmentPage from "./pages/ShipmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }/>
        <Route path="/inventory"
          element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"]}>
                <InventoryPage />
              </ProtectedRoute>
          }/>
        <Route path="/orders"
          element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
                <OrdersPage />
              </ProtectedRoute>
          } />
        <Route path="/shipments"
          element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"]}>
                <ShipmentPage />
              </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;