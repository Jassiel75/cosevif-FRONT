"use client"
import { FaExclamationTriangle } from "react-icons/fa"
import "../../../styles/resident/visits/ConfirmDeleteVisit.css" // Reutilizamos el mismo estilo

function ConfirmCancelVisit({ show, handleClose, handleConfirm, visitName }) {
  if (!show) return null // No renderiza nada si el modal no está visible

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <FaExclamationTriangle className="me-2" /> Confirmar Cancelación
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-1">¿Estás seguro de que deseas cancelar la visita de?</p>
            <p className="fw-bold">{visitName}</p>
            <div className="alert alert-warning mt-3">
              <small>
                <FaExclamationTriangle className="me-1" /> Una vez cancelada, la visita no podrá ser reactivada y el
                código QR dejará de funcionar. Deberás crear una nueva visita si es necesario.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Volver
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
              Cancelar Visita
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmCancelVisit
