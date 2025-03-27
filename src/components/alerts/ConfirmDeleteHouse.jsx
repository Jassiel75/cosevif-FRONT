import React from "react";
import "../../styles/alerts/ConfirmDeleteHouse.css";

function ConfirmDeleteHouse({ show, handleClose, handleConfirm, houseNumber }) {
  if (!show) return null; // No renderiza nada si el modal no está visible

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Eliminación</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas eliminar la Casa #{houseNumber}?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteHouse;
