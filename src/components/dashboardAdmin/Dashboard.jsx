import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CasaCard from "./CasaCard";
import RegistroCasaModal from "./RegistroCasaModal";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <div className="dashboard-main">
          <h2>Todas las Casas</h2>
          <button className="btn-add" onClick={() => setModalOpen(true)}>
            + Agregar Casa
          </button>
          <div className="casa-list">
            <CasaCard />
            <CasaCard />
            <CasaCard />
          </div>
        </div>
      </div>
      {modalOpen && <RegistroCasaModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
