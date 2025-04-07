import { Routes, Route } from "react-router-dom"
import Login from "./auth/Login"
import Dashboard from "./components/Dashboard"
import ResidentDashboard from "./components/ResidentDashboard"
import GuardDashboard from "./components/GuardDashboard"
import ResidentHome from "./components/resident/ResidentHome"
import RegisterVisit from "./components/public/RegisterVisit"

import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />

      <Route path="/dashboard" element={<Dashboard />} /> {/* Mantener para compatibilidad */}
      <Route path="/residents" element={<ResidentDashboard />} />
      
      <Route path="/guards" element={<GuardDashboard />} />
      <Route path="/resident/dashboard" element={<ResidentHome />} />

      <Route path="/register-visit/:residentId" element={<RegisterVisit />} />

      </Routes>

      
  )
}

export default App

