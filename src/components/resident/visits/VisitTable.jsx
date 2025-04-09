"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen, FaQrcode, FaBan, FaShareAlt } from "react-icons/fa"
import { determineVisitStatus, shouldShowQR, VISIT_STATUS } from "./VisitModel"
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
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Visitante</th>
            <th>Personas</th>
            <th>Descripción</th>
            <th>Placas</th>
            <th>Contraseña</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => {
            const { text, bgColor } = getStatusDisplay(visit)
            const currentStatus = determineVisitStatus(visit)
            const isCancelled = currentStatus === VISIT_STATUS.CANCELLED
            const isExpired = currentStatus === VISIT_STATUS.EXPIRED
            const isCompleted = currentStatus === VISIT_STATUS.COMPLETED

            const canEdit = !isCancelled && !isExpired && !isCompleted
            const canShowQR = shouldShowQR(visit.dateTime) && !isCancelled
            const canShare = currentStatus === VISIT_STATUS.PENDING
            const canCancel = !isCancelled && !isExpired && !isCompleted

            return (
              <tr key={visit.id}>
                <td>{formatDate(visit.dateTime)}</td>
                <td>{formatTime(visit.dateTime)}</td>
                <td>{visit.visitorName || "Sin nombre"}</td>
                <td>{visit.numPeople}</td>
                <td>{visit.description}</td>
                <td>{visit.vehiclePlate || "N/A"}</td>
                <td>{visit.password}</td>
                <td>
                  <span className={`badge rounded-pill ${bgColor}`}>{text}</span>
                </td>
                <td>
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
  )
}

export default VisitTable
