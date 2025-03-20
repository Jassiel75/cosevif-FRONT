import React from "react";
import { Button, TextField, InputAdornment, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Ícono de agregar
import "../../../styles/admin/Header.css"; // Asegúrate de que la ruta sea correcta.

const Header = () => {
  return (
    <div className="header-container">
      {/* Nombre del admin */}
      <div className="header-top">
        <Typography variant="h5" className="admin-name">Alejandro Torres</Typography>
      </div>

      {/* Contenedor con los elementos debajo */}
      <div className="header-bottom">
        {/* Nombre de la página */}
        <div className="header-left">
          <Typography variant="h6" className="page-title">Todas las Casas</Typography>
        </div>

        {/* Botón Agregar Casa en el centro */}
        <div className="header-center">
          <Button variant="contained" color="primary" className="btn-add">
            <AddIcon />
            Agregar Casa
          </Button>
        </div>

        {/* Barra de búsqueda y filtro a la derecha */}
        <div className="header-right">
          <TextField
            label="Buscar Casa"
            variant="outlined"
            size="small"
            className="search-input"
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
            }}
          />
          <Button variant="outlined" className="filter-btn">Filtrar</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
