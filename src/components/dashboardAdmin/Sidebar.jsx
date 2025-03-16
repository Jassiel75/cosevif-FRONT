import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";
import logo from "../../images/logos_Cosevif/LogoCosevif-removed.png"; // ✅ Importamos el logo correctamente

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo agregado aquí */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Cosevif" className="sidebar-img" /> 
        <h2>COSEVIF</h2>
      </div>

      <ul>
        <li className="active">
          <span>🏠</span> <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <span>👥</span> <Link to="/residentes">Residentes</Link>
        </li>
        <li>
          <span>🏡</span> <Link to="/casas">Casas</Link>
        </li>
        <li>
          <span>🛡️</span> <Link to="/guardias">Guardias</Link>
        </li>
        <li className="logout">
          <span>🚪</span> <Link to="/">Cerrar Sesión</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
