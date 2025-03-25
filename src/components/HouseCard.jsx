import React from "react";
import "../styles/HouseCard.css";

function HouseCard({ number, image, }) {
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
        <button className="btn btn-update w-100 mb-2">Actualizar</button>
        <button className="btn btn-details w-100"  >Ver detalles</button>
      </div>
    </div>
  );
}

export default HouseCard;
