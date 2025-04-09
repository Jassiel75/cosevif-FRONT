"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "./Layout"
import GuardTable from "./guardsAdmin/GuardTable"
import GuardForm from "./guardsAdmin/GuardForm"
import GuardUpdateModal from "./guardsAdmin/GuardUpdateModal"
import GuardDetailsModal from "./guardsAdmin/GuardDetailsModal"
import ConfirmDeleteGuard from "./guardsAdmin/ConfirmDeleteGuard"
import ConfirmToggleStatus from "./guardsAdmin/ConfirmToggleStatus"

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

  // Update the handleToggleStatus function and add state for status confirmation modal
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [guardToToggle, setGuardToToggle] = useState(null)

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
        // Procesar los guardias y aplicar los estados guardados en localStorage
        const guardsWithStatus = res.data.map((guard) => {
          // Intentar obtener el estado guardado en localStorage
          const savedStatus = localStorage.getItem(`guard_status_${guard.id}`)

          // Si existe un estado guardado, usarlo; de lo contrario, usar true como predeterminado
          const status = savedStatus !== null ? savedStatus === "true" : true

          return {
            ...guard,
            status: status,
          }
        })

        setGuards(guardsWithStatus)
        setFilteredGuards(guardsWithStatus)
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

  // Function to open the status confirmation modal
  const handleToggleStatusClick = (guard) => {
    setGuardToToggle(guard)
    setShowStatusModal(true)
  }

  // Function to close the status confirmation modal
  const handleCloseStatusModal = () => {
    setShowStatusModal(false)
    setGuardToToggle(null)
  }

  // Function to confirm and execute the status change
  const handleConfirmStatusChange = () => {
    if (!guardToToggle) return

    // Cambiar el estado localmente
    const newStatus = !guardToToggle.status

    // Guardar el nuevo estado en localStorage para que persista después de recargar
    localStorage.setItem(`guard_status_${guardToToggle.id}`, String(newStatus))

    // Actualizar el estado en la interfaz
    const updatedGuards = guards.map((guard) => {
      if (guard.id === guardToToggle.id) {
        return { ...guard, status: newStatus }
      }
      return guard
    })

    setGuards(updatedGuards)
    setFilteredGuards(
      filteredGuards.map((guard) => {
        if (guard.id === guardToToggle.id) {
          return { ...guard, status: newStatus }
        }
        return guard
      }),
    )

    setShowStatusModal(false)
    setGuardToToggle(null)
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
        // Eliminar también el estado guardado en localStorage
        localStorage.removeItem(`guard_status_${guardToDelete.id}`)

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
              onToggleStatus={handleToggleStatusClick}
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

      {showStatusModal && guardToToggle && (
        <ConfirmToggleStatus
          show={showStatusModal}
          handleClose={handleCloseStatusModal}
          handleConfirm={handleConfirmStatusChange}
          guardName={`${guardToToggle.name} ${guardToToggle.lastName || guardToToggle.surnames || ""}`}
          guardStatus={guardToToggle.status}
        />
      )}
    </Layout>
  )
}

export default GuardDashboard
