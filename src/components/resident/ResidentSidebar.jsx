"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Home, Users, Briefcase, LogOut, Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../../styles/Sidebar.css"
import logo from "../../assets/logos/LogoCosevif-removed.png"

function ResidentSidebar({ onViewChange, activeView }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  // Toggle sidebar only when the toggle button is clicked
  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    window.location.href = "/"
  }

  return (
    <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      {/* Header with logo */}
      <div className="sidebar-header">
        <div className="logo-container">
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
          onClick={() => navigate("/resident/dashboard")}
          className={`nav-item active`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Home size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Inicio</span>
        </div>

        <div
          onClick={() => onViewChange("visits")}
          className={`nav-item ${activeView === "visits" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Users size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Visitas</span>
        </div>

        <div
          onClick={() => onViewChange("workers")}
          className={`nav-item ${activeView === "workers" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-icon">
            <Briefcase size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Trabajadores</span>
        </div>

        <div className={`nav-item`} style={{ cursor: "pointer" }}>
          <span className="nav-icon">
            <Bell size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Notificaciones</span>
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

export default ResidentSidebar

