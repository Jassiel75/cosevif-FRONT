import React, { useState } from "react";
import { Button } from "@mui/material";  // Asegúrate de importar Button de MUI
import DetallesCasaModal from "./DetallesCasaModal";
import "../../../styles/admin/Dashboard.css";
import "../../../styles/admin/CasaCard.css";

const CasaCard = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data) {
    return <p className="error">Error: No hay datos de la casa.</p>;
  }

  // Verifica si hay una imagen en Base64
  const imageUrl = data.photo ? `data:image/jpeg;base64,${data.photo}` : null;

  return (
    <div className="casa-card">
      <h3>Casa #{data.houseNumber || "Sin número"}</h3>
      <div className="casa-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt="Casa" className="casa-img" />
        ) : (
          <div className="casa-icon">🏡</div>
        )}
      </div>

      <div className="card-buttons">
        <Button variant="contained" color="primary" className="btn-update">
          Actualizar
        </Button>
        <Button variant="contained" color="secondary" className="btn-details" onClick={() => setModalOpen(true)}>
          Ver detalles
        </Button>
      </div>

      {modalOpen && <DetallesCasaModal casa={data} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default CasaCard;
