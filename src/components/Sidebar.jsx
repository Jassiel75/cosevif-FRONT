"use client"

// Importar el logo al inicio del archivo
import { useState } from "react"
import { ChevronLeft, ChevronRight, Home, Settings, Users, Shield, LogOut, Building } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import "../styles/Sidebar.css"
import logo from "../assets/logos/LogoCosevif-removed.png"

function Sidebar() {
  // Initialize sidebar as collapsed (closed)
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Toggle sidebar only when the toggle button is clicked
  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  // Verify if a route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      {/* Header with logo */}
      <div className="sidebar-header">
        <div className="logo-container">
          {/* Reemplazar el icono con la imagen del logo */}
          <img src={logo || "/placeholder.svg"} alt="Logo Cosevif" className="sidebar-logo" />
          <span className={`logo-text ${expanded ? "visible" : "hidden"}`}>COSEVIF</span>
        </div>
        <button onClick={toggleSidebar} className="toggle-button">
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        

        <div
          onClick={() => handleNavigation("/dashboard")}
          className={`nav-item ${isActive("/houses") || location.pathname === "/dashboard" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Building size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Casas</span>
        </div>

        <div
          onClick={() => handleNavigation("/residents")}
          className={`nav-item ${isActive("/residents") ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Users size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Residentes</span>
        </div>

        <div
          onClick={() => handleNavigation("/guards")}
          className={`nav-item ${isActive("/guards") ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Shield size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Guardias</span>
        </div>

        
      </nav>

      {/* Logout at bottom */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="nav-icon">
            <LogOut size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

