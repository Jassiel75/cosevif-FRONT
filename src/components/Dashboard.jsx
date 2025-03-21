import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
 import Sidebar from "./Sidebar"; // Asegúrate de tener este componente
 import HeaderDashboard from "../components/HeaderDashboard"; // Asegúrate de tener este componente
 import HouseCard from "../components/HouseCard"; // Asegúrate de tener este componente
import "../styles/Dashboard.css"; // Estilos para el Dashboard

function Dashboard() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content w-100">
        <Container fluid>
          {/* Header */}
          <HeaderDashboard />

          {/* Sección de Casas */}
          <Row className="mt-4">
            <Col xs={12} className="text-end">
              <Button variant="outline-primary" className="add-house-btn">
                + Agregar Casa
              </Button>
            </Col>
          </Row>
          
          <Row className="mt-3">
            {Array.from({ length: 12 }, (_, i) => (
              <Col key={i} xs={12} sm={6} md={4} lg={3}>
                <HouseCard number={201 + i} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Dashboard;
