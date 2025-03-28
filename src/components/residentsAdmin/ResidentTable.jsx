import React from "react";
import { FaEye } from "react-icons/fa";
// import "../../styles/residentsAdmin/ResidentTable.css"; // Puedes crear este CSS si deseas personalizar más

function ResidentTable({ residents, onView, onUpdate, onToggleStatus }) {
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
            <th>Ver más</th>
            <th>Actualizar</th>
            <th>Bloquear / Desbloquear</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((residente) => (
            <tr key={residente._id}>
              <td>{residente.name} {residente.lastName}</td>
              <td>#{residente.house?.houseNumber || "N/A"}</td>
              <td>{residente.email}</td>
              <td>{residente.house?.street || "N/A"}</td>
              <td>{residente.phone}</td>
              <td>
                <button className="btn btn-link" onClick={() => onView(residente)}>
                  <FaEye />
                </button>
              </td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => onUpdate(residente)}>
                  Actualizar
                </button>
              </td>
              <td>
                <span
                  className={`badge rounded-pill ${
                    residente.status ? "bg-success" : "bg-danger"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => onToggleStatus(residente)}
                >
                  {residente.status ? "Activo" : "Inactivo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResidentTable;
