"use client"

import { MapPin, Hash, FileText, Calendar, User, X } from "lucide-react"
import "../styles/HouseDetailsModal.css"

function HouseDetailsModal({ house, onClose }) {
  // Función para formatear la fecha si existe
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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Casa #{house.houseNumber}</h5>
            <button type="button" className="btn-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="house-details">
              {/* Imagen de la casa si existe */}
              {house.photo && (
                <div className="house-image-container">
                  <img
                    src={`data:image/jpeg;base64,${house.photo}`}
                    alt={`Casa #${house.houseNumber}`}
                    className="house-image"
                  />
                </div>
              )}

              <div className="details-section">
                <h6 className="section-title">Información de la Propiedad</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Hash />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Número de Casa</span>
                    <span className="detail-value">{house.houseNumber}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Dirección</span>
                    <span className="detail-value">{house.address || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Calle</span>
                    <span className="detail-value">{house.street || "No disponible"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FileText />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Descripción</span>
                    <span className="detail-value">{house.description || "Sin descripción"}</span>
                  </div>
                </div>

                {house.createdAt && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <Calendar />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Fecha de Registro</span>
                      <span className="detail-value">{formatDate(house.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de residente si existe */}
              {house.resident && (
                <div className="details-section">
                  <h6 className="section-title">Residente Asignado</h6>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <User />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Nombre</span>
                      <span className="detail-value">
                        {house.resident.name} {house.resident.surnames || house.resident.lastName || ""}
                      </span>
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

export default HouseDetailsModal
