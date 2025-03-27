import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "./Sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import HouseCard from "../components/HouseCard";
import HouseForm from "../components/HouseForm"; // 👈 Importar el nuevo componente
import HouseDetailsModal from "../components/HouseDetailsModal"; // Importamos el modal de detalles
import HouseUpdateModal from "../components/houses/HouseUpdateModal"; // Importamos el modal de actualización
import ConfirmDeleteHouse from "../components/alerts/ConfirmDeleteHouse"; // Importar el nuevo componente




import "../styles/Dashboard.css";

function Dashboard() {
  const [houses, setHouses] = useState([]);
  const [showForm, setShowForm] = useState(false); // 👈 Control del modal
  const [selectedHouse, setSelectedHouse] = useState(null); // Control de la casa seleccionada para detalles
  const [houseToUpdate, setHouseToUpdate] = useState(null); // Control de la casa seleccionada para actualizar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);



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


  // Función para eliminar la casa
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/admin/houses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const updatedHouses = houses.filter((house) => house.id !== id);
        setHouses(updatedHouses); // Actualizar el estado
        setShowDeleteModal(false); // Cerrar el modal después de eliminar
      })
      .catch((err) => {
        console.error("Error al eliminar la casa:", err);
      });
  };



   // Función para abrir el modal de confirmación de eliminación
   const openDeleteModal = (house) => {
    setHouseToDelete(house);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setHouseToDelete(null);
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
                  onDelete={() => openDeleteModal(house)} // Abre el modal para confirmar eliminación
                  


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
      

      {/* Mostrar el modal de confirmación de eliminación */}
      {showDeleteModal && (
        <ConfirmDeleteHouse
          show={showDeleteModal}
          handleClose={closeDeleteModal}
          handleConfirm={() => handleDelete(houseToDelete.id)} // Confirmar eliminación
          houseNumber={houseToDelete.houseNumber} // Número de la casa para mostrar en el modal
        />
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
