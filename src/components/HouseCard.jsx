"use client"
import { FaPen, FaTrashAlt, FaEye } from "react-icons/fa" // Importa los iconos de React Icons
import "../styles/HouseCard.css"

function HouseCard({ number, image, onViewDetails, onUpdate, onDelete }) {
  return (
    <div className="card shadow-sm house-card">
      {/* Imagen de la casa */}
      <div className="card-img-top bg-house justify-content-center align-items-center">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={`Casa ${number}`}
          className="img-fluid house-img"
        />
      </div>

      {/* Contenido */}
      <div className="card-body text-center p-3">
        <h6 className="card-title mb-3 fw-bold text-uppercase">CASA #{number}</h6>

        {/* Contenedor de botones en una línea */}
        <div className="btn-container justify-content-between">
          {/* Botón de actualizar con icono azul */}
          <button className="btn btn-update" onClick={onUpdate}>
            <FaPen />
          </button>

          {/* Botón de eliminar con icono rojo */}
          <button className="btn btn-delete" onClick={onDelete}>
            <FaTrashAlt />
          </button>

          {/* Botón de detalles con icono café */}
          <button className="btn btn-details" onClick={onViewDetails}>
            <FaEye />
          </button>
        </div>
      </div>
    </div>
  )
}

export default HouseCard

