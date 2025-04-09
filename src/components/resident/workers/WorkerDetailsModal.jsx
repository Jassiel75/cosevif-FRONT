"use client"
import { FaUser, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import "../../../styles/resident/workers/WorkerDetailsModal.css"

function WorkerDetailsModal({ worker, onClose }) {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Trabajador</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="worker-details">
              <div className="worker-header">
                <h4 className="worker-name">{worker.workerName}</h4>
              </div>

              <div className="details-section">
                <h6 className="section-title">Información Personal</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUser />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Nombre Completo</span>
                    <span className="detail-value">{worker.workerName}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Edad</span>
                    <span className="detail-value">{worker.age} años</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Dirección</span>
                    <span className="detail-value">{worker.address}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha</span>
                    <span className="detail-value">{formatDate(worker.dateTime)}</span>
                  </div>
                </div>
              </div>

              {worker.inePhoto && (
                <div className="details-section">
                  <h6 className="section-title">Identificación</h6>
                  <div className="text-center mt-3">
                    <img
                      src={`data:image/jpeg;base64,${worker.inePhoto}`}
                      alt="Identificación"
                      className="img-fluid ine-photo"
                      style={{ maxHeight: "200px", border: "1px solid #ddd" }}
                    />
                  </div>
                </div>
              )}
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

export default WorkerDetailsModal

