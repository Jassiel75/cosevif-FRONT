import React from "react";

import "../styles/HouseDetailsModal.css";

function HouseDetailsModal({ house, onClose }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(112, 107, 107, 0.72)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Detalles de la Casa #{house.houseNumber}</h5>
          </div>

          <div className="modal-body">
          
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <p>{house.address}</p>
            </div>
            <div className="mb-4">
              <label className="form-label">Calle</label>
              <p>{house.street}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Número de Casa</label>
              <p>{house.houseNumber}</p>
            </div>
            <div className="mb-4">
              <label className="form-label">Descripción</label>
              <p>{house.description}</p>
            </div>
           
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseDetailsModal;
