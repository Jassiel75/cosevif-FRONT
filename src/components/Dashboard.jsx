"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import HouseCard from "./HouseCard"
import HouseForm from "./HouseForm"
import HouseDetailsModal from "./HouseDetailsModal"
import HouseUpdateModal from "./houses/HouseUpdateModal"
import ConfirmDeleteHouse from "./alerts/ConfirmDeleteHouse"
import Layout from "./Layout"
import { FaHome } from "react-icons/fa" // Importamos los iconos

import "../styles/Dashboard.css"

function Dashboard() {
  const [houses, setHouses] = useState([])
  const [filteredHouses, setFilteredHouses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [houseToUpdate, setHouseToUpdate] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [houseToDelete, setHouseToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadHouses = () => {
    setLoading(true)
    const token = localStorage.getItem("token")

    axios
      .get("http://localhost:8080/admin/houses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setHouses(res.data)
        setFilteredHouses(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener las casas:", err)
        // Para propósitos de demostración, crear casas de ejemplo
        setHouses([])
        setFilteredHouses([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadHouses()
  }, [])

  // Función para filtrar casas basado en el término de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredHouses(houses)
      return
    }

    const filtered = houses.filter((house) => {
      const searchableFields = [
        house.houseNumber?.toString() || "",
        house.street || "",
        house.address || "",
        house.description || "",
      ]

      return searchableFields.some((field) => field.toLowerCase().includes(term.toLowerCase()))
    })

    setFilteredHouses(filtered)
  }

  // Función para abrir el modal con los detalles de la casa
  const openHouseDetails = (house) => {
    setSelectedHouse(house)
  }

  // Función para cerrar el modal
  const closeHouseDetails = () => {
    setSelectedHouse(null)
  }

  // Función para abrir el modal de actualización de la casa
  const openHouseUpdate = (house) => {
    setHouseToUpdate(house)
  }

  // Función para cerrar el modal de actualización
  const closeHouseUpdate = () => {
    setHouseToUpdate(null)
  }

  // Función para eliminar la casa
  const handleDelete = (id) => {
    const token = localStorage.getItem("token")
    axios
      .delete(`http://localhost:8080/admin/houses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const updatedHouses = houses.filter((house) => house.id !== id)
        setHouses(updatedHouses)
        setFilteredHouses(updatedHouses)
        setShowDeleteModal(false)
      })
      .catch((err) => {
        console.error("Error al eliminar la casa:", err)
      })
  }

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (house) => {
    setHouseToDelete(house)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setHouseToDelete(null)
  }

  const handleOpenForm = () => {
    setShowForm(true)
  }

  return (
    <Layout title="Todas las Casas" onOpenForm={handleOpenForm} viewType="houses" onSearch={handleSearch}>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="houses-grid">
          {filteredHouses.length === 0 ? (
            <div className="no-houses">
              {searchTerm ? (
                <h3>No se encontraron casas con "{searchTerm}"</h3>
              ) : (
                <>
                  <h3>No hay casas registradas</h3>
                  <button className="add-house-btn" onClick={handleOpenForm}>
                    <FaHome className="me-1" /> Agregar Casa
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredHouses.map((house) => (
              <div key={house._id} className="house-grid-item">
                <HouseCard
                  number={house.houseNumber}
                  image={house.photo ? `data:image/jpeg;base64,${house.photo}` : null}
                  onViewDetails={() => openHouseDetails(house)}
                  onUpdate={() => openHouseUpdate(house)}
                  onDelete={() => openDeleteModal(house)}
                />
              </div>
            ))
          )}
        </div>
      )}

      {selectedHouse && <HouseDetailsModal house={selectedHouse} onClose={closeHouseDetails} />}
      {houseToUpdate && <HouseUpdateModal house={houseToUpdate} onClose={closeHouseUpdate} onSuccess={loadHouses} />}
      {showDeleteModal && (
        <ConfirmDeleteHouse
          show={showDeleteModal}
          handleClose={closeDeleteModal}
          handleConfirm={() => handleDelete(houseToDelete.id)}
          houseNumber={houseToDelete.houseNumber}
        />
      )}
      {showForm && <HouseForm onClose={() => setShowForm(false)} onSuccess={loadHouses} />}
    </Layout>
  )
}

export default Dashboard
