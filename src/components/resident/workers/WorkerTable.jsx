"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen } from "react-icons/fa"
import "../../../styles/resident/workers/WorkerTable.css"

function WorkerTable({ workers, onView, onUpdate, onToggleStatus, onDelete, onOpenForm }) {
  // Si no hay trabajadores, mostrar mensaje centrado con botón
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

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
          <tr>
            <th>Nombre del Trabajador</th>
            <th>Identificación</th>
            <th>Profesión</th>
            <th>Empresa</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.name}</td>
              <td>{worker.identification}</td>
              <td>{worker.profession}</td>
              <td>{worker.company}</td>
              <td>{worker.startDate}</td>
              <td>{worker.endDate}</td>
              <td>{worker.phone}</td>
              <td>
                <div className=" justify-content-center" style={{ gap: "8px" }}>
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

