"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Home, Settings, Users, Shield, LogOut, Building } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import "../styles/Sidebar.css"

function Sidebar() {
  // Initialize sidebar as collapsed (closed)
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()

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

  return (
    <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      {/* Header with logo */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Building size={16} />
          </div>
          <span className={`logo-text ${expanded ? "visible" : "hidden"}`}>COSEVIF</span>
        </div>
        <button onClick={toggleSidebar} className="toggle-button">
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
          <span className="nav-icon">
            <Home size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Dashboard</span>
        </Link>

        <Link to="/dashboard" className={`nav-item ${isActive("/houses") || isActive("/dashboard") ? "active" : ""}`}>
          <span className="nav-icon">
            <Building size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Casas</span>
        </Link>

        <Link to="/residents" className={`nav-item ${isActive("/residents") ? "active" : ""}`}>
          <span className="nav-icon">
            <Users size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Residentes</span>
        </Link>

        <Link to="/guards" className={`nav-item ${isActive("/guards") ? "active" : ""}`}>
          <span className="nav-icon">
            <Shield size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Guardias</span>
        </Link>

        <Link to="/settings" className={`nav-item ${isActive("/settings") ? "active" : ""}`}>
          <span className="nav-icon">
            <Settings size={20} />
          </span>
          <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>Configuración</span>
        </Link>
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

