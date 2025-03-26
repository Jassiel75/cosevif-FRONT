import React from "react";
import "../../styles/residentsAdmin/HeaderResidentAdmin.css"; // Asegúrate de tener un archivo CSS para esta vista

function HeaderResidents({ onOpenForm }) {
  return (
    <div className="container-fluid header-container">
      {/* Parte de arriba: nombre y avatar */}
      <div className="header-top row justify-content-end align-items-center mb-2">
        <div className="col-auto text-end admin-name">
          <span>Alejandro Torres</span><br />
          <small>Admin</small>
        </div>
        <div className="col-auto">
          <img
            src="https://i.pravatar.cc/40" // Usa la imagen de perfil del admin o la de un residente
            alt="Perfil"
            className="rounded-circle ms-2"
            style={{ width: "40px", height: "40px" }}
          />
        </div>
      </div>

      {/* Parte de abajo: 3 secciones en línea */}
      <div className="header-bottom row align-items-center gy-2">
        {/* Izquierda */}
        <div className="col-12 col-md-4 header-left">
          <p className="mb-0">Residentes</p>
          <small>Mostrar Residentes</small>
        </div>

        {/* Centro */}
        <div className="col-12 col-md-4 center">
          <button className="add-house-button" onClick={onOpenForm}>
            <i className="fas fa-plus"></i> Agregar Residente
          </button>
        </div>

        {/* Derecha */}
        <div className="col-12 col-md-4">
          <div className="search-form justify-content-md-end">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar Residente"
              />
            </div>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-filter"></i> Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderResidents;
