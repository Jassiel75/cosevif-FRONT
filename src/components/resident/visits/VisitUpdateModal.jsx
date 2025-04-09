"use client"

import { useState } from "react"
import axios from "axios"
import { Calendar, Users, Key, Car, FileText, User } from "lucide-react"
import "../../../styles/resident/visits/VisitUpdateModal.css"
import { API_URL } from "../../../auth/IP"

function VisitUpdateModal({ visit, onClose, onSuccess }) {
  // Formatear la fecha y hora para el input datetime-local
  const formatDateTimeForInput = (dateTimeStr) => {
    if (!dateTimeStr) return ""
    const date = new Date(dateTimeStr)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [form, setForm] = useState({
    visitorName: visit.visitorName || "",
    dateTime: formatDateTimeForInput(visit.dateTime) || "",
    numPeople: visit.numPeople || 1,
    description: visit.description || "",
    vehiclePlate: visit.vehiclePlate || "",
    password: visit.password || "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Ajustar zona horaria para que coincida con la hora seleccionada por el usuario
      const date = new Date(form.dateTime)
      const offset = date.getTimezoneOffset() * 60000
      const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 19)

      const visitData = {
        ...visit, // Mantener los campos originales
        visitorName: form.visitorName,
        dateTime: localISOTime, // Fecha ajustada
        numPeople: Number.parseInt(form.numPeople),
        description: form.description,
        vehiclePlate: form.vehiclePlate,
        password: form.password,
      }

      console.log("Actualizando visita con datos:", visitData)

      const token = localStorage.getItem("token")
      await axios.put(`${API_URL}/resident/visit/${visit.id}`, visitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar la visita:", error)
      setError(error.response?.data || "Hubo un error al actualizar la visita. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="visit-update-modal">
        <div className="visit-update-header">
          <h3>Actualizar Visita</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="visit-update-body">
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
                <input type="number" name="numPeople" value={form.numPeople} onChange={handleChange} min="1" required />
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
                  placeholder="Contraseña para el guardia"
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
          </div>

          <div className="visit-update-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar Visita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VisitUpdateModal
