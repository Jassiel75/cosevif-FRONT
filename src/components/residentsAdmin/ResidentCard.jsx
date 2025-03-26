import React from "react";
import "../../styles/residentsAdmin/ResidentCard.css";  // Puedes crear el archivo CSS similar al de la casa, o personalizarlo como lo prefieras.

function ResidentCard({ name, address }) {
  return (
    <div className="card shadow-sm resident-card">
      {/* Imagen de perfil del residente */}
      <div className="card-img-top bg-resident justify-content-center align-items-center">
        <img
          src="https://via.placeholder.com/150"  // Imagen de placeholder por ahora
          alt={`Residente ${name}`}
          className="img-fluid resident-img"
        />
      </div>

      {/* Contenido */}
      <div className="card-body text-center p-3">
        <h6 className="card-title mb-3 fw-bold text-uppercase">{name}</h6>
        <p className="card-text">Dirección: {address}</p>
        <button className="btn btn-details w-100">Ver detalles</button>
      </div>
    </div>
  );
}

export default ResidentCard;
