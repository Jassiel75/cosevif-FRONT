"use client"
import { User, Mail, Phone, Calendar, MapPin, Home, UserCircle, CalendarIcon, X } from "lucide-react"
import "../../styles/residentsAdmin/ResidentDetailsModal.css"

function ResidentDetailsModal({ resident, onClose }) {
  // Formatear la fecha de nacimiento si existe
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
    const nameInitial = resident.name ? resident.name.charAt(0) : ""
    const surnameInitial =
      resident.lastName || resident.surnames ? (resident.lastName || resident.surnames).charAt(0) : ""
    return (nameInitial + surnameInitial).toUpperCase()
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Residente</h5>
            <button type="button" className="btn-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="resident-details">
              <div className="resident-header">
                <div className="resident-avatar">
                  <div className="avatar-circle">
                    <span>{getInitials()}</span>
                  </div>
                </div>
                <div className="resident-header-info">
                  <h4 className="resident-name">
                    {resident.name} {resident.lastName || resident.surnames}
                  </h4>
                  <div className="resident-badges">
                    <span className={`status-badge ${resident.status ? "status-active" : "status-inactive"}`}>
                      {resident.status ? "Activo" : "Inactivo"}
                    </span>
                    {resident.house && (
                      <span className="house-badge">
                        <Home size={14} /> Casa #{resident.house.houseNumber}
                      </span>
                    )}
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
                    <Mail />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Correo Electrónico</span>
                    <span className="detail-value">{resident.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Phone />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Teléfono</span>
                    <span className="detail-value">{resident.phone || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Edad</span>
                    <span className="detail-value">{resident.age || "No disponible"} años</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <CalendarIcon />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha de Nacimiento</span>
                    <span className="detail-value">{formatDate(resident.birthDate)}</span>
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
                    <span className="detail-value">{resident.address || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Calle</span>
                    <span className="detail-value">{resident.street || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Home />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Casa Asignada</span>
                    <span className="detail-value">
                      {resident.house ? `Casa #${resident.house.houseNumber}` : "No asignada"}
                    </span>
                  </div>
                </div>
              </div>

              {resident.createdAt && (
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
                      <span className="detail-value">{formatDate(resident.createdAt)}</span>
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

export default ResidentDetailsModal
