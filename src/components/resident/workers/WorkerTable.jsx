"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen } from "react-icons/fa"
import "../../../styles/resident/workers/WorkerTable.css"

function WorkerTable({ workers, onView, onUpdate, onToggleStatus, onDelete, onOpenForm, searchTerm }) {
  if (!workers || workers.length === 0) {
    return (
      <div className="no-workers">
        {searchTerm ? (
          <h3>
            No se encontraron trabajadores con "<span className="search-term">{searchTerm}</span>"
          </h3>
        ) : (
          <>
            <h3>No hay trabajadores registrados</h3>
            <button className="add-worker-btn" onClick={onOpenForm}>
              <FaUserPlus className="me-2" /> Agregar Trabajador
            </button>
          </>
        )}
        {searchTerm && <p className="search-tip">Puedes buscar por nombre, dirección, edad, fecha o hora.</p>}
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
                <div className="action-buttons">
                  <button className="action-button view-btn" onClick={() => onView(worker)} title="Ver detalles">
                    <FaEye />
                  </button>
                  <button className="action-button edit-btn" onClick={() => onUpdate(worker)} title="Editar">
                    <FaPen />
                  </button>
                  <button className="action-button delete-btn" onClick={() => onDelete(worker)} title="Eliminar">
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
