"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ResidentLayout from "./ResidentLayout"
import { User, Mail, Phone, Calendar, MapPin, Home, Edit, Shield, UserCircle } from "lucide-react"
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

  // Generar iniciales para el avatar
  const getInitials = () => {
    const nameInitial = userData.name ? userData.name.charAt(0) : ""
    const surnameInitial = userData.surnames ? userData.surnames.charAt(0) : ""
    return (nameInitial + surnameInitial).toUpperCase()
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
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span>{getInitials()}</span>
            </div>
          </div>
          <div className="profile-title">
            <h2 className="profile-name">
              {userData.name} {userData.surnames}
            </h2>
            <div className="profile-badges">
              <span className="profile-role">
                <Shield size={14} /> Residente
              </span>
              {userData.house?.houseNumber && (
                <span className="profile-house">
                  <Home size={14} /> Casa #{userData.house.houseNumber}
                </span>
              )}
            </div>
          </div>
          <button className="update-profile-btn" onClick={handleOpenUpdateModal}>
            <Edit size={16} /> Editar Perfil
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <UserCircle size={20} />
              <h3>Información Personal</h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <User size={16} /> Nombre Completo
                  </div>
                  <div className="info-value">
                    {userData.name} {userData.surnames}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Mail size={16} /> Correo Electrónico
                  </div>
                  <div className="info-value">{userData.email}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Phone size={16} /> Teléfono
                  </div>
                  <div className="info-value">{userData.phone || "No disponible"}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Calendar size={16} /> Edad
                  </div>
                  <div className="info-value">{userData.age || "No disponible"} años</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Calendar size={16} /> Fecha de Nacimiento
                  </div>
                  <div className="info-value">{formatDate(userData.birthDate)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header">
              <MapPin size={20} />
              <h3>Dirección</h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <MapPin size={16} /> Dirección
                  </div>
                  <div className="info-value">{userData.address || "No disponible"}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <MapPin size={16} /> Calle
                  </div>
                  <div className="info-value">{userData.street || "No disponible"}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Home size={16} /> Casa
                  </div>
                  <div className="info-value">
                    {userData.house?.houseNumber ? `#${userData.house.houseNumber}` : "No asignada"}
                  </div>
                </div>
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
