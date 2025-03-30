"use client"
import { FaEye, FaTrashAlt, FaShieldAlt } from "react-icons/fa"

function GuardTable({ guards, onView, onUpdate, onToggleStatus, onDelete, onOpenForm }) {
  // Si no hay guardias, mostrar mensaje centrado con botón para agregar
  if (!guards || guards.length === 0) {
    return (
      <div className="no-guards">
        <h3>No hay guardias registrados</h3>
        <button className="add-guard-btn" onClick={onOpenForm}>
          <FaShieldAlt className="me-2" /> Agregar Guardia
        </button>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
          <tr>
            <th>Nombre del Guardia</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Ver más</th>
            <th>Actualizar</th>
            <th>Estado</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {guards.map((guardia) => (
            <tr key={guardia.id}>
              <td>
                {guardia.name} {guardia.lastName || guardia.surnames || ""}
              </td>
              <td>{guardia.username || "N/A"}</td>
              <td>{guardia.email}</td>
              <td>{guardia.phone || "N/A"}</td>
              <td>{guardia.age || "N/A"}</td>
              <td>
                <button className="btn btn-link" onClick={() => onView(guardia)}>
                  <FaEye />
                </button>
              </td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => onUpdate(guardia)}>
                  Actualizar
                </button>
              </td>
              <td>
                <span
                  className={`badge rounded-pill ${guardia.status ? "bg-success" : "bg-danger"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => onToggleStatus(guardia)}
                >
                  {guardia.status ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(guardia)}>
                  <FaTrashAlt className="me-1" /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GuardTable

