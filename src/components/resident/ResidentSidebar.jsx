import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, User, Calendar, LogOut, Briefcase, Menu, X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import "../../styles/Sidebar.css"
import logo from "../../assets/logos/LogoCosevif-removed.png"

function ResidentSidebar({ onViewChange, activeView, userData }) {
  // Initialize sidebar states
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setExpanded(false) // Start collapsed on all devices
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

    // Close mobile menu after navigation
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
              onClick={() => handleNavigation("visits")}
              className={`mobile-nav-item ${isActive("visits") ? "active" : ""}`}
            >
              <Calendar size={20} />
              <span>Mis Visitas</span>
            </div>

            <div
              onClick={() => handleNavigation("workers")}
              className={`mobile-nav-item ${isActive("workers") ? "active" : ""}`}
            >
              <Briefcase size={20} />
              <span>Mis Trabajadores</span>
            </div>

            <div
              onClick={() => handleNavigation("profile")}
              className={`mobile-nav-item ${isActive("profile") ? "active" : ""}`}
            >
              <User size={20} />
              <span>Mi Perfil</span>
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

export default ResidentSidebar
