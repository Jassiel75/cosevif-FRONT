// src/components/admin/dashboard/CasaCard.jsx
import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "../../../styles/admin/CasaCard.css"; // Asegúrate de que la ruta de los estilos sea correcta

const CasaCard = ({ casa }) => {
  return (
    <Card className="casa-card">
      <CardContent>
        <div className="house-icon">
          <Typography variant="h5">CASA #{casa.id}</Typography>
        </div>
        <div className="buttons">
          <Button variant="outlined" color="primary" className="btn-ver-detalles">
            Ver detalles
          </Button>
          <Button variant="outlined" color="secondary" className="btn-actualizar">
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CasaCard;
