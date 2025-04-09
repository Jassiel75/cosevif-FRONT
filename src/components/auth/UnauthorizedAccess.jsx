"use client"

import { useNavigate } from "react-router-dom"
import { FaExclamationTriangle, FaArrowLeft, FaSignOutAlt, FaHome } from "react-icons/fa"
import "../../styles/auth/UnauthorizedAccess.css"

function UnauthorizedAccess({ userRole, message }) {
  const navigate = useNavigate()
  // Si no se pasa userRole como prop, intentar obtenerlo del localStorage
  const role = userRole || localStorage.getItem("role")

  const handleGoBack = () => {
    navigate(-1) // Volver a la página anterior
  }

  const handleLogout = () => {
    // Limpiar localStorage
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

    // Redirigir al login
    navigate("/")
  }

  const getRoleName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrador"
      case "RESIDENT":
        return "Residente"
      case "GUARD":
        return "Guardia"
      default:
        return role || "Desconocido"
    }
  }

  const getRedirectPath = (role) => {
    switch (role) {
      case "ADMIN":
        return "/dashboard"
      case "RESIDENT":
        return "/resident/dashboard"
      case "GUARD":
        return "/guard/dashboard"
      default:
        return "/"
    }
  }

  const handleGoToAuthorizedArea = () => {
    navigate(getRedirectPath(role))
  }

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <FaExclamationTriangle />
        </div>
        <h1 className="unauthorized-title">Acceso No Autorizado</h1>
        <p className="unauthorized-message">
          {message || "Lo sentimos, no tienes permisos para acceder a esta página."}
        </p>
        {role && (
          <div className="user-role-info">
            <p>
              Tu rol actual es: <span className="role-badge">{getRoleName(role)}</span>
            </p>
            <p>Este rol no tiene los permisos necesarios para ver esta sección.</p>
          </div>
        )}
        <div className="action-buttons">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Volver
          </button>
          {role && (
            <button className="home-button" onClick={handleGoToAuthorizedArea}>
              <FaHome /> Ir a mi área
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedAccess
