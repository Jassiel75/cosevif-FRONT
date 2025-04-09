"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, User, Calendar, LogOut, Briefcase } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import "../../styles/Sidebar.css"
import logo from "../../assets/logos/LogoCosevif-removed.png"

function ResidentSidebar({ onViewChange, activeView, userData }) {
  // Initialize sidebar as collapsed (closed)
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Toggle sidebar only when the toggle button is clicked
  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  // Verify if a route is active
  const isActive = (view) => {
    if (view === activeView) return true
    if (view === "profile" && location.pathname === "/resident/profile") return true
    return false
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("name")
    localStorage.removeItem("surnames")
    localStorage.removeItem("email")
    localStorage.removeItem("phone")
    localStorage.removeItem("address")
    localStorage.removeItem("birthDate")
    localStorage.removeItem("age")
    localStorage.removeItem("role")
    localStorage.removeItem("houseId")
    localStorage.removeItem("houseNumber")
    localStorage.removeItem("street")
    window.location.href = "/"
  }

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    if (path === "profile") {
      navigate("/resident/profile")
    } else {
      onViewChange(path)
    }
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
          onClick={() => handleNavigation("visits")}
          className={`nav-item ${isActive("visits") ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Calendar size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Mis Visitas</span>
        </div>

        <div
          onClick={() => handleNavigation("workers")}
          className={`nav-item ${isActive("workers") ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Briefcase size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Mis Trabajadores</span>
        </div>

        <div
          onClick={() => handleNavigation("profile")}
          className={`nav-item ${isActive("profile") ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <User size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Mi Perfil</span>
        </div>
      </nav>

      {/* User info section if expanded */}
      {expanded && userData && (
        <div className="sidebar-user-info">
          <div className="user-info-container">
            <div className="user-avatar">{userData.name ? userData.name.charAt(0).toUpperCase() : "U"}</div>
            <div className="user-details">
              <span className="user-name">{userData.name || "Usuario"}</span>
              {userData.house && <span className="user-house">Casa #{userData.house.houseNumber}</span>}
            </div>
          </div>
        </div>
      )}

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

export default ResidentSidebar
