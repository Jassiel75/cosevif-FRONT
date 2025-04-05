"use client"

import { useEffect, useState } from "react"
import WorkerTable from "./workers/WorkerTable"
import WorkerForm from "./workers/WorkerForm"
import WorkerDetailsModal from "./workers/WorkerDetailsModal"
import WorkerUpdateModal from "./workers/WorkerUpdateModal"
import ConfirmDeleteWorker from "./workers/ConfirmDeleteWorker"

import "../../styles/resident/ResidentWorkersDashboard.css"

function ResidentWorkersDashboard({ showForm, setShowForm }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [workerToDelete, setWorkerToDelete] = useState(null)
  const [workerToUpdate, setWorkerToUpdate] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)

  // Obtener trabajadores desde la API
  const loadWorkers = () => {
    const token = localStorage.getItem("token")
    setLoading(true)

    // Simulamos datos para demostración
    setTimeout(() => {
      const mockWorkers = [
        {
          id: 1,
          name: "Roberto Sánchez",
          identification: "12345678",
          profession: "Plomero",
          company: "Servicios Rápidos",
          status: true,
          startDate: "2025-04-15",
          endDate: "2025-04-16",
          phone: "555-1234",
          vehicle: "Camioneta Ford",
          licensePlate: "ABC-123",
        },
        {
          id: 2,
          name: "Laura Martínez",
          identification: "87654321",
          profession: "Electricista",
          company: "Electro Soluciones",
          status: true,
          startDate: "2025-04-17",
          endDate: "2025-04-17",
          phone: "555-5678",
          vehicle: "Motocicleta Honda",
          licensePlate: "XYZ-789",
        },
        {
          id: 3,
          name: "Miguel Torres",
          identification: "23456789",
          profession: "Jardinero",
          company: "Jardines Verdes",
          status: false,
          startDate: "2025-04-10",
          endDate: "2025-04-12",
          phone: "555-9012",
          vehicle: "Sin vehículo",
          licensePlate: "",
        },
      ]
      setWorkers(mockWorkers)
      setLoading(false)
    }, 1000)

    // En un entorno real, usaríamos axios:
    /*
    axios
      .get("http://localhost:8080/resident/workers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWorkers(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener los trabajadores:", err)
        setWorkers([])
        setLoading(false)
      })
    */
  }

  useEffect(() => {
    loadWorkers()
  }, [])

  // Función para ver detalles del trabajador
  const handleView = (worker) => {
    setSelectedWorker(worker)
  }

  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setSelectedWorker(null)
  }

  // Función para actualizar trabajador
  const handleUpdate = (worker) => {
    setWorkerToUpdate(worker)
  }

  // Función para cerrar el modal de actualización
  const handleCloseUpdateModal = () => {
    setWorkerToUpdate(null)
  }

  // Función para cambiar el estado del trabajador (activo/inactivo)
  const handleToggleStatus = (worker) => {
    // En un entorno real, usaríamos axios para actualizar el estado
    const updatedWorkers = workers.map((w) => (w.id === worker.id ? { ...w, status: !w.status } : w))
    setWorkers(updatedWorkers)
  }

  // Función para abrir el formulario de agregar trabajador desde la tabla
  const handleOpenFormFromTable = () => {
    setShowForm(true)
  }

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (worker) => {
    setWorkerToDelete(worker)
    setShowDeleteModal(true)
  }

  // Función para cerrar el modal de confirmación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setWorkerToDelete(null)
  }

  // Función para eliminar el trabajador
  const handleConfirmDelete = () => {
    if (!workerToDelete) return

    // En un entorno real, usaríamos axios para eliminar
    const updatedWorkers = workers.filter((w) => w.id !== workerToDelete.id)
    setWorkers(updatedWorkers)
    handleCloseDeleteModal()
  }

  return (
    <div className="resident-workers-dashboard">
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

      {workerToUpdate && (
        <WorkerUpdateModal worker={workerToUpdate} onClose={handleCloseUpdateModal} onSuccess={loadWorkers} />
      )}

      {selectedWorker && <WorkerDetailsModal worker={selectedWorker} onClose={closeDetailsModal} />}

      {showDeleteModal && workerToDelete && (
        <ConfirmDeleteWorker
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          workerName={workerToDelete.name}
        />
      )}
    </div>
  )
}

export default ResidentWorkersDashboard

