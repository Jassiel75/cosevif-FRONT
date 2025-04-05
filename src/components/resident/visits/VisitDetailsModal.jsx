"use client"
import { FaUser, FaIdCard, FaCalendarAlt, FaClock, FaUsers, FaCar, FaClipboardList, FaKey } from "react-icons/fa"
import { QRCodeCanvas } from "qrcode.react"
import "../../../styles/resident/visits/VisitDetailsModal.css"

function VisitDetailsModal({ visit, onClose }) {
  // Reemplazar las funciones formatDate y formatTime con estas versiones mejoradas
  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A"

    try {
      // Extraer solo la parte de la fecha del string ISO
      const datePart = dateTimeStr.split("T")[0]
      const [year, month, day] = datePart.split("-")

      // Formatear la fecha en formato DD/MM/YYYY
      return `${day}/${month}/${year}`
    } catch (error) {
      console.error("Error al formatear la fecha:", error)
      return dateTimeStr
    }
  }

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A"

    try {
      // Extraer la parte de la hora del string ISO
      const timePart = dateTimeStr.split("T")[1]

      // Extraer horas y minutos
      let [hours, minutes] = timePart.split(":")
      hours = Number.parseInt(hours)

      // Determinar si es AM o PM
      const period = hours >= 12 ? "p.m." : "a.m."

      // Convertir a formato de 12 horas
      hours = hours % 12
      hours = hours ? hours : 12 // Si es 0, mostrar como 12

      // Formatear la hora en formato hh:mm a.m./p.m.
      return `${hours}:${minutes} ${period}`
    } catch (error) {
      console.error("Error al formatear la hora:", error)
      return dateTimeStr
    }
  }

  // Generar el contenido del QR para mostrarlo
  const generateQRContent = () => {
    // Formatear la fecha para mostrarla en el QR
    let formattedDate = "No disponible"
    if (visit.dateTime) {
      const date = new Date(visit.dateTime)
      formattedDate = date.toLocaleString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }

    // Crear el contenido del QR
    return `📌 VISITA REGISTRADA
🏡 Casa: [Casa del residente]
👤 Visitante: ${visit.visitorName || "Sin nombre"}
📅 Fecha y Hora: ${formattedDate}
🚗 Vehículo: ${visit.vehiclePlate || "No registrado"}
🔑 Clave de acceso: ${visit.password}
👥 Personas: ${visit.numPeople}`
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Detalles de la Visita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="visit-details">
              <div className="visit-header">
                <h4 className="visit-name">{visit.visitorName || "Visitante sin nombre"}</h4>
                <span
                  className={`status-badge ${visit.status === "ACTIVA" ? "status-active" : visit.status === "PENDIENTE" ? "status-pending" : "status-inactive"}`}
                >
                  {visit.status === "ACTIVA" ? "Activa" : visit.status === "PENDIENTE" ? "Pendiente" : "Caducada"}
                </span>
              </div>

              <div className="details-section">
                <h6 className="section-title">Información de la Visita</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUser />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Nombre del Visitante</span>
                    <span className="detail-value">{visit.visitorName || "Sin nombre"}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUsers />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Número de Personas</span>
                    <span className="detail-value">{visit.numPeople}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaKey />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Contraseña de Acceso</span>
                    <span className="detail-value">{visit.password}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h6 className="section-title">Fecha y Hora</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Fecha</span>
                    <span className="detail-value">{formatDate(visit.dateTime)}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaClock />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Hora</span>
                    <span className="detail-value">{formatTime(visit.dateTime)}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h6 className="section-title">Detalles Adicionales</h6>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaClipboardList />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Descripción</span>
                    <span className="detail-value">{visit.description}</span>
                  </div>
                </div>

                {visit.vehiclePlate && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <FaCar />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Placas del Vehículo</span>
                      <span className="detail-value">{visit.vehiclePlate}</span>
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaIdCard />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Código QR</span>
                    <div className="qr-code-container">
                      {visit.qrCode ? (
                        <img src={`data:image/png;base64,${visit.qrCode}`} alt="Código QR" className="qr-code-image" />
                      ) : (
                        <QRCodeCanvas
                          value={generateQRContent()}
                          size={150}
                          level="H"
                          includeMargin={true}
                          style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "white" }}
                        />
                      )}
                    </div>
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

export default VisitDetailsModal

