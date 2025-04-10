"use client"
import { FaEye, FaTrashAlt, FaUserPlus, FaPen } from "react-icons/fa"
import "../../styles/residentsAdmin/ResidentTable.css"

function ResidentTable({ residents, onView, onUpdate, onToggleStatus, onDelete, onOpenForm, searchTerm }) {
  // Si no hay residentes, mostrar mensaje centrado con botón similar a la vista de casas
  if (!residents || residents.length === 0) {
    return (
      <div className="no-residents">
        {searchTerm ? (
          <h3>No se encontraron residentes con "{searchTerm}"</h3>
        ) : (
          <>
            <h3>No hay residentes registrados</h3>
            <button className="add-resident-btn" onClick={onOpenForm}>
              <FaUserPlus className="me-2" /> Agregar Residente
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light" style={{ backgroundColor: "#F2CBB6" }}>
          <tr>
            <th>Nombre del Residente</th>
            <th>Número de Casa</th>
            <th>Correo</th>
            <th>Calle</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((residente) => (
            <tr key={residente._id || residente.id}>
              <td>
                {residente.name} {residente.lastName || residente.surnames}
              </td>
              <td>{residente.house?.houseNumber || "N/A"}</td>
              <td>{residente.email}</td>
              <td>{residente.house?.street || residente.street || "N/A"}</td>
              <td>{residente.phone}</td>
              <td>
                <div className="justify-content-center gap-2">
                  {/* Ver detalles */}
                  <button className="btn btn-info btn-sm" onClick={() => onView(residente)} title="Ver detalles">
                    <FaEye />
                  </button>

                  {/* Actualizar */}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onUpdate(residente)}
                    title="Actualizar residente"
                  >
                    <FaPen />
                  </button>

                  {/* Toggle estado (switch) */}
                  <label className="switch" title={residente.status ? "Desactivar residente" : "Activar residente"}>
                    <input type="checkbox" checked={residente.status} onChange={() => onToggleStatus(residente)} />
                    <span className="slider"></span>
                  </label>

                  {/* Eliminar */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(residente)}
                    title="Eliminar residente"
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
  )
}

export default ResidentTable
