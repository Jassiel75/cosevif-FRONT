import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDoubleArrow } from "react-icons/md"; // Importa el nuevo ícono de flecha doble
<MdOutlineDoubleArrow style={{ color: '#yourColor' }} />

import { FaHome, FaUsers, FaShieldAlt, FaUserCircle } from 'react-icons/fa'; // Otros iconos
import logo from "../assets/logos/LogoCosevif-removed.png"; // Asegúrate de que la ruta sea correcta

function Sidebar() {
  const [open, setOpen] = useState(false);  // Controlar si el sidebar está abierto o cerrado

  const handleLogout = () => {
    localStorage.removeItem('token'); // Esto eliminaría el token si estás usando localStorage
  };

  return (
    <div className={`d-flex flex-column bg-sidebar ${open ? 'sidebar-open' : 'sidebar-close'}`}>
      {/* Botón de la flecha para abrir y cerrar el sidebar */}
      <button
  onClick={() => setOpen(!open)}
  className={`sidebar-toggle-btn ${open ? 'open' : 'closed'}`}
>
  <MdOutlineDoubleArrow style={{ color: '#9b2d20' }} />
</button>

      {/* Logo */}
      <div className="logo-container text-center">

        <img src={logo} alt="Logo" className="logo-img" />

      </div>

      {/* Lista de navegación */}
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">
            <FaHome className="sidebar-icon" />
            {open && <span className="text-white">Dashboard</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/residents" className="nav-link">
            <FaUsers className="sidebar-icon" />
            {open && <span className="text-white">Residentes</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/houses" className="nav-link">
            <FaHome className="sidebar-icon" />
            {open && <span className="text-white">Casas</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/guards" className="nav-link">
            <FaShieldAlt className="sidebar-icon" />
            {open && <span className="text-white">Guardias</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/account" className="nav-link">
            <FaUserCircle className="sidebar-icon" />
            {open && <span className="text-white">Cuenta</span>}
          </Link>
        </li>
      </ul>

      {/* Cerrar sesión */}
      <div className="logout">
        <Link to="/" onClick={handleLogout} className="nav-link">
          <FaUserCircle className="sidebar-icon" />
          {open && <span className="text-white">Cerrar sesión</span>}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
