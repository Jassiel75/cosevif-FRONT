import React from "react";
import "../../../styles/admin/DetallesCasaModal.css";

const DetallesCasaModal = ({ casa, onClose }) => {
  if (!casa) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles de Casa #{casa.houseNumber || "Sin número"}</h2>

        {/* 🔥 Contenedor de los datos */}
        <div className="modal-info">
          <label>Nombre del residente</label>
          <input type="text" value={casa.residentName || "No disponible"} readOnly />

          <label>Contacto</label>
          <input type="text" value={casa.contact || "No disponible"} readOnly />

          <label>Status</label>
          <input type="text" value={casa.status || "No disponible"} readOnly />

          <label>Dirección</label>
          <input type="text" value={casa.address || "No disponible"} readOnly />

          <label>Calle</label>
          <input type="text" value={casa.street || "No disponible"} readOnly />

          {/* 🔥 Mostrar imagen si existe */}
          {casa.photo && (
            <img
              src={`data:image/jpeg;base64,${casa.photo}`}
              alt="Casa"
              className="casa-img"
            />
          )}
        </div>

        {/* 🔥 Botón para cerrar */}
        <button className="btn-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default DetallesCasaModal;
  