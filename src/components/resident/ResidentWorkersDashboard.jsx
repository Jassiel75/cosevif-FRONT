"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import WorkerTable from "./workers/WorkerTable"
import WorkerForm from "./workers/WorkerForm"
import WorkerDetailsModal from "./workers/WorkerDetailsModal"
import WorkerUpdateModal from "./workers/WorkerUpdateModal"
import ConfirmDeleteWorker from "./workers/ConfirmDeleteWorker"

import "../../styles/resident/ResidentWorkersDashboard.css"

function ResidentWorkersDashboard({ showForm, setShowForm }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [workerToDelete, setWorkerToDelete] = useState(null)
  const [workerToUpdate, setWorkerToUpdate] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)

  // 🔹 Obtener trabajadores desde la API y transformar los datos
  const loadWorkers = () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")

    axios
      .get("http://localhost:8080/resident/workerVisits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Worker data from API:", res.data)

        // ⚠️ Solo extraer los objetos `visit`
        const formatted = res.data.map(item => item.visit)
        setWorkers(formatted)

        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener los trabajadores:", err)
        setError("Error al cargar los trabajadores. Por favor, intente nuevamente.")
        setWorkers([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadWorkers()
  }, [])

  const handleView = (worker) => setSelectedWorker(worker)
  const closeDetailsModal = () => setSelectedWorker(null)

  const handleUpdate = (worker) => setWorkerToUpdate(worker)
  const handleCloseUpdateModal = () => setWorkerToUpdate(null)

  const handleToggleStatus = (worker) => {
    const updated = workers.map((w) => (w.id === worker.id ? { ...w, status: !w.status } : w))
    setWorkers(updated)
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
      .delete(`http://localhost:8080/resident/workerVisits/${workerToDelete.id}`, {
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
              workers={workers}
              onView={handleView}
              onUpdate={handleUpdate}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteClick}
              onOpenForm={handleOpenFormFromTable}
            />
          </div>
        )}
      </div>

      {showForm && <WorkerForm onClose={() => setShowForm(false)} onSuccess={loadWorkers} />}
      {workerToUpdate && <WorkerUpdateModal worker={workerToUpdate} onClose={handleCloseUpdateModal} onSuccess={loadWorkers} />}
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
}

export default ResidentWorkersDashboard
