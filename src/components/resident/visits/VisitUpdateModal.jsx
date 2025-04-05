"use client"

import { useState } from "react"
import axios from "axios"
import "../../../styles/resident/visits/VisitUpdateModal.css"

function VisitUpdateModal({ visit, onClose, onSuccess }) {
  // Formatear la fecha y hora para el input datetime-local
  const formatDateTimeForInput = (dateTimeStr) => {
    if (!dateTimeStr) return ""
    const date = new Date(dateTimeStr)
    return date.toISOString().slice(0, 16) // Formato YYYY-MM-DDThh:mm
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
      // Usar la fecha y hora exactamente como está en el input
      const dateTimeValue = form.dateTime

      const visitData = {
        ...visit, // Mantener los campos originales que no se editan
        visitorName: form.visitorName,
        dateTime: dateTimeValue,
        numPeople: Number.parseInt(form.numPeople),
        description: form.description,
        vehiclePlate: form.vehiclePlate,
        password: form.password,
      }

      console.log("Actualizando visita con datos:", visitData)

      const token = localStorage.getItem("token")
      await axios.put(`http://localhost:8080/resident/visit/${visit.id}`, visitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess() // Recargar la lista de visitas
      onClose() // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar la visita:", error)
      setError(error.response?.data || "Hubo un error al actualizar la visita. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Visita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
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
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Actualizar Visita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VisitUpdateModal

