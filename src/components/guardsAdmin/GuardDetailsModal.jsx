"use client"
import { FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaMapMarkerAlt } from "react-icons/fa"
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

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Guardia</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="guard-details">
              <div className="guard-header">
                <h4 className="guard-name">
                  {guard.name} {guard.lastName}
                </h4>
                <span className={`status-badge ${guard.status ? "status-active" : "status-inactive"}`}>
                  {guard.status ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="details-section">
                <h6 className="section-title">Información Personal</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaIdCard />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Nombre de Usuario</span>
                    <span className="detail-value">{guard.username || "No asignado"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaEnvelope />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Correo Electrónico</span>
                    <span className="detail-value">{guard.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaPhone />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Teléfono</span>
                    <span className="detail-value">{guard.phone || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Edad</span>
                    <span className="detail-value">{guard.age || "No disponible"} años</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha de Nacimiento</span>
                    <span className="detail-value">{formatDate(guard.birthDate)}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h6 className="section-title">Dirección</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Dirección</span>
                    <span className="detail-value">{guard.address || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Calle</span>
                    <span className="detail-value">{guard.street || "No disponible"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuardDetailsModal

