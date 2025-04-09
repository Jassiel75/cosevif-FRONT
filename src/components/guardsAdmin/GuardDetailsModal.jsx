"use client"
import { User, Mail, Phone, Calendar, MapPin, Shield, UserCircle, CalendarIcon, X } from "lucide-react"
import "../../styles/guardsAdmin/GuardDetailsModal.css"

function GuardDetailsModal({ guard, onClose }) {
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

  // Generar iniciales para el avatar
  const getInitials = () => {
    const nameInitial = guard.name ? guard.name.charAt(0) : ""
    const surnameInitial = guard.lastName || guard.surnames ? (guard.lastName || guard.surnames).charAt(0) : ""
    return (nameInitial + surnameInitial).toUpperCase()
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Guardia</h5>
            <button type="button" className="btn-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="guard-details">
              <div className="guard-header">
                <div className="guard-avatar">
                  <div className="avatar-circle">
                    <span>{getInitials()}</span>
                  </div>
                </div>
                <div className="guard-header-info">
                  <h4 className="guard-name">
                    {guard.name} {guard.lastName || guard.surnames || ""}
                  </h4>
                  <div className="guard-badges">
                    <span className={`status-badge ${guard.status ? "status-active" : "status-inactive"}`}>
                      {guard.status ? "Activo" : "Inactivo"}
                    </span>
                    <span className="role-badge">
                      <Shield size={14} /> Guardia
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h6 className="section-title">
                  <UserCircle size={18} className="section-icon" />
                  Información Personal
                </h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Nombre de Usuario</span>
                    <span className="detail-value">{guard.username || "No asignado"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Mail />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Correo Electrónico</span>
                    <span className="detail-value">{guard.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Phone />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Teléfono</span>
                    <span className="detail-value">{guard.phone || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Edad</span>
                    <span className="detail-value">{guard.age || "No disponible"} años</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <CalendarIcon />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha de Nacimiento</span>
                    <span className="detail-value">{formatDate(guard.birthDate)}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h6 className="section-title">
                  <MapPin size={18} className="section-icon" />
                  Dirección
                </h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Dirección</span>
                    <span className="detail-value">{guard.address || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Calle</span>
                    <span className="detail-value">{guard.street || "No disponible"}</span>
                  </div>
                </div>
              </div>

              {guard.createdAt && (
                <div className="details-section">
                  <h6 className="section-title">
                    <Calendar size={18} className="section-icon" />
                    Información Adicional
                  </h6>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <Calendar />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Fecha de Registro</span>
                      <span className="detail-value">{formatDate(guard.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-close-modal" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuardDetailsModal
