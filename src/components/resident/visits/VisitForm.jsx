"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, Users, Key, Car, FileText, User, Link } from "lucide-react"
import QRCode from "qrcode"
import "../../../styles/resident/visits/VisitForm.css"
import { API_URL } from "../../../auth/IP"

function VisitForm({ onClose, onSuccess, userData }) {
  const [form, setForm] = useState({
    visitorName: "",
    dateTime: "",
    numPeople: 1,
    description: "",
    vehiclePlate: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false)
  const [qrCodeData, setQrCodeData] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const generateQRCode = async (visitData) => {
    try {
      // Create visit info object for QR code
      const visitInfo = {
        id: visitData.id,
        visitorName: visitData.visitorName,
        dateTime: visitData.dateTime,
        numPeople: visitData.numPeople,
        password: visitData.password,
        vehiclePlate: visitData.vehiclePlate || "N/A",
        scanCount: 0, // Initialize scan count to track usage
        timestamp: new Date().toISOString(),
      }

      // Generate QR code as data URL
      const qrCodeImage = await QRCode.toDataURL(JSON.stringify(visitInfo), {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 300,
      })
      return qrCodeImage
    } catch (error) {
      console.error("Error generating QR code:", error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const date = new Date(form.dateTime)
      const offset = date.getTimezoneOffset() * 60000
      const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 19)

      const visitData = {
        ...form,
        dateTime: localISOTime,
        numPeople: Number.parseInt(form.numPeople),
        status: "PENDING",
        houseId: userData?.house?.id,
      }

      const token = localStorage.getItem("token")

      // Submit the visit data to the server
      const response = await axios.post(`${API_URL}/resident/visit`, visitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Generate QR code for the visit
      const visitWithId = { ...visitData, id: response.data.id || Date.now().toString() }
      const qrCode = await generateQRCode(visitWithId)

      if (qrCode) {
        setQrCodeData(qrCode)
        setQrCodeGenerated(true)

        // Update the visit with the QR code
        try {
          await axios.put(
            `${API_URL}/resident/visit/${visitWithId.id}`,
            { ...visitWithId, qrCode },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )
        } catch (qrUpdateError) {
          console.error("Error updating visit with QR code:", qrUpdateError)
          // Continue even if QR update fails
        }
      }

      onSuccess()
      // Don't close the form yet if we want to show the QR code
      if (!qrCodeGenerated) {
        onClose()
      }
    } catch (error) {
      console.error("Error al registrar la visita:", error)
      setError(error.response?.data || "Hubo un error al registrar la visita.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  useEffect(() => {
    const domain = window.location.origin
    const ResidentId = localStorage.getItem("userId")
    const link = `${domain}/register-visit/${ResidentId}`
    setShareableLink(link)
  }, [])

  return (
    <div className="modal-overlay">
      <div className="visit-form-modal">
        <div className="visit-form-header">
          <h3>Registrar Nueva Visita</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {qrCodeGenerated ? (
          <div className="visit-form-body text-center">
            <h4>¡Visita registrada con éxito!</h4>
            <p>Se ha generado el código QR para esta visita:</p>
            <div className="qr-container my-4">
              <img src={qrCodeData || "/placeholder.svg"} alt="Código QR de la visita" className="qr-image" />
            </div>
            <p className="mb-4">
              Este código QR estará disponible para escanear hasta 2 veces. Después de eso, caducará automáticamente.
            </p>
            <div className="d-flex justify-content-center">
              <button type="button" className="submit-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="visit-form-body">
              {error && <div className="error-alert">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <User size={16} className="field-icon" />
                    Nombre del Visitante
                  </label>
                  <input
                    type="text"
                    name="visitorName"
                    value={form.visitorName}
                    onChange={handleChange}
                    placeholder="Nombre completo del visitante"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} className="field-icon" />
                    Fecha y Hora de Visita
                  </label>
                  <input type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Users size={16} className="field-icon" />
                    Número de Personas
                  </label>
                  <input
                    type="number"
                    name="numPeople"
                    value={form.numPeople}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Key size={16} className="field-icon" />
                    Contraseña para Acceso
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Contraseña de acceso"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Car size={16} className="field-icon" />
                    Placas del Vehículo (opcional)
                  </label>
                  <input
                    type="text"
                    name="vehiclePlate"
                    value={form.vehiclePlate}
                    onChange={handleChange}
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FileText size={16} className="field-icon" />
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Motivo de la visita"
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {shareableLink && (
                <div className="shareable-link-container">
                  <div className="link-header">
                    <Link size={16} className="link-icon" />
                    <span>Enlace para compartir con tu visita:</span>
                  </div>
                  <div className="link-input-group">
                    <input type="text" value={shareableLink} readOnly />
                    <button type="button" className="copy-button" onClick={copyLinkToClipboard}>
                      {linkCopied ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="visit-form-footer">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Visita"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default VisitForm
