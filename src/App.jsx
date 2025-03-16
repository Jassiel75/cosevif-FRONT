import { Routes, Route } from "react-router-dom"; // ✅ NO IMPORTAMOS OTRA VEZ BrowserRouter
import Login from "./components/Login";
import Dashboard from "./components/dashboardAdmin/Dashboard";

function App() {
  return (
    <Routes> {/* ✅ Solo usamos <Routes> */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
