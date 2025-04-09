"use client"
import { FaExclamationTriangle } from "react-icons/fa"
import "../../styles/alerts/ConfirmStatusChange.css"

function ConfirmStatusChange({ show, handleClose, handleConfirm, userName, currentStatus }) {
  if (!show) return null // No renderiza nada si el modal no está visible

  const isActivating = !currentStatus
  const actionText = isActivating ? "activar" : "desactivar"
  const consequenceText = isActivating
    ? "podrá acceder nuevamente al sistema"
    : "no podrá acceder al sistema hasta que sea activado nuevamente"

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className={`modal-header ${isActivating ? "bg-success" : "bg-danger"} text-white`}>
            <h5 className="modal-title">
              <FaExclamationTriangle className="me-2" /> Confirmar Cambio de Estado
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-1">¿Estás seguro de que deseas {actionText} a:</p>
            <p className="fw-bold">{userName}</p>
            <div className="alert alert-warning mt-3">
              <small>
                <FaExclamationTriangle className="me-1" /> Al {actionText} este residente, {consequenceText}.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button
              type="button"
              className={`btn ${isActivating ? "btn-success" : "btn-danger"}`}
              onClick={handleConfirm}
            >
              {isActivating ? "Activar" : "Desactivar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmStatusChange
