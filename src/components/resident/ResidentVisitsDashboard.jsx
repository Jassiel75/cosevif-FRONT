"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import VisitTable from "./visits/VisitTable"
import VisitForm from "./visits/VisitForm"
import VisitUpdateModal from "./visits/VisitUpdateModal"
import VisitDetailsModal from "./visits/VisitDetailsModal"
import QRCodeModal from "./visits/QRCodeModal"
import ConfirmDeleteVisit from "./visits/ConfirmDeleteVisit"
import { determineVisitStatus } from "./visits/VisitModel"

function ResidentVisitsDashboard({ showForm, setShowForm }) {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [visitToUpdate, setVisitToUpdate] = useState(null)
  const [visitToDelete, setVisitToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [visitForQR, setVisitForQR] = useState(null)

  // Cargar visitas desde la API
  const loadVisits = () => {
    const token = localStorage.getItem("token")
    setLoading(true)

    axios
      .get("http://localhost:8080/resident/visits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Actualizar el estado de las visitas en tiempo real
        const updatedVisits = res.data.map((visit) => {
          return {
            ...visit,
            status: determineVisitStatus(visit),
          }
        })
        setVisits(updatedVisits)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener las visitas:", err)
        setError("Hubo un error al obtener las visitas.")
        setLoading(false)
      })
  }

  useEffect(() => {
    loadVisits()

    // Actualizar el estado de las visitas cada minuto
    const interval = setInterval(() => {
      setVisits((prevVisits) =>
        prevVisits.map((visit) => ({
          ...visit,
          status: determineVisitStatus(visit),
        })),
      )
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Función para ver detalles de la visita
  const handleView = (visit) => {
    setSelectedVisit(visit)
  }

  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setSelectedVisit(null)
  }

  // Función para actualizar visita
  const handleUpdate = (visit) => {
    setVisitToUpdate(visit)
  }

  // Función para cerrar el modal de actualización
  const handleCloseUpdateModal = () => {
    setVisitToUpdate(null)
  }

  // Función para mostrar el modal de QR
  const handleShowQR = (visit) => {
    setVisitForQR(visit)
    setShowQRModal(true)
  }

  // Función para cerrar el modal de QR
  const handleCloseQRModal = () => {
    setShowQRModal(false)
    setVisitForQR(null)
  }

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (visit) => {
    setVisitToDelete(visit)
    setShowDeleteModal(true)
  }

  // Función para cerrar el modal de confirmación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setVisitToDelete(null)
  }

  // Función para eliminar la visita
  const handleConfirmDelete = () => {
    if (!visitToDelete) return

    const token = localStorage.getItem("token")

    axios
      .delete(`http://localhost:8080/resident/visit/${visitToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Actualizar la lista de visitas después de eliminar
        loadVisits()
        handleCloseDeleteModal()
      })
      .catch((err) => {
        console.error("Error al eliminar la visita:", err)
        setError("Error al eliminar la visita")
        handleCloseDeleteModal()
      })
  }

  // Función para cancelar una visita
  const handleCancelVisit = (visit) => {
    const token = localStorage.getItem("token")

    axios
      .put(
        `http://localhost:8080/resident/visit/${visit.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        // Actualizar la lista de visitas después de cancelar
        loadVisits()
      })
      .catch((err) => {
        console.error("Error al cancelar la visita:", err)
        setError("Error al cancelar la visita")
      })
  }

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <VisitTable
          visits={visits}
          onOpenForm={() => setShowForm(true)}
          onView={handleView}
          onUpdate={handleUpdate}
          onDelete={handleDeleteClick}
          onShowQR={handleShowQR}
          onCancelVisit={handleCancelVisit}
        />
      )}

      {showForm && <VisitForm onClose={() => setShowForm(false)} onSuccess={loadVisits} />}

      {visitToUpdate && (
        <VisitUpdateModal visit={visitToUpdate} onClose={handleCloseUpdateModal} onSuccess={loadVisits} />
      )}

      {selectedVisit && <VisitDetailsModal visit={selectedVisit} onClose={closeDetailsModal} />}

      {showQRModal && visitForQR && <QRCodeModal visit={visitForQR} onClose={handleCloseQRModal} />}

      {showDeleteModal && visitToDelete && (
        <ConfirmDeleteVisit
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleConfirm={handleConfirmDelete}
          visitName={visitToDelete.visitorName || "esta visita"}
        />
      )}
    </div>
  )
}

export default ResidentVisitsDashboard

