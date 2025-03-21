import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
