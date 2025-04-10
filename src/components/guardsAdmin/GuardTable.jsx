"use client"
import { FaEye, FaTrashAlt, FaShieldAlt, FaPen } from "react-icons/fa"
import "../../styles/guardsAdmin/GuardTable.css"

function GuardTable({ guards, onView, onUpdate, onToggleStatus, onDelete, onOpenForm, searchTerm }) {
  // Si no hay guardias, mostrar mensaje centrado con botón para agregar
  if (!guards || guards.length === 0) {
    return (
      <div className="no-guards">
        {searchTerm ? (
          <h3>No se encontraron guardias con "{searchTerm}"</h3>
        ) : (
          <>
            <h3>No hay guardias registrados</h3>
            <button className="add-guard-btn" onClick={onOpenForm}>
              <FaShieldAlt className="me-2" /> Agregar Guardia
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
            <tr>
              <th>Nombre del Guardia</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Edad</th>
              <th>Acciones</th>
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
                  <div className="justify-content-center gap-2">
                    {/* Ver detalles */}
                    <button className="btn btn-info btn-sm" onClick={() => onView(guardia)} title="Ver detalles">
                      <FaEye />
                    </button>

                    {/* Actualizar */}
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.preventDefault()
                        if (!guardia || !guardia.id) {
                          console.error("Error: Guardia sin ID", guardia)
                          alert("No se puede actualizar el guardia porque no tiene un ID válido")
                          return
                        }
                        onUpdate(guardia)
                      }}
                      title="Actualizar guardia"
                    >
                      <FaPen />
                    </button>

                    {/* Toggle estado (switch) */}
                    <label className="switch" title={guardia.status ? "Desactivar guardia" : "Activar guardia"}>
                      <input type="checkbox" checked={guardia.status} onChange={() => onToggleStatus(guardia)} />
                      <span className="slider"></span>
                    </label>

                    {/* Eliminar */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(guardia)}
                      title="Eliminar guardia"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="guard-cards d-block d-md-none">
        {guards.map((guardia) => (
          <div className="guard-card" key={guardia.id}>
            <div className="guard-card-header">
              <div className="guard-card-name">
                {guardia.name} {guardia.lastName || guardia.surnames || ""}
              </div>
              <label className="switch" title={guardia.status ? "Desactivar guardia" : "Activar guardia"}>
                <input type="checkbox" checked={guardia.status} onChange={() => onToggleStatus(guardia)} />
                <span className="slider"></span>
              </label>
            </div>

            <div className="guard-card-content">
              <div className="guard-card-item">
                <div className="guard-card-label">Usuario:</div>
                <div className="guard-card-value">{guardia.username || "N/A"}</div>
              </div>
              <div className="guard-card-item">
                <div className="guard-card-label">Correo:</div>
                <div className="guard-card-value">{guardia.email}</div>
              </div>
              <div className="guard-card-item">
                <div className="guard-card-label">Teléfono:</div>
                <div className="guard-card-value">{guardia.phone || "N/A"}</div>
              </div>
              <div className="guard-card-item">
                <div className="guard-card-label">Edad:</div>
                <div className="guard-card-value">{guardia.age || "N/A"}</div>
              </div>
            </div>

            <div className="guard-card-actions">
              <button className="btn btn-info btn-sm" onClick={() => onView(guardia)} title="Ver detalles">
                <FaEye />
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.preventDefault()
                  if (!guardia || !guardia.id) {
                    console.error("Error: Guardia sin ID", guardia)
                    alert("No se puede actualizar el guardia porque no tiene un ID válido")
                    return
                  }
                  onUpdate(guardia)
                }}
                title="Actualizar guardia"
              >
                <FaPen />
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(guardia)} title="Eliminar guardia">
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuardTable
