"use client"

// Importar el logo al inicio del archivo
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Users, Shield, LogOut, Building, Menu, X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import "../styles/Sidebar.css"
import logo from "../assets/logos/LogoCosevif-removed.png"

function Sidebar() {
  // Initialize sidebar as collapsed (closed)
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Toggle sidebar only when the toggle button is clicked
  const toggleSidebar = () => {
    if (!isMobile) {
      setExpanded(!expanded)
    }
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
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
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  // Determine sidebar classes based on state
  const sidebarClasses = `sidebar ${expanded ? "expanded" : "collapsed"}`

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className={sidebarClasses}>
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
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button className="mobile-menu-button" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobile && (
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <img src={logo || "/placeholder.svg"} alt="Logo Cosevif" className="mobile-logo" />
            <span className="mobile-logo-text">COSEVIF</span>
          </div>

          <nav className="mobile-nav">
            <div
              onClick={() => handleNavigation("/dashboard")}
              className={`mobile-nav-item ${isActive("/houses") || location.pathname === "/dashboard" ? "active" : ""}`}
            >
              <Building size={20} />
              <span>Casas</span>
            </div>

            <div
              onClick={() => handleNavigation("/residents")}
              className={`mobile-nav-item ${isActive("/residents") ? "active" : ""}`}
            >
              <Users size={20} />
              <span>Residentes</span>
            </div>

            <div
              onClick={() => handleNavigation("/guards")}
              className={`mobile-nav-item ${isActive("/guards") ? "active" : ""}`}
            >
              <Shield size={20} />
              <span>Guardias</span>
            </div>

            <div onClick={handleLogout} className="mobile-nav-item logout">
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </div>
          </nav>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && mobileMenuOpen && <div className="mobile-overlay" onClick={toggleMobileMenu}></div>}
    </>
  )
}

export default Sidebar
