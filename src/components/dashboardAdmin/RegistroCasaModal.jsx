import React from "react";
import "../../styles/Dashboard.css";

const RegistroCasaModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Registro de Casa</h2>
        <form>
          <label>Residente de la casa</label>
          <select>
            <option>Selecciona el Residente</option>
          </select>

          <label>Calle</label>
          <input type="text" placeholder="Calle" />

          <label>Dirección</label>
          <input type="text" placeholder="Dirección" />

          <label>Número de casa</label>
          <input type="text" placeholder="Número de casa" />

          <label>Subir Imagen</label>
          <input type="file" />

          <div className="modal-buttons">
            <button className="btn-marron">Registrar</button>
            <button className="btn-gray" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroCasaModal;
