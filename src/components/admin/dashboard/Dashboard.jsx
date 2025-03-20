import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Typography } from "@mui/material";

import Header from "./Header";
import Sidebar from "./Sidebar"; // No es necesario ../../ ya que Sidebar está en el mismo nivel
import CasaCard from "./CasaCard"; // Importamos el componente CasaCard

import "../../../styles/admin/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [casas, setCasas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCasas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/admin/houses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCasas(response.data);
      } catch (err) {
        setError("No se pudieron cargar las casas.");
      }
    };

    fetchCasas();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <div className="dashboard-main">
          {error && <Typography color="error">{error}</Typography>}

          <Grid container spacing={2}>
            {casas.length > 0 ? (
              casas.map((casa) => (
                <Grid
                  item
                  key={casa.id}
                  xs={12} // Ocupa todo el ancho en pantallas pequeñas
                  sm={6}  // Ocupa la mitad del ancho en pantallas medianas
                  md={3}  // Ocupa un cuarto del ancho en pantallas grandes
                >
                  {/* Usamos CasaCard para cada casa */}
                  <CasaCard casa={casa} />
                </Grid>
              ))
            ) : (
              <Typography>No hay casas registradas.</Typography>
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
