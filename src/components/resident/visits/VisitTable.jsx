"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen, FaQrcode, FaBan } from "react-icons/fa"
import { determineVisitStatus, shouldShowQR, VISIT_STATUS } from "./VisitModel"

function VisitTable({ visits, onView, onUpdate, onDelete, onOpenForm, onShowQR, onCancelVisit }) {
  // Si no hay visitas, mostrar mensaje centrado con botón
  if (!visits || visits.length === 0) {
    return (
      <div className="no-visits">
        <h3>No hay visitas registradas</h3>
        <button className="add-visit-btn" onClick={onOpenForm}>
          <FaUserPlus className="me-2" /> Agregar Visita
        </button>
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
            const showQrButton = shouldShowQR(visit.dateTime) && visit.status !== VISIT_STATUS.CANCELLED
            const isCancellable =
              visit.status !== VISIT_STATUS.CANCELLED &&
              visit.status !== VISIT_STATUS.EXPIRED &&
              visit.status !== VISIT_STATUS.COMPLETED

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
                  <div className="justify-content-center" style={{ gap: "8px" }}>
                    <button className="btn btn-info btn-sm" onClick={() => onView(visit)} title="Ver detalles">
                      <FaEye />
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => onUpdate(visit)} title="Editar">
                      <FaPen />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(visit)} title="Eliminar">
                      <FaTrashAlt />
                    </button>
                    {showQrButton && (
                      <button className="btn btn-success btn-sm" onClick={() => onShowQR(visit)} title="Ver QR">
                        <FaQrcode />
                      </button>
                    )}
                    {isCancellable && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onCancelVisit(visit)}
                        title="Cancelar visita"
                      >
                        <FaBan />
                      </button>
                    )}
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

