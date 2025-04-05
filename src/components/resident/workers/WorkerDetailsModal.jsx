"use client"
import { FaUser, FaIdCard, FaCalendarAlt, FaPhone, FaCar, FaBriefcase, FaBuilding } from "react-icons/fa"
import "../../../styles/resident/workers/WorkerDetailsModal.css"

function WorkerDetailsModal({ worker, onClose }) {
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
                <h4 className="worker-name">{worker.name}</h4>
                <span className={`status-badge ${worker.status ? "status-active" : "status-inactive"}`}>
                  {worker.status ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="details-section">
                <h6 className="section-title">Información Personal</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUser />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Nombre Completo</span>
                    <span className="detail-value">{worker.name}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaIdCard />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Identificación</span>
                    <span className="detail-value">{worker.identification}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaPhone />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Teléfono</span>
                    <span className="detail-value">{worker.phone || "No disponible"}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h6 className="section-title">Información Laboral</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaBriefcase />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Profesión</span>
                    <span className="detail-value">{worker.profession}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaBuilding />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Empresa</span>
                    <span className="detail-value">{worker.company}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha de Inicio</span>
                    <span className="detail-value">{worker.startDate}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha de Finalización</span>
                    <span className="detail-value">{worker.endDate}</span>
                  </div>
                </div>
              </div>

              {(worker.vehicle || worker.licensePlate) && (
                <div className="details-section">
                  <h6 className="section-title">Información del Vehículo</h6>

                  {worker.vehicle && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <FaCar />
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Vehículo</span>
                        <span className="detail-value">{worker.vehicle}</span>
                      </div>
                    </div>
                  )}

                  {worker.licensePlate && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <FaCar />
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Placa</span>
                        <span className="detail-value">{worker.licensePlate}</span>
                      </div>
                    </div>
                  )}
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

