import React from "react";

function HouseDetailsModal({ house, onClose }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Detalles de la Casa #{house.houseNumber}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
          
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <p>{house.address}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Calle</label>
              <p>{house.street}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Número de Casa</label>
              <p>{house.houseNumber}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <p>{house.description}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Imagen de la Casa</label>
              <img src={`data:image/jpeg;base64,${house.photo}`} alt={`Casa ${house.houseNumber}`} className="img-fluid" />
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
