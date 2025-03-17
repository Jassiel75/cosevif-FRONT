import React from "react";
import "../../styles/Dashboard.css";

const CasaCard = ({ data }) => {
  if (!data) {
    return <p className="error">Error: No hay datos de la casa.</p>;
  }

  console.log("Renderizando Casa:", data); // 🔥 Verificar si recibe datos correctamente

  return (
    <div className="casa-card">
      <div className="casa-icon">🏡</div>
      <h3>Casa #{data.houseNumber || "Sin número"}</h3>
      <p><strong>Dirección:</strong> {data.address || "No disponible"}</p>
      <p><strong>Descripción:</strong> {data.description || "Sin descripción"}</p>
      {data.photo && <img src={data.photo} alt="Casa" className="casa-img" />}
      <button className="btn-update">Actualizar</button>
      <button className="btn-details">Ver detalles</button>
    </div>
  );
};

export default CasaCard;
