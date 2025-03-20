import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import CasaCard from "../../admin/dashboard/CasaCard";
import RegistroCasaModal from "./RegistroCasaModal";
import "../../../styles/admin/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [casas, setCasas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCasas = async () => {
      try {
        console.log("Obteniendo casas...");
        const response = await axios.get("http://localhost:8080/admin/houses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Casas obtenidas:", response.data);
        setCasas(response.data);
      } catch (err) {
        console.error("Error obteniendo casas:", err);
        setError("No se pudieron cargar las casas.");
      }
    };

    fetchCasas();
  }, [navigate]);

  return (
    <div className="dashboard-container">
  <Sidebar />
  <div className="dashboard-content">
    <Header />
    <div className="dashboard-main">
      <h2>Todas las Casas</h2>
      <p className="subtitulo">Monitor Casas.</p>
      <button className="btn-add" onClick={() => setModalOpen(true)}>
        ➕ Agregar Casa
      </button>

      {error && <p className="error">{error}</p>}

      <div className="casa-list">
        {casas.length > 0 ? (
          casas.map((casa) => <CasaCard key={casa.id} data={casa} />)
        ) : (
          <p>No hay casas registradas.</p>
        )}
      </div>
    </div>
  </div>
  {modalOpen && <RegistroCasaModal onClose={() => setModalOpen(false)} />}
</div>
  );
};

export default Dashboard;
