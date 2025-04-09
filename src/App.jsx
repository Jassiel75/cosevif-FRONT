import { Routes, Route } from "react-router-dom"
import Login from "./auth/Login"
import Dashboard from "./components/Dashboard"
import ResidentDashboard from "./components/ResidentDashboard"
import GuardDashboard from "./components/GuardDashboard"
import ResidentHome from "./components/resident/ResidentHome"
import RegisterVisit from "./components/public/RegisterVisit"
import ResidentProfile from "./components/resident/ResidentProfile"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import UnauthorizedAccess from "./components/auth/UnauthorizedAccess"

import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register-visit/:residentId" element={<RegisterVisit />} />
      <Route path="/unauthorized" element={<UnauthorizedAccess />} />

      {/* Rutas de administrador */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residents"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guards"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <GuardDashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas de residente */}
      <Route
        path="/resident/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RESIDENT"]}>
            <ResidentHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/profile"
        element={
          <ProtectedRoute allowedRoles={["RESIDENT"]}>
            <ResidentProfile />
          </ProtectedRoute>
        }
      />

      {/* Ruta de fallback para cualquier otra ruta no definida */}
      <Route path="*" element={<UnauthorizedAccess message="Página no encontrada" />} />
    </Routes>
  )
}

export default App
