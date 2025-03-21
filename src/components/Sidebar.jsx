import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUsers, FaShieldAlt, FaUserCircle } from 'react-icons/fa';  // Iconos para navegación

function Sidebar() {
  const [open, setOpen] = useState(false);  // Controlar si el sidebar está abierto o cerrado

  return (
    <div>
      {/* Botón de hamburguesa para abrir el sidebar en móvil */}
      <button
        onClick={() => setOpen(!open)}
        className={`sidebar-toggle-btn ${open ? 'sidebar-open' : ''}`}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${open ? 'sidebar-open' : 'sidebar-close'}`}>
        <div className="logo-container">
          <img src="path_to_logo" alt="Logo" className="logo-img" />
        </div>

        {/* Lista de navegación */}
        <Nav className="flex-column">
          <Nav.Item>
            <Link to="/dashboard" className="nav-link">
              <FaHome className="sidebar-icon" />
              {open && <span>Dashboard</span>}
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/residents" className="nav-link">
              <FaUsers className="sidebar-icon" />
              {open && <span>Residentes</span>}
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/houses" className="nav-link">
              <FaHome className="sidebar-icon" />
              {open && <span>Casas</span>}
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/guards" className="nav-link">
              <FaShieldAlt className="sidebar-icon" />
              {open && <span>Guardias</span>}
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/account" className="nav-link">
              <FaUserCircle className="sidebar-icon" />
              {open && <span>Cuenta</span>}
            </Link>
          </Nav.Item>
        </Nav>

        {/* Botón de Cerrar sesión */}
        <div className="logout">
          <button className="btn btn-outline-danger w-100">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
