"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen } from "react-icons/fa"
import "../../../styles/resident/workers/WorkerTable.css"

function WorkerTable({ workers, onView, onUpdate, onToggleStatus, onDelete, onOpenForm }) {
  if (!workers || workers.length === 0) {
    return (
      <div className="no-workers">
        <h3>No hay trabajadores registrados</h3>
        <button className="add-worker-btn" onClick={onOpenForm}>
          <FaUserPlus className="me-2" /> Agregar Trabajador
        </button>
      </div>
    )
  }

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

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return dateString
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
          <tr>
            <th>Nombre del Trabajador</th>
            <th>Edad</th>
            <th>Dirección</th>
            <th>Fecha</th>
            <th>Hora</th> {/* 🔸 Nueva columna */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.workerName}</td>
              <td>{worker.age}</td>
              <td>{worker.address}</td>
              <td>{formatDate(worker.dateTime)}</td>
              <td>{formatTime(worker.dateTime)}</td> {/* 🔸 Hora separada */}
              <td>
                <div className="justify-content-center" style={{ gap: "8px" }}>
                  <button className="btn btn-info btn-sm" onClick={() => onView(worker)}>
                    <FaEye />
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => onUpdate(worker)}>
                    <FaPen />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(worker)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkerTable
