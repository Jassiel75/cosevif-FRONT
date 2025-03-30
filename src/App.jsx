import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard";
import ResidentDashboard from "./components/ResidentDashboard";
import GuardsDashboard from "./components/GuardDashboard";  // Importa el componente de los guardias

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/residents" element={<ResidentDashboard />} />
      <Route path="/guards" element={<GuardsDashboard />} />  {/* Añadir esta línea para los guardias */}

    </Routes>
  );
}

export default App;
