import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUsers, FaShieldAlt, FaUserCircle } from 'react-icons/fa';  // Iconos para navegación
import logo from "../assets/logos/LogoCosevif-removed.png"; // Asegúrate de que la ruta sea correcta

function Sidebar() {
  const [open, setOpen] = useState(false);  // Controlar si el sidebar está abierto o cerrado

  const handleLogout = () => {
    // Aquí puedes borrar cualquier dato de sesión si es necesario
    localStorage.removeItem('token'); // Esto eliminaría el token si estás usando localStorage
  }

  return (
    <div className={`d-flex flex-column bg-sidebar ${open ? 'sidebar-open' : 'sidebar-close'}`}>
      {/* Botón de hamburguesa para abrir el sidebar en móvil */}
      <button
        onClick={() => setOpen(!open)}
        className="sidebar-toggle-btn"
      >
        {open ? <FaTimes className="text-white" /> : <FaBars className="text-white" />}
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
