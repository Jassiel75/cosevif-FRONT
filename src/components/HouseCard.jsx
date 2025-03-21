import React from "react";
import { Card, Button } from "react-bootstrap";

function HouseCard({ number }) {
  return (
    <Card className="house-card">
      <Card.Body>
        <div className="house-icon">
          <i className="bi bi-house-door-fill"></i>
        </div>
        <Card.Title>CASA #{number}</Card.Title>
        <Button variant="outline-primary" className="mb-2 w-100">
          Ver detalles
        </Button>
        <Button variant="primary" className="w-100">
          Actualizar
        </Button>
      </Card.Body>
    </Card>
  );
}

export default HouseCard;
