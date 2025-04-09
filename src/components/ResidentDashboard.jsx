"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "./Layout"
import ResidentTable from "../components/residentsAdmin/ResidentTable"
import ResidentForm from "../components/residentsAdmin/ResidentForm"
import ResidentUpdateModal from "../components/residentsAdmin/ResidentUpdateModal"
import ResidentDetailsModal from "../components/residentsAdmin/ResidentDetailsModal"
import ConfirmDeleteResident from "../components/residentsAdmin/ConfirmDeleteResident"

import "../styles/residentsAdmin/ResidentDashboard.css"

function ResidentDashboard() {
  const [residents, setResidents] = useState([])
  const [filteredResidents, setFilteredResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState(null)
  const [residentToUpdate, setResidentToUpdate] = useState(null)
  const [selectedResident, setSelectedResident] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Obtener residentes desde la API
  const loadResidents = () => {
    const token = localStorage.getItem("token")
    setLoading(true)

    axios
      .get("http://localhost:8080/admin/residents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResidents(res.data)
        setFilteredResidents(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener los residentes:", err)
        setResidents([])
        setFilteredResidents([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadResidents()
  }, [])

  // Función para filtrar residentes basado en el término de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredResidents(residents)
      return
    }

    const filtered = residents.filter((resident) => {
      const searchableFields = [
        resident.name || "",
        resident.lastName || resident.surnames || "",
        resident.email || "",
        resident.phone || "",
        resident.house?.houseNumber?.toString() || "",
        resident.house?.street || resident.street || "",
      ]

      return searchableFields.some((field) => field.toLowerCase().includes(term.toLowerCase()))
    })

    setFilteredResidents(filtered)
  }

  // Función para ver detalles del residente
  const handleView = (resident) => {
    setSelectedResident(resident)
  }

  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setSelectedResident(null)
  }

  const handleUpdate = (resident) => {
    setResidentToUpdate(resident)
  }

  const handleCloseUpdateModal = () => {
    setResidentToUpdate(null)
  }

  const handleToggleStatus = (resident) => {
    console.log("Cambiar estado:", resident)

    // Implementación básica para cambiar el estado
    const token = localStorage.getItem("token")
    const updatedResident = { ...resident, status: !resident.status }

    axios
      .put(`http://localhost:8080/admin/residents/${resident.id}`, updatedResident, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Actualizar la lista de residentes después de cambiar el estado
        loadResidents()
      })
      .catch((err) => {
        console.error("Error al cambiar el estado del residente:", err)
        alert("Error al cambiar el estado del residente")
      })
  }

  // Función para abrir el formulario de agregar residente
  const handleOpenForm = () => {
    setShowForm(true)
  }

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (resident) => {
    setResidentToDelete(resident)
    setShowDeleteModal(true)
  }

  // Función para cerrar el modal de confirmación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setResidentToDelete(null)
  }

  // Función para eliminar el residente
  const handleConfirmDelete = () => {
    if (!residentToDelete) return

    const token = localStorage.getItem("token")

    axios
      .delete(`http://localhost:8080/admin/residents/${residentToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Actualizar la lista de residentes después de eliminar
        loadResidents()
        handleCloseDeleteModal()
      })
      .catch((err) => {
        console.error("Error al eliminar el residente:", err)
        alert("Error al eliminar el residente")
        handleCloseDeleteModal()
      })
  }

  return (
    <Layout
      title="Residentes"
      subtitle="Mostrar Residentes"
      onOpenForm={handleOpenForm}
      viewType="residents"
      onSearch={handleSearch}
    >
      <div className="row mt-3">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="col-12">
            <ResidentTable
              residents={filteredResidents}
              onView={handleView}
              onUpdate={handleUpdate}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteClick}
              onOpenForm={handleOpenForm}
              searchTerm={searchTerm}
            />
          </div>
        )}
      </div>

      {showForm && <ResidentForm onClose={() => setShowForm(false)} onSuccess={loadResidents} />}

      {residentToUpdate && (
        <ResidentUpdateModal resident={residentToUpdate} onClose={handleCloseUpdateModal} onSuccess={loadResidents} />
      )}

      {selectedResident && <ResidentDetailsModal resident={selectedResident} onClose={closeDetailsModal} />}

      {showDeleteModal && residentToDelete && (
        <ConfirmDeleteResident
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          residentName={`${residentToDelete.name} ${residentToDelete.lastName || residentToDelete.surnames}`}
        />
      )}
    </Layout>
  )
}

export default ResidentDashboard
