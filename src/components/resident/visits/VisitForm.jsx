"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../../styles/resident/visits/VisitForm.css"

function VisitForm({ onClose, onSuccess, userData }) {
  const [form, setForm] = useState({
    visitorName: "",
    dateTime: "",
    numPeople: 1,
    description: "",
    vehiclePlate: "",
    password: "", // ahora queda en blanco para que el residente la escriba
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para mostrar el link
  const [shareableLink, setShareableLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
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

      await axios.post("http://localhost:8080/resident/visit", visitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess()
      onClose()
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

  // ⚠️ Al montar el componente, generar el link automáticamente
  useEffect(() => {
    const domain = window.location.origin
    const ResidentId = localStorage.getItem("userId")
    // Asegurarse de que el enlace tenga el formato correcto
    const link = `${domain}/register-visit/${ResidentId}`
    setShareableLink(link)
  }, [])

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Visita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Campos de formulario */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre del Visitante</label>
                  <input
                    type="text"
                    name="visitorName"
                    className="form-control"
                    value={form.visitorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha y Hora de Visita</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    className="form-control"
                    value={form.dateTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Número de Personas</label>
                  <input
                    type="number"
                    name="numPeople"
                    className="form-control"
                    value={form.numPeople}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contraseña para Acceso</label>
                  <input
                    type="text"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Placas del Vehículo (opcional)</label>
                  <input
                    type="text"
                    name="vehiclePlate"
                    className="form-control"
                    value={form.vehiclePlate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {userData?.house && (
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Casa asignada:</strong> #{userData.house.houseNumber} - {userData.house.street}
                    </div>
                  </div>
                </div>
              )}

              {/* Link para compartir */}
              {shareableLink && (
                <div className="alert alert-success mt-3">
                  <strong>Enlace para compartir con tu visita:</strong>
                  <div className="input-group mt-2">
                    <input type="text" className="form-control" value={shareableLink} readOnly />
                    <button className="btn btn-outline-primary" type="button" onClick={copyLinkToClipboard}>
                      {linkCopied ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Visita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VisitForm

