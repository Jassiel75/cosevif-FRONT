"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import axios from "axios"
import VisitTable from "./visits/VisitTable"
import VisitForm from "./visits/VisitForm"
import VisitUpdateModal from "./visits/VisitUpdateModal"
import VisitDetailsModal from "./visits/VisitDetailsModal"
import QRCodeModal from "./visits/QRCodeModal"
import ShareLinkModal from "./visits/ShareLinkModal"
import ConfirmDeleteVisit from "./visits/ConfirmDeleteVisit"
import { determineVisitStatus } from "./visits/VisitModel"

const ResidentVisitsDashboard = forwardRef(({ showForm, setShowForm, userData }, ref) => {
  const [visits, setVisits] = useState([])
  const [filteredVisits, setFilteredVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [visitToUpdate, setVisitToUpdate] = useState(null)
  const [visitToDelete, setVisitToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showShareLinkModal, setShowShareLinkModal] = useState(false)
  const [visitForQR, setVisitForQR] = useState(null)
  const [visitForShareLink, setVisitForShareLink] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

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
        setFilteredVisits(updatedVisits)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener las visitas:", err)
        setError("Hubo un error al obtener las visitas.")
        setLoading(false)

        // Para desarrollo, si la API falla, mostrar datos de ejemplo
        const mockVisits = [
          {
            id: "1",
            visitorName: "Juan Pérez",
            dateTime: new Date(Date.now() + 86400000).toISOString(), // Mañana
            numPeople: 2,
            description: "Visita familiar",
            vehiclePlate: "ABC123",
            password: "1234",
            status: "PENDIENTE",
          },
          {
            id: "2",
            visitorName: "María González",
            dateTime: new Date(Date.now() - 86400000).toISOString(), // Ayer
            numPeople: 3,
            description: "Reunión de amigos",
            vehiclePlate: "XYZ789",
            password: "5678",
            status: "CADUCADO",
          },
          {
            id: "3",
            visitorName: "Carlos Rodríguez",
            dateTime: new Date(Date.now() + 3600000).toISOString(), // En una hora
            numPeople: 1,
            description: "Entrega de paquete",
            vehiclePlate: "",
            password: "9012",
            status: "EN_PROGRESO",
          },
        ]

        const updatedMockVisits = mockVisits.map((visit) => ({
          ...visit,
          status: determineVisitStatus(visit),
        }))

        setVisits(updatedMockVisits)
        setFilteredVisits(updatedMockVisits)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadVisits()

    // Actualizar el estado de las visitas cada minuto
    const interval = setInterval(() => {
      setVisits((prevVisits) => {
        const updated = prevVisits.map((visit) => ({
          ...visit,
          status: determineVisitStatus(visit),
        }))
        setFilteredVisits(filterVisits(updated, searchTerm))
        return updated
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Función para filtrar visitas basado en el término de búsqueda
  const filterVisits = (visitsToFilter, term) => {
    if (!term || !term.trim()) {
      return visitsToFilter
    }

    const normalizedTerm = term.toLowerCase().trim()

    return visitsToFilter.filter((visit) => {
      // Campos en los que buscar (incluyendo todos los campos numéricos)
      const searchableFields = [
        visit.visitorName || "",
        visit.description || "",
        visit.vehiclePlate || "",
        visit.password || "",
        visit.status || "",
        // Convertir la fecha a un formato legible para búsqueda
        new Date(visit.dateTime).toLocaleDateString("es-MX") || "",
        new Date(visit.dateTime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) || "",
        // Campos numéricos convertidos a string para búsqueda
        visit.numPeople?.toString() || "",
        visit.id?.toString() || "",
      ]

      // Buscar en todos los campos
      return searchableFields.some((field) => field.toLowerCase().includes(normalizedTerm))
    })
  }

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)
    setFilteredVisits(filterVisits(visits, term))
  }

  // Exponer el método de búsqueda al componente padre
  useImperativeHandle(
    ref,
    () => ({
      handleSearch: (term) => {
        console.log("Searching visits for:", term)
        setSearchTerm(term)
        const filtered = filterVisits(visits, term)
        console.log("Filtered visits:", filtered.length)
        setFilteredVisits(filtered)
      },
    }),
    [visits],
  ) // Add visits as a dependency

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

  // Función para mostrar el modal de compartir enlace
  const handleShowShareLink = (visit) => {
    setVisitForShareLink(visit)
    setShowShareLinkModal(true)
  }

  // Función para cerrar el modal de compartir enlace
  const handleCloseShareLinkModal = () => {
    setShowShareLinkModal(false)
    setVisitForShareLink(null)
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

        // Para desarrollo, si la API falla, eliminar de la lista local
        const updatedVisits = visits.filter((v) => v.id !== visitToDelete.id)
        setVisits(updatedVisits)
        setFilteredVisits(filterVisits(updatedVisits, searchTerm))
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

        // Para desarrollo, si la API falla, actualizar localmente
        const updatedVisits = visits.map((v) => {
          if (v.id === visit.id) {
            return { ...v, status: "CANCELADO" }
          }
          return v
        })
        setVisits(updatedVisits)
        setFilteredVisits(filterVisits(updatedVisits, searchTerm))
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
          visits={filteredVisits}
          onOpenForm={() => setShowForm(true)}
          onView={handleView}
          onUpdate={handleUpdate}
          onDelete={handleDeleteClick}
          onShowQR={handleShowQR}
          onShowShareLink={handleShowShareLink}
          onCancelVisit={handleCancelVisit}
          searchTerm={searchTerm}
        />
      )}

      {showForm && <VisitForm onClose={() => setShowForm(false)} onSuccess={loadVisits} userData={userData} />}

      {visitToUpdate && (
        <VisitUpdateModal
          visit={visitToUpdate}
          onClose={handleCloseUpdateModal}
          onSuccess={loadVisits}
          userData={userData}
        />
      )}

      {selectedVisit && <VisitDetailsModal visit={selectedVisit} onClose={closeDetailsModal} />}

      {showQRModal && visitForQR && <QRCodeModal visit={visitForQR} onClose={handleCloseQRModal} />}

      {showShareLinkModal && visitForShareLink && (
        <ShareLinkModal visit={visitForShareLink} onClose={handleCloseShareLinkModal} />
      )}

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
})

export default ResidentVisitsDashboard
