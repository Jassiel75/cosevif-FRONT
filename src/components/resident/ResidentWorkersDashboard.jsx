"use client"

import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import axios from "axios"
import WorkerTable from "./workers/WorkerTable"
import WorkerForm from "./workers/WorkerForm"
import WorkerDetailsModal from "./workers/WorkerDetailsModal"
import WorkerUpdateModal from "./workers/WorkerUpdateModal"
import ConfirmDeleteWorker from "./workers/ConfirmDeleteWorker"

import "../../styles/resident/ResidentWorkersDashboard.css"

import { API_URL } from "../../auth/IP"

const ResidentWorkersDashboard = forwardRef(({ showForm, setShowForm }, ref) => {
  const [workers, setWorkers] = useState([])
  const [filteredWorkers, setFilteredWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [workerToDelete, setWorkerToDelete] = useState(null)
  const [workerToUpdate, setWorkerToUpdate] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // 🔹 Obtener trabajadores desde la API y transformar los datos
  const loadWorkers = () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")

    axios
    .get(`${API_URL}/resident/workerVisits`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Worker data from API:", res.data)

        // ⚠️ Solo extraer los objetos `visit`
        const formatted = res.data.map((item) => item.visit)
        setWorkers(formatted)
        setFilteredWorkers(formatted)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener los trabajadores:", err)
        setError("Error al cargar los trabajadores. Por favor, intente nuevamente.")
        setWorkers([])
        setFilteredWorkers([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadWorkers()
  }, [])

  // Función para filtrar trabajadores basado en el término de búsqueda
  const filterWorkers = (workersToFilter, term) => {
    if (!term || !term.trim()) {
      return workersToFilter
    }

    const normalizedTerm = term.toLowerCase().trim()

    return workersToFilter.filter((worker) => {
      // Campos en los que buscar (incluyendo todos los campos numéricos)
      const searchableFields = [
        worker.workerName || "",
        worker.address || "",
        // Campos numéricos convertidos a string para búsqueda
        worker.age?.toString() || "",
        worker.id?.toString() || "",
        // Convertir la fecha a un formato legible para búsqueda
        new Date(worker.dateTime).toLocaleDateString("es-MX") || "",
        new Date(worker.dateTime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) || "",
      ]

      // Buscar en todos los campos
      return searchableFields.some((field) => field.toLowerCase().includes(normalizedTerm))
    })
  }

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)
    setFilteredWorkers(filterWorkers(workers, term))
  }

  // Exponer el método de búsqueda al componente padre
  useImperativeHandle(
    ref,
    () => ({
      handleSearch: (term) => {
        console.log("Searching workers for:", term)
        setSearchTerm(term)
        const filtered = filterWorkers(workers, term)
        console.log("Filtered workers:", filtered.length)
        setFilteredWorkers(filtered)
      },
    }),
    [workers],
  ) // Add workers as a dependency

  const handleView = (worker) => setSelectedWorker(worker)
  const closeDetailsModal = () => setSelectedWorker(null)

  const handleUpdate = (worker) => setWorkerToUpdate(worker)
  const handleCloseUpdateModal = () => setWorkerToUpdate(null)

  const handleToggleStatus = (worker) => {
    const updated = workers.map((w) => (w.id === worker.id ? { ...w, status: !w.status } : w))
    setWorkers(updated)
    setFilteredWorkers(filterWorkers(updated, searchTerm))
  }

  const handleOpenFormFromTable = () => setShowForm(true)

  const handleDeleteClick = (worker) => {
    setWorkerToDelete(worker)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setWorkerToDelete(null)
  }

  const handleConfirmDelete = () => {
    if (!workerToDelete) return
    const token = localStorage.getItem("token")

    axios
    .delete(`${API_URL}/resident/workerVisits/${workerToDelete.id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        loadWorkers()
        handleCloseDeleteModal()
      })
      .catch((err) => {
        console.error("Error al eliminar el trabajador:", err)
        setError("Error al eliminar el trabajador. Por favor, intente nuevamente.")
        handleCloseDeleteModal()
      })
  }

  return (
    <div className="resident-workers-dashboard">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mt-3">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="col-12">
            <WorkerTable
              workers={filteredWorkers}
              onView={handleView}
              onUpdate={handleUpdate}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteClick}
              onOpenForm={handleOpenFormFromTable}
              searchTerm={searchTerm}
            />
          </div>
        )}
      </div>

      {showForm && <WorkerForm onClose={() => setShowForm(false)} onSuccess={loadWorkers} />}
      {workerToUpdate && (
        <WorkerUpdateModal worker={workerToUpdate} onClose={handleCloseUpdateModal} onSuccess={loadWorkers} />
      )}
      {selectedWorker && <WorkerDetailsModal worker={selectedWorker} onClose={closeDetailsModal} />}
      {showDeleteModal && workerToDelete && (
        <ConfirmDeleteWorker
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          workerName={workerToDelete.workerName}
        />
      )}
    </div>
  )
})

export default ResidentWorkersDashboard
