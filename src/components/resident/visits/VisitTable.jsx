"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen, FaQrcode, FaBan } from "react-icons/fa"
import { determineVisitStatus, VISIT_STATUS } from "./VisitModel"
import "../../../styles/resident/visits/VisitTable.css"

function VisitTable({
  visits,
  onView,
  onUpdate,
  onDelete,
  onOpenForm,
  onShowQR,
  onShowShareLink,
  onCancelVisit,
  searchTerm,
}) {
  // Si no hay visitas, mostrar mensaje centrado con botón
  if (!visits || visits.length === 0) {
    return (
      <div className="no-visits">
        {searchTerm ? (
          <h3>
            No se encontraron visitas con "<span className="search-term">{searchTerm}</span>"
          </h3>
        ) : (
          <>
            <h3>No hay visitas registradas</h3>
            <button className="add-visit-btn" onClick={onOpenForm}>
              <FaUserPlus className="me-2" /> Agregar Visita
            </button>
          </>
        )}
      </div>
    )
  }

  // Función para formatear la fecha y hora
  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A"
    const date = new Date(dateTimeStr)
    return date.toLocaleDateString("es-MX")
  }

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A"
    const date = new Date(dateTimeStr)
    return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  }

  // Función para determinar el texto y color del estado
  const getStatusDisplay = (visit) => {
    const currentStatus = determineVisitStatus(visit)

    switch (currentStatus) {
      case VISIT_STATUS.PENDING:
        return { text: "Pendiente", bgColor: "bg-warning" }
      case VISIT_STATUS.IN_PROGRESS:
        return { text: "En Progreso", bgColor: "bg-success" }
      case VISIT_STATUS.COMPLETED:
        return { text: "Completada", bgColor: "bg-primary" }
      case VISIT_STATUS.EXPIRED:
        return { text: "Caducada", bgColor: "bg-danger" }
      case VISIT_STATUS.CANCELLED:
        return { text: "Cancelada", bgColor: "bg-secondary" }
      default:
        return { text: "Desconocido", bgColor: "bg-light" }
    }
  }

  return (
    <div className="table-responsive">
      {/* Tabla original (visible en pantallas medianas y grandes) */}
      <div className="d-none d-md-block">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
            <tr>
              {/* Columna visible en todos los dispositivos */}
              <th>Fecha</th>
              {/* Columnas visibles solo en dispositivos medianos y grandes */}
              <th className="d-none d-md-table-cell">Hora</th>
              <th>Visitante</th>
              <th className="d-none d-md-table-cell">Personas</th>
              <th className="d-none d-md-table-cell">Descripción</th>
              <th className="d-none d-md-table-cell">Placas</th>
              <th>Contraseña</th>
              <th>Estado</th>
              <th style={{ width: "150px", minWidth: "150px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => {
              const { text, bgColor } = getStatusDisplay(visit)
              const currentStatus = determineVisitStatus(visit)
              const isCancelled = currentStatus === VISIT_STATUS.CANCELLED

              // Determinar si se puede mostrar el QR solo para visitas pendientes o en progreso
              const canShowQR = currentStatus === VISIT_STATUS.PENDING || currentStatus === VISIT_STATUS.IN_PROGRESS

              const isExpired = currentStatus === VISIT_STATUS.EXPIRED
              const isCompleted = currentStatus === VISIT_STATUS.COMPLETED
              const canEdit = !isCancelled && !isExpired && !isCompleted
              const canCancel = !isCancelled && !isExpired && !isCompleted

              return (
                <tr key={visit.id}>
                  {/* Columna visible en todos los dispositivos */}
                  <td>{formatDate(visit.dateTime)}</td>
                  {/* Columnas visibles solo en dispositivos medianos y grandes */}
                  <td className="d-none d-md-table-cell">{formatTime(visit.dateTime)}</td>
                  <td>{visit.visitorName || "Sin nombre"}</td>
                  <td className="d-none d-md-table-cell">{visit.numPeople}</td>
                  <td className="d-none d-md-table-cell">{visit.description}</td>
                  <td className="d-none d-md-table-cell">{visit.vehiclePlate || "N/A"}</td>
                  <td>{visit.password}</td>
                  <td>
                    <span className={`badge rounded-pill ${bgColor}`}>{text}</span>
                  </td>
                  <td style={{ width: "150px", minWidth: "150px" }}>
                    <div className="action-buttons">
                      <button className="action-button view-btn" onClick={() => onView(visit)} title="Ver detalles">
                        <FaEye />
                      </button>
                      <button
                        className={`action-button edit-btn ${!canEdit ? "disabled" : ""}`}
                        onClick={() => canEdit && onUpdate(visit)}
                        disabled={!canEdit}
                        title={canEdit ? "Editar" : "No se puede editar"}
                      >
                        <FaPen />
                      </button>
                      <button className="action-button delete-btn" onClick={() => onDelete(visit)} title="Eliminar">
                        <FaTrashAlt />
                      </button>
                      <button
                        className={`action-button qr-btn ${!canShowQR ? "disabled" : ""}`}
                        onClick={() => canShowQR && onShowQR(visit)}
                        disabled={!canShowQR}
                        title={canShowQR ? "Ver QR" : "QR no disponible"}
                      >
                        <FaQrcode />
                      </button>
                      <button
                        className={`action-button cancel-btn ${!canCancel ? "disabled" : ""}`}
                        onClick={() => canCancel && onCancelVisit(visit)}
                        disabled={!canCancel}
                        title={canCancel ? "Cancelar visita" : "No se puede cancelar"}
                      >
                        <FaBan />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para dispositivos móviles (visible solo en pantallas pequeñas) */}
      <div className="d-md-none">
        {visits.map((visit) => {
          const { text, bgColor } = getStatusDisplay(visit)
          const currentStatus = determineVisitStatus(visit)
          const isCancelled = currentStatus === VISIT_STATUS.CANCELLED

          // Determinar si se puede mostrar el QR solo para visitas pendientes o en progreso
          const canShowQR = currentStatus === VISIT_STATUS.PENDING || currentStatus === VISIT_STATUS.IN_PROGRESS

          const isExpired = currentStatus === VISIT_STATUS.EXPIRED
          const isCompleted = currentStatus === VISIT_STATUS.COMPLETED
          const canEdit = !isCancelled && !isExpired && !isCompleted
          const canCancel = !isCancelled && !isExpired && !isCompleted

          return (
            <div key={visit.id} className="visit-card">
              <div className="visit-card-header">
                <h5 className="visit-name">{visit.visitorName || "Sin nombre"}</h5>
                <span className={`badge rounded-pill ${bgColor}`}>{text}</span>
              </div>
              <div className="visit-card-body">
                <div className="visit-info-row">
                  <span className="visit-info-label">Fecha:</span>
                  <span className="visit-info-value">{formatDate(visit.dateTime)}</span>
                </div>
                <div className="visit-info-row">
                  <span className="visit-info-label">Hora:</span>
                  <span className="visit-info-value">{formatTime(visit.dateTime)}</span>
                </div>
                <div className="visit-info-row">
                  <span className="visit-info-label">Personas:</span>
                  <span className="visit-info-value">{visit.numPeople}</span>
                </div>
                <div className="visit-info-row">
                  <span className="visit-info-label">Contraseña:</span>
                  <span className="visit-info-value">{visit.password}</span>
                </div>
                {visit.vehiclePlate && (
                  <div className="visit-info-row">
                    <span className="visit-info-label">Placas:</span>
                    <span className="visit-info-value">{visit.vehiclePlate}</span>
                  </div>
                )}
                {visit.description && (
                  <div className="visit-info-row">
                    <span className="visit-info-label">Descripción:</span>
                    <span className="visit-info-value">{visit.description}</span>
                  </div>
                )}
              </div>
              <div className="visit-card-footer">
                <div className="action-buttons mobile-actions">
                  <button className="action-button view-btn" onClick={() => onView(visit)} title="Ver detalles">
                    <FaEye />
                  </button>
                  <button
                    className={`action-button edit-btn ${!canEdit ? "disabled" : ""}`}
                    onClick={() => canEdit && onUpdate(visit)}
                    disabled={!canEdit}
                    title={canEdit ? "Editar" : "No se puede editar"}
                  >
                    <FaPen />
                  </button>
                  <button className="action-button delete-btn" onClick={() => onDelete(visit)} title="Eliminar">
                    <FaTrashAlt />
                  </button>
                  <button
                    className={`action-button qr-btn ${!canShowQR ? "disabled" : ""}`}
                    onClick={() => canShowQR && onShowQR(visit)}
                    disabled={!canShowQR}
                    title={canShowQR ? "Ver QR" : "QR no disponible"}
                  >
                    <FaQrcode />
                  </button>
                  <button
                    className={`action-button cancel-btn ${!canCancel ? "disabled" : ""}`}
                    onClick={() => canCancel && onCancelVisit(visit)}
                    disabled={!canCancel}
                    title={canCancel ? "Cancelar visita" : "No se puede cancelar"}
                  >
                    <FaBan />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VisitTable
