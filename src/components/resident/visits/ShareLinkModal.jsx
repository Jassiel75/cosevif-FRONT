"use client"
import { useState, useEffect } from "react"
import { FaCopy, FaWhatsapp, FaEnvelope, FaCheck } from "react-icons/fa"
import "../../../styles/resident/visits/ShareLinkModal.css"
import { API_URL } from "../../../auth/IP"	

function ShareLinkModal({ visit, onClose }) {
  const [registrationLink, setRegistrationLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")

  // Agregar estas funciones al inicio del componente
  function formatDate(dateTimeStr) {
    if (!dateTimeStr) return "N/A"

    // Si la fecha viene en formato ISO 8601 (con T), convertirla a objeto Date
    // Si viene en formato YYYY-MM-DDThh:mm (del input), mantenerla como está
    let date
    if (dateTimeStr.includes("T")) {
      date = new Date(dateTimeStr)
    } else {
      // Dividir la fecha y hora
      const [datePart, timePart] = dateTimeStr.split(" ")
      date = new Date(`${datePart}T${timePart || "00:00"}`)
    }

    // Formatear fecha para México (día/mes/año)
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  function formatTime(dateTimeStr) {
    if (!dateTimeStr) return "N/A"

    // Si la fecha viene en formato ISO 8601 (con T), convertirla a objeto Date
    // Si viene en formato ISO 8601 (con T), convertirla a objeto Date
    // Si viene en formato YYYY-MM-DDThh:mm (del input), mantenerla como está
    let date
    if (dateTimeStr.includes("T")) {
      date = new Date(dateTimeStr)
    } else {
      // Dividir la fecha y hora
      const [datePart, timePart] = dateTimeStr.split(" ")
      date = new Date(`${datePart}T${timePart || "00:00"}`)
    }

    // Formatear hora para México (hora:minutos)
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Actualizar la función para generar el enlace correcto
  const generateRegistrationLink = (residentId) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/register-visit/${residentId}`
  }

  useEffect(() => {
    if (!visit) return

    // Get the resident's ID from localStorage
    const userId = localStorage.getItem("userId")

    // Generate the link using the resident's ID
    const link = generateRegistrationLink(userId)
    setRegistrationLink(link)

    // Actualizar el tiempo restante cada minuto
    const interval = setInterval(() => {
      const visitDate = new Date(visit.dateTime)
      const now = new Date()

      // Restar una hora para que el enlace expire una hora antes de la visita
      const expiryDate = new Date(visitDate)
      expiryDate.setHours(expiryDate.getHours() - 1)

      const diffMs = expiryDate.getTime() - now.getTime()

      if (diffMs <= 0) {
        setTimeLeft("El enlace ha expirado")
        clearInterval(interval)
      } else {
        // Calcular horas y minutos
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        setTimeLeft(`${diffHours}h ${diffMinutes}m`)
      }
    }, 60000)

    // Ejecutar una vez al inicio
    const visitDate = new Date(visit.dateTime)
    const now = new Date()
    const expiryDate = new Date(visitDate)
    expiryDate.setHours(expiryDate.getHours() - 1)
    const diffMs = expiryDate.getTime() - now.getTime()

    if (diffMs <= 0) {
      setTimeLeft("El enlace ha expirado")
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`${diffHours}h ${diffMinutes}m`)
    }

    return () => clearInterval(interval)
  }, [visit])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareViaWhatsApp = () => {
    const message = `Te invito a registrarte para tu visita: ${registrationLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const shareViaEmail = () => {
    const subject = "Registro para visita"
    const body = `Te invito a registrarte para tu visita utilizando este enlace: ${registrationLink}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (!visit) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Compartir Enlace de Registro</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="visit-info mb-3">
              <h6>{visit.visitorName}</h6>
              <p className="mb-1">
                <strong>Fecha:</strong> {formatDate(visit.dateTime)}
              </p>
              <p className="mb-1">
                <strong>Hora:</strong> {formatTime(visit.dateTime)}
              </p>
            </div>

            <div className="link-container">
              <div className="input-group mb-3">
                <input type="text" className="form-control" value={registrationLink} readOnly />
                <button className="btn btn-outline-secondary" type="button" onClick={copyToClipboard}>
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              <div className="expiry-info alert alert-warning">
                <p className="mb-0">
                  <strong>Importante:</strong> Este enlace expirará en {timeLeft} o una hora antes de la visita.
                </p>
              </div>
            </div>

            <div className="share-options mt-4">
              <h6>Compartir vía:</h6>
              <div className="d-flex justify-content-center gap-3 mt-2">
                <button className="btn btn-success" onClick={shareViaWhatsApp}>
                  <FaWhatsapp className="me-2" /> WhatsApp
                </button>
                <button className="btn btn-primary" onClick={shareViaEmail}>
                  <FaEnvelope className="me-2" /> Email
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareLinkModal

