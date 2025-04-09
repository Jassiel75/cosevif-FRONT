"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "./Layout"
import ResidentTable from "../components/residentsAdmin/ResidentTable"
import ResidentForm from "../components/residentsAdmin/ResidentForm"
import ResidentUpdateModal from "../components/residentsAdmin/ResidentUpdateModal"
import ResidentDetailsModal from "../components/residentsAdmin/ResidentDetailsModal"
import ConfirmDeleteResident from "../components/residentsAdmin/ConfirmDeleteResident"
import ConfirmStatusChange from "../components/alerts/ConfirmStatusChange"

import "../styles/residentsAdmin/ResidentDashboard.css"

import { API_URL } from "../auth/IP"

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

  // Update the handleToggleStatus function and add state for status confirmation modal
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [residentToToggle, setResidentToToggle] = useState(null)

  // Obtener residentes desde la API
  // Modificar la función loadResidents para asegurarse de que todos los residentes tengan status true
  const loadResidents = () => {
    const token = localStorage.getItem("token")
    setLoading(true)

    axios
    .get(`${API_URL}/admin/residents`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Procesar los residentes y aplicar los estados guardados en localStorage
        const residentsWithStatus = res.data.map((resident) => {
          // Intentar obtener el estado guardado en localStorage
          const savedStatus = localStorage.getItem(`resident_status_${resident.id}`)

          // Si existe un estado guardado, usarlo; de lo contrario, usar true como predeterminado
          const status = savedStatus !== null ? savedStatus === "true" : true

          return {
            ...resident,
            status: status,
          }
        })

        setResidents(residentsWithStatus)
        setFilteredResidents(residentsWithStatus)
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

  // Function to open the status confirmation modal
  const handleToggleStatusClick = (resident) => {
    setResidentToToggle(resident)
    setShowStatusModal(true)
  }

  // Function to close the status confirmation modal
  const handleCloseStatusModal = () => {
    setShowStatusModal(false)
    setResidentToToggle(null)
  }

  // Function to confirm and execute the status change
  const handleConfirmStatusChange = () => {
    if (!residentToToggle) return

    // Cambiar el estado localmente
    const newStatus = !residentToToggle.status

    // Guardar el nuevo estado en localStorage para que persista después de recargar
    localStorage.setItem(`resident_status_${residentToToggle.id}`, String(newStatus))

    // Actualizar el estado en la interfaz
    const updatedResidents = residents.map((resident) => {
      if (resident.id === residentToToggle.id) {
        return { ...resident, status: newStatus }
      }
      return resident
    })

    setResidents(updatedResidents)
    setFilteredResidents(
      filteredResidents.map((resident) => {
        if (resident.id === residentToToggle.id) {
          return { ...resident, status: newStatus }
        }
        return resident
      }),
    )

    setShowStatusModal(false)
    setResidentToToggle(null)
  }

  const handleToggleStatus = (resident) => {
    handleToggleStatusClick(resident)
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
    .delete(`${API_URL}/admin/residents/${residentToDelete.id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Eliminar también el estado guardado en localStorage
        localStorage.removeItem(`resident_status_${residentToDelete.id}`)

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
              onToggleStatus={handleToggleStatusClick}
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

      {showStatusModal && residentToToggle && (
        <ConfirmStatusChange
          show={showStatusModal}
          handleClose={handleCloseStatusModal}
          handleConfirm={handleConfirmStatusChange}
          userName={`${residentToToggle.name} ${residentToToggle.lastName || residentToToggle.surnames}`}
          currentStatus={residentToToggle.status}
        />
      )}
    </Layout>
  )
}

export default ResidentDashboard
