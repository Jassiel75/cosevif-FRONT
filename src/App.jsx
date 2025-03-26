import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard";
import ResidentDashboard from "./components/ResidentDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/residents" element={<ResidentDashboard />} />
    </Routes>
  );
}

export default App;
