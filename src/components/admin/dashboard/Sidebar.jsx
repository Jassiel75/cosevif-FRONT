import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/admin/Sidebar.css"; 
import logo from "../../../assets/logos/LogoCosevif-removed.png";
import { FaHome, FaUsers, FaShieldAlt, FaChartBar } from 'react-icons/fa'; // Importar los íconos de react-icons

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-link"><FaChartBar /> Dashboard</Link>
        <Link to="/residents" className="nav-link"><FaUsers /> Residentes</Link>
        <Link to="/houses" className="nav-link active"><FaHome /> Casas</Link>
        <Link to="/guards" className="nav-link"><FaShieldAlt /> Guardias</Link>
      </nav>
      <button className="logout-btn">Cerrar Sesión</button>
    </div>
  );
};

export default Sidebar;
