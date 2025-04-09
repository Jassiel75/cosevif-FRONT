"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "./Layout"
import GuardTable from "./guardsAdmin/GuardTable"
import GuardForm from "./guardsAdmin/GuardForm"
import GuardUpdateModal from "./guardsAdmin/GuardUpdateModal"
import GuardDetailsModal from "./guardsAdmin/GuardDetailsModal"
import ConfirmDeleteGuard from "./guardsAdmin/ConfirmDeleteGuard"

import "../styles/guardsAdmin/GuardDashboard.css"

function GuardDashboard() {
  const [guards, setGuards] = useState([])
  const [filteredGuards, setFilteredGuards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [guardToDelete, setGuardToDelete] = useState(null)
  const [guardToUpdate, setGuardToUpdate] = useState(null)
  const [selectedGuard, setSelectedGuard] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Obtener guardias desde la API
  const loadGuards = () => {
    const token = localStorage.getItem("token")
    setLoading(true)

    axios
      .get("http://localhost:8080/admin/guards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGuards(res.data)
        setFilteredGuards(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener los guardias:", err)
        setGuards([])
        setFilteredGuards([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadGuards()
  }, [])

  // Función para filtrar guardias basado en el término de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredGuards(guards)
      return
    }

    const filtered = guards.filter((guard) => {
      const searchableFields = [
        guard.name || "",
        guard.lastName || guard.surnames || "",
        guard.username || "",
        guard.email || "",
        guard.phone || "",
      ]

      return searchableFields.some((field) => field.toLowerCase().includes(term.toLowerCase()))
    })

    setFilteredGuards(filtered)
  }

  // Función para ver detalles del guardia
  const handleView = (guard) => {
    setSelectedGuard(guard)
  }

  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setSelectedGuard(null)
  }

  // Función para actualizar guardia
  const handleUpdate = (guard) => {
    setGuardToUpdate(guard)
  }

  // Función para cerrar el modal de actualización
  const handleCloseUpdateModal = () => {
    setGuardToUpdate(null)
  }

  // Función para cambiar el estado del guardia (activo/inactivo)
  const handleToggleStatus = (guard) => {
    const token = localStorage.getItem("token")
    const updatedGuard = { ...guard, status: !guard.status }

    axios
      .put(`http://localhost:8080/admin/guards/${guard.id}`, updatedGuard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Actualizar la lista de guardias después de cambiar el estado
        loadGuards()
      })
      .catch((err) => {
        console.error("Error al cambiar el estado del guardia:", err)
      })
  }

  // Función para abrir el formulario de agregar guardia
  const handleOpenForm = () => {
    setShowForm(true)
  }

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (guard) => {
    setGuardToDelete(guard)
    setShowDeleteModal(true)
  }

  // Función para cerrar el modal de confirmación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setGuardToDelete(null)
  }

  // Función para eliminar el guardia
  const handleConfirmDelete = () => {
    if (!guardToDelete) return

    const token = localStorage.getItem("token")

    axios
      .delete(`http://localhost:8080/admin/guards/${guardToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Actualizar la lista de guardias después de eliminar
        loadGuards()
        handleCloseDeleteModal()
      })
      .catch((err) => {
        console.error("Error al eliminar el guardia:", err)
        handleCloseDeleteModal()
      })
  }

  return (
    <Layout
      title="Guardias"
      subtitle="Gestión de Guardias"
      onOpenForm={handleOpenForm}
      viewType="guards"
      onSearch={handleSearch}
    >
      <div className="row mt-3">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="col-12">
            <GuardTable
              guards={filteredGuards}
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

      {showForm && <GuardForm onClose={() => setShowForm(false)} onSuccess={loadGuards} />}

      {guardToUpdate && (
        <GuardUpdateModal guard={guardToUpdate} onClose={handleCloseUpdateModal} onSuccess={loadGuards} />
      )}

      {selectedGuard && <GuardDetailsModal guard={selectedGuard} onClose={closeDetailsModal} />}

      {showDeleteModal && guardToDelete && (
        <ConfirmDeleteGuard
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          guardName={`${guardToDelete.name} ${guardToDelete.lastName || guardToDelete.surnames || ""}`}
        />
      )}
    </Layout>
  )
}

export default GuardDashboard
