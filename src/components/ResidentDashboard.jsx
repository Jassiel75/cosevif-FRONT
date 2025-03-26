import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "./Sidebar";
import HeaderDashboard from "./residentsAdmin/HeaderResidentAdmin";
import HouseCard from "../components/residentsAdmin/ResidentCard";
import HouseForm from "../components/HouseForm"; // 👈 Importar el nuevo componente
import HouseDetailsModal from "../components/HouseDetailsModal"; // Importamos el modal de detalles
import HouseUpdateModal from "../components/houses/HouseUpdateModal"; // Importamos el modal de actualización




import "../styles/residentsAdmin/ResidentDashboard.css";

function Dashboard() {
  const [houses, setHouses] = useState([]);
  const [showForm, setShowForm] = useState(false); // 👈 Control del modal
  const [selectedHouse, setSelectedHouse] = useState(null); // Control de la casa seleccionada para detalles
  const [houseToUpdate, setHouseToUpdate] = useState(null); // Control de la casa seleccionada para actualizar



  const loadHouses = () => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/admin/houses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setHouses(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener las casas:", err);
      });
  };

  useEffect(() => {
    loadHouses();
  }, []);

  // Función para abrir el modal con los detalles de la casa
  const openHouseDetails = (house) => {
    setSelectedHouse(house);
  };

  // Función para cerrar el modal
  const closeHouseDetails = () => {
    setSelectedHouse(null);
  };

// Función para abrir el modal de actualización de la casa
const openHouseUpdate = (house) => {
  setHouseToUpdate(house); // Establecer la casa seleccionada para la actualización
};

// Función para cerrar el modal de actualización
const closeHouseUpdate = () => {
  setHouseToUpdate(null);
};

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content w-100">
        <div className="container-fluid">
        <HeaderDashboard onOpenForm={() => setShowForm(true)} />

          <div className="row mt-3">
            {houses.map((house) => (
              <div key={house._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <HouseCard
                  number={house.houseNumber}
                  image={
                    house.photo
                      ? `data:image/jpeg;base64,${house.photo}`
                      : null
                  }
                  onViewDetails={() => openHouseDetails(house)}
                  onUpdate={() => openHouseUpdate(house)} // Pasar la casa completa

                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mostrar el modal de detalles si está activo */}
      {selectedHouse && (
        <HouseDetailsModal house={selectedHouse} onClose={closeHouseDetails} />
      )}

       {/* Mostrar el modal de actualización si está activo */}
       {houseToUpdate && (
        <HouseUpdateModal house={houseToUpdate} onClose={closeHouseUpdate} onSuccess={loadHouses} />
      )}

              {/* Mostrar el modal si está activo para registrar casa*/}
      {showForm && (
        <HouseForm
          onClose={() => setShowForm(false)}
          onSuccess={loadHouses}
        />
      )}

      
    </div>
  );
}

export default Dashboard;
