"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ResidentLayout from "./ResidentLayout"
import { User, Mail, Phone, Calendar, MapPin, Home } from "lucide-react"
import ResidentUpdateModal from "./ResidentUpdateModal"
import "../../styles/resident/ResidentProfile.css"

function ResidentProfile() {
  const [userData, setUserData] = useState({
    name: "",
    surnames: "",
    email: "",
    phone: "",
    age: "",
    birthDate: "",
    address: "",
    street: "",
    house: null,
  })
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Cargar datos del usuario al iniciar
  const loadUserData = () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/")
      return
    }

    // Obtener datos del localStorage
    const userData = {
      name: localStorage.getItem("name") || "",
      surnames: localStorage.getItem("surnames") || "",
      email: localStorage.getItem("email") || "",
      phone: localStorage.getItem("phone") || "",
      age: localStorage.getItem("age") || "",
      birthDate: localStorage.getItem("birthDate") || "",
      address: localStorage.getItem("address") || "",
      street: localStorage.getItem("street") || "",
      house: {
        houseNumber: localStorage.getItem("houseNumber") || "",
        street: localStorage.getItem("street") || "",
      },
    }

    setUserData(userData)
    setLoading(false)
  }

  useEffect(() => {
    loadUserData()
  }, [navigate])

  // Formatear la fecha si existe
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  // Handle navigation to other views
  const handleViewChange = (view) => {
    navigate("/resident/dashboard")
  }

  // Abrir modal de actualización
  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true)
  }

  // Cerrar modal de actualización
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false)
  }

  // Manejar actualización exitosa
  const handleUpdateSuccess = () => {
    loadUserData() // Recargar los datos del usuario
    setShowUpdateModal(false)
  }

  if (loading) {
    return (
      <ResidentLayout
        title="Mi Perfil"
        subtitle="Cargando información..."
        viewType="profile"
        onViewChange={handleViewChange}
        userData={userData}
      >
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </ResidentLayout>
    )
  }

  return (
    <ResidentLayout
      title="Mi Perfil"
      subtitle="Información Personal"
      viewType="profile"
      onViewChange={handleViewChange}
      userData={userData}
    >
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-name">
            {userData.name} {userData.surnames}
          </h2>
          <p className="profile-role">Residente</p>
          <button className="update-profile-btn" onClick={handleOpenUpdateModal}>
            Actualizar Información
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3 className="section-title">Información Personal</h3>

            <div className="profile-info-item">
              <div className="info-icon">
                <User size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Nombre Completo</span>
                <span className="info-value">
                  {userData.name} {userData.surnames}
                </span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <Mail size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Correo Electrónico</span>
                <span className="info-value">{userData.email}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <Phone size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Teléfono</span>
                <span className="info-value">{userData.phone || "No disponible"}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <Calendar size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Edad</span>
                <span className="info-value">{userData.age || "No disponible"} años</span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <Calendar size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Fecha de Nacimiento</span>
                <span className="info-value">{formatDate(userData.birthDate)}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Dirección</h3>

            <div className="profile-info-item">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Dirección</span>
                <span className="info-value">{userData.address || "No disponible"}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Calle</span>
                <span className="info-value">{userData.street || "No disponible"}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <Home size={20} />
              </div>
              <div className="info-content">
                <span className="info-label">Casa</span>
                <span className="info-value">
                  {userData.house?.houseNumber ? `#${userData.house.houseNumber}` : "No asignada"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <ResidentUpdateModal resident={userData} onClose={handleCloseUpdateModal} onSuccess={handleUpdateSuccess} />
      )}
    </ResidentLayout>
  )
}

export default ResidentProfile
