import React from "react";
import { Navbar, Nav } from "react-bootstrap";

function HeaderDashboard() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">COSEVIF Dashboard</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Item>
          <span>Administrador</span>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default HeaderDashboard;
