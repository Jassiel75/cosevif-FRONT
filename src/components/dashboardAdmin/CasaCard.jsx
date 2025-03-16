import React from "react";
import "../../styles/Dashboard.css";

const CasaCard = () => {
  return (
    <div className="casa-card">
      <div className="casa-icon">🏡</div>
      <h3>CASA #201</h3>
      <button className="btn-update">Actualizar</button>
      <button className="btn-details">Ver detalles</button>
    </div>
  );
};

export default CasaCard;
